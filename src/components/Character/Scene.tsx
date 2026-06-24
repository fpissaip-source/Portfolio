import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { isMobileViewport, setInitialCamera } from "./utils/cameraUtils";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / Math.max(end - start, 0.0001));
  return t * t * (3 - 2 * t);
};
const progressBetween = (start: number, end: number) =>
  clamp((window.scrollY - start) / Math.max(end - start, 1));

function getScrollProgress() {
  const viewport = Math.max(window.innerHeight, 1);
  const landing = document.querySelector<HTMLElement>(".landing-section");
  const about = document.querySelector<HTMLElement>(".about-section");
  const what = document.querySelector<HTMLElement>(".whatIDO");
  const introStart = landing?.offsetTop ?? 0;
  const introEnd = introStart + Math.max(landing?.offsetHeight ?? viewport, viewport);
  const aboutTop = about?.offsetTop ?? viewport;
  const aboutHeight = Math.max(about?.offsetHeight ?? viewport, viewport * 0.9);
  const deskStart = aboutTop - viewport * 0.72;
  const deskEnd = aboutTop + aboutHeight * 0.82;
  const exitStart = (what?.offsetTop ?? deskEnd + viewport) + viewport * 0.48;
  return {
    intro: progressBetween(introStart, introEnd),
    desk: progressBetween(deskStart, deskEnd),
    exit: progressBetween(exitStart, exitStart + viewport * 0.75),
  };
}

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const rect = container.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(14.5, rect.width / rect.height, 0.1, 1000);
    setInitialCamera(camera);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileViewport(),
      powerPreference: "high-performance",
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    let disposed = false;
    let frame = 0;
    let character: THREE.Object3D | null = null;
    let head: THREE.Object3D | null = null;
    let neck: THREE.Object3D | null = null;
    let monitor: THREE.Mesh | null = null;
    let monitorStart: THREE.Vector3 | null = null;
    let screen: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const mouse = new THREE.Vector2();
    const clock = new THREE.Clock();
    const lights = setLighting(scene);
    const loading = setProgress(setLoading);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    const onPointerMove = (event: PointerEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      const next = container.getBoundingClientRect();
      camera.aspect = next.width / next.height;
      if (window.scrollY < 8) setInitialCamera(camera);
      else camera.updateProjectionMatrix();
      renderer.setSize(next.width, next.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.5 : 2));
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    loadCharacter()
      .then((gltf) => {
        if (!gltf || disposed) return;
        const animations = setAnimations(gltf);
        if (!isMobileViewport() && hoverDivRef.current) animations.hover(gltf, hoverDivRef.current);
        character = gltf.scene;
        mixer = animations.mixer;
        scene.add(character);
        head = character.getObjectByName("spine006") || null;
        neck = character.getObjectByName("spine005") || null;

        character.traverse((object: any) => {
          const materials = Array.isArray(object.material)
            ? object.material
            : object.material
              ? [object.material]
              : [];
          const monitorMaterial = materials.find(
            (material: THREE.Material) => material.name === "Material.027"
          ) as THREE.MeshStandardMaterial | undefined;

          if (monitorMaterial && object.isMesh) {
            monitor = object as THREE.Mesh;
            monitorStart = monitor.position.clone();
            monitorMaterial.transparent = true;
            monitorMaterial.opacity = 0;
            monitorMaterial.color?.set("#ffffff");
          }

          if (object.name === "screenlight" && object.isMesh) {
            screen = object as THREE.Mesh;
            const material = materials[0] as THREE.MeshStandardMaterial | undefined;
            if (material) {
              material.transparent = true;
              material.opacity = 0;
              material.emissive?.set("#c8bfff");
            }
          }
        });

        loading.loaded().then(() => {
          if (disposed) return;
          window.setTimeout(() => {
            if (disposed) return;
            lights.turnOnLights();
            animations.startIntro();
          }, 900);
        });
      })
      .catch((error) => {
        console.error("Unable to load the 3D portfolio scene:", error);
        loading.clear();
      });

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const progress = getScrollProgress();
      const mobile = isMobileViewport();
      const deskReveal = smoothstep(0.16, 0.78, progress.desk);
      const screenReveal = smoothstep(0.5, 0.9, progress.desk);

      if (character) {
        character.rotation.y = Math.max(progress.intro * 0.7, progress.desk) * (mobile ? 0.82 : 0.92);
        character.rotation.x = progress.desk * 0.12 - progress.exit * 0.16;
        camera.position.x = progress.desk * (mobile ? 0.25 : 0);
        camera.position.y = (mobile ? 13.25 : 13.1) + progress.desk * (mobile ? -4.15 : -4.7);
        camera.position.z = (mobile ? 16.6 : 24.7) + progress.desk * (mobile ? 47.4 : 50.3);
        if (neck) neck.rotation.x = progress.desk * (mobile ? 0.5 : 0.6);
      }

      if (head) {
        if (progress.desk < 0.12) {
          head.rotation.y += (mouse.x * 0.42 - head.rotation.y) * 0.08;
          head.rotation.x += (-mouse.y * 0.22 - 0.15 - head.rotation.x) * 0.06;
        } else {
          head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, mobile ? -0.18 : -0.32, 0.06);
          head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, mobile ? -0.12 : -0.25, 0.06);
        }
      }

      if (monitor && monitorStart) {
        monitor.position.set(
          monitorStart.x,
          monitorStart.y - 10 * (1 - deskReveal),
          monitorStart.z + 2 * (1 - deskReveal)
        );
        (monitor.material as THREE.MeshStandardMaterial).opacity = deskReveal;
      }

      if (screen) {
        const material = screen.material as THREE.MeshStandardMaterial;
        material.opacity = screenReveal;
        material.emissiveIntensity = 1.5 + Math.random() * 3;
        lights.setPointLight(screen);
      }

      container.style.transform = `translate3d(0, ${-progress.exit * 110}%, 0)`;
      container.style.opacity = String(1 - progress.exit);

      const landing = document.querySelector<HTMLElement>(".landing-container");
      if (landing) {
        landing.style.opacity = String(1 - smoothstep(0.08, 0.72, progress.intro));
        landing.style.transform = `translate3d(0, ${progress.intro * 40}%, 0)`;
      }

      const about = document.querySelector<HTMLElement>(".about-section");
      if (about) {
        about.style.opacity = String(1 - smoothstep(0.48, 0.9, progress.desk));
        about.style.transform = `translate3d(0, ${progress.desk * 30}%, 0)`;
      }

      const what = document.querySelector<HTMLElement>(".what-box-in");
      if (what) {
        what.style.display = progress.desk > 0.62 ? "flex" : "none";
        what.style.opacity = String(smoothstep(0.62, 0.9, progress.desk));
      }

      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
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
