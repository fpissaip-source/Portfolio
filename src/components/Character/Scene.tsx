import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { isMobileViewport, setInitialCamera } from "./utils/cameraUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    const containerElement = canvasDiv.current;
    if (!containerElement) return;

    const rect = containerElement.getBoundingClientRect();
    const scene = sceneRef.current;
    let disposed = false;
    let animationFrame = 0;
    let touchDebounce: number | undefined;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileViewport(),
      powerPreference: "high-performance",
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.5 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerElement.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      14.5,
      rect.width / rect.height,
      0.1,
      1000
    );
    setInitialCamera(camera);

    let character: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      touchDebounce = window.setTimeout(() => {
        element?.addEventListener(
          "touchmove",
          (touchEvent: TouchEvent) =>
            handleTouchMove(touchEvent, (x, y) => (mouse = { x, y })),
          { passive: true, once: true }
        );
      }, 160);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const landingDiv = document.getElementById("landingDiv");
    document.addEventListener("mousemove", onMouseMove);
    landingDiv?.addEventListener("touchstart", onTouchStart, { passive: true });
    landingDiv?.addEventListener("touchend", onTouchEnd, { passive: true });

    const onResize = () => {
      if (!character) return;
      handleResize(renderer, camera, canvasDiv, character);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.5 : 2)
      );
    };
    window.addEventListener("resize", onResize);

    loadCharacter()
      .then((gltf) => {
        if (!gltf || disposed) return;

        const animations = setAnimations(gltf);
        if (!isMobileViewport() && hoverDivRef.current) {
          animations.hover(gltf, hoverDivRef.current);
        }

        mixer = animations.mixer;
        character = gltf.scene;
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;

        progress.loaded().then(() => {
          if (disposed) return;
          window.setTimeout(() => {
            if (disposed) return;
            light.turnOnLights();
            animations.startIntro();
          }, 900);
        });
      })
      .catch((error) => {
        console.error("Unable to load the 3D portfolio scene:", error);
        progress.clear();
      });

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }

      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      window.clearTimeout(touchDebounce);
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      if (containerElement.contains(renderer.domElement)) {
        containerElement.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <div className="character-container" aria-hidden="true">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  );
};

export default Scene;
