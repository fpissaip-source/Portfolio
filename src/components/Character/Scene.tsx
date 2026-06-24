import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import {
  getInitialCamera,
  getWorkspaceCamera,
  isMobileViewport,
  setInitialCamera,
} from "./utils/cameraUtils";
import { setAllTimeline } from "../utils/GsapScroll";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / Math.max(to - from, 0.0001));
  return t * t * (3 - 2 * t);
};

function progressBetween(scroll: number, start: number, end: number) {
  return clamp((scroll - start) / Math.max(end - start, 1));
}

function cloneMaterials(mesh: THREE.Mesh) {
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map((material) => material.clone());
    return mesh.material;
  }
  mesh.material = mesh.material.clone();
  return [mesh.material];
}

function tintObject(root: THREE.Object3D | undefined, color: string, roughness = 0.62) {
  root?.traverse((object: any) => {
    if (!object.isMesh) return;
    const materials = cloneMaterials(object as THREE.Mesh);
    materials.forEach((material: any) => {
      material.color?.set(color);
      if ("roughness" in material) material.roughness = roughness;
      if ("metalness" in material) material.metalness = 0.05;
    });
  });
}

interface WorkspaceMaterial {
  material: THREE.Material & { opacity: number };
  targetOpacity: number;
}

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileViewport(),
      powerPreference: "high-performance",
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.35 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      14.5,
      rect.width / rect.height,
      0.1,
      1000
    );
    setInitialCamera(camera);

    const lights = setLighting(scene);
    const loading = setProgress(setLoading);
    const { loadCharacter } = setCharacter(renderer, scene, camera);
    const clock = new THREE.Clock();

    let disposed = false;
    let frame = 0;
    let mixer: THREE.AnimationMixer | null = null;
    let character: THREE.Object3D | null = null;
    let head: THREE.Object3D | null = null;
    let neck: THREE.Object3D | null = null;
    let screenLight: THREE.Mesh | null = null;
    const workspaceMaterials: WorkspaceMaterial[] = [];
    const pointer = new THREE.Vector2();

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      const next = container.getBoundingClientRect();
      camera.aspect = next.width / next.height;
      renderer.setSize(next.width, next.height);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.35 : 2)
      );
      if (window.scrollY < 8) setInitialCamera(camera);
      else camera.updateProjectionMatrix();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    loadCharacter()
      .then((gltf) => {
        if (disposed) return;
        character = gltf.scene;
        scene.add(character);

        const animations = setAnimations(gltf);
        mixer = animations.mixer;
        if (!isMobileViewport() && hoverDivRef.current) {
          animations.hover(gltf, hoverDivRef.current);
        }

        head = character.getObjectByName("spine006") || null;
        neck = character.getObjectByName("spine005") || null;

        tintObject(character.getObjectByName("hair"), "#15121b", 0.4);
        tintObject(character.getObjectByName("Eyebrow"), "#17131d", 0.45);
        tintObject(character.getObjectByName("BODY.SHIRT"), "#51408a", 0.72);
        tintObject(character.getObjectByName("Plane.007"), "#b97858", 0.68);
        tintObject(character.getObjectByName("Ear.001"), "#b97858", 0.68);
        tintObject(character.getObjectByName("Hand"), "#b97858", 0.68);
        tintObject(character.getObjectByName("Neck"), "#b97858", 0.68);
        tintObject(character.getObjectByName("Pant"), "#22233a", 0.8);
        tintObject(character.getObjectByName("Shoe"), "#171820", 0.55);
        tintObject(character.getObjectByName("Sole"), "#9d90b2", 0.7);
        tintObject(character.getObjectByName("Keyboard"), "#302b39", 0.45);
        tintObject(character.getObjectByName("Cube.002"), "#27232f", 0.8);
        tintObject(character.getObjectByName("Plane.002"), "#d8d0d7", 0.7);
        tintObject(character.getObjectByName("Plane.003"), "#24212b", 0.5);

        const workspaceNames = [
          "Cube.002",
          "screenlight",
          "Keyboard",
          "Plane",
          "ground",
          "Plane.002",
          "Plane.003",
          "Plane.004",
        ];
        const seenMaterials = new Set<THREE.Material>();
        workspaceNames.forEach((name) => {
          const root = character?.getObjectByName(name);
          root?.traverse((object: any) => {
            if (!object.isMesh) return;
            const materials = cloneMaterials(object as THREE.Mesh);
            materials.forEach((material: any) => {
              material.transparent = true;
              const targetOpacity = material.opacity ?? 1;
              material.opacity = 0;
              material.depthWrite = targetOpacity > 0.5;
              if (!seenMaterials.has(material)) {
                workspaceMaterials.push({ material, targetOpacity });
                seenMaterials.add(material);
              }
              if (name === "screenlight") {
                screenLight = object as THREE.Mesh;
                material.emissive?.set("#c9b7ff");
                material.emissiveIntensity = 2.2;
              }
            });
          });
        });

        setAllTimeline();
        loading.loaded().then(() => {
          if (disposed) return;
          window.setTimeout(() => {
            if (disposed) return;
            lights.turnOnLights();
            animations.startIntro();
          }, 500);
        });
      })
      .catch((error) => {
        console.error("Unable to load the 3D portfolio scene:", error);
        loading.clear();
      });

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const scroll = window.scrollY;
      const viewport = Math.max(window.innerHeight, 1);
      const landing = document.querySelector<HTMLElement>(".landing-section");
      const about = document.querySelector<HTMLElement>(".about-section");
      const what = document.querySelector<HTMLElement>(".whatIDO");
      const career = document.querySelector<HTMLElement>(".career-section");

      const introStart = landing?.offsetTop ?? 0;
      const introEnd = introStart + Math.max(landing?.offsetHeight ?? viewport, viewport);
      const aboutTop = about?.offsetTop ?? introEnd;
      const whatTop = what?.offsetTop ?? aboutTop + viewport;
      const whatHeight = Math.max(what?.offsetHeight ?? viewport, viewport);
      const careerTop = career?.offsetTop ?? whatTop + whatHeight;

      const intro = progressBetween(scroll, introStart, introEnd);
      const desk = progressBetween(
        scroll,
        aboutTop - viewport * 0.42,
        whatTop + whatHeight * (isMobileViewport() ? 0.34 : 0.18)
      );
      const exit = progressBetween(
        scroll,
        careerTop - viewport * 0.92,
        careerTop - viewport * 0.28
      );
      const deskEase = smoothstep(0.04, 0.96, desk);
      const workspaceReveal = smoothstep(0.28, 0.72, desk);

      if (character) {
        const initial = getInitialCamera();
        const workspace = getWorkspaceCamera();
        camera.position.x = THREE.MathUtils.lerp(initial.x, workspace.x, deskEase);
        camera.position.y = THREE.MathUtils.lerp(initial.y, workspace.y, deskEase);
        camera.position.z = THREE.MathUtils.lerp(initial.z, workspace.z, deskEase);
        character.rotation.y = Math.max(intro * 0.58, deskEase * 0.88);
        character.rotation.x = deskEase * 0.1 - exit * 0.08;

        if (neck) neck.rotation.x = deskEase * (isMobileViewport() ? 0.38 : 0.52);
        if (head) {
          if (desk < 0.12) {
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, pointer.x * 0.34, 0.07);
            head.rotation.x = THREE.MathUtils.lerp(
              head.rotation.x,
              -pointer.y * 0.18 - 0.12,
              0.06
            );
          } else {
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, -0.2, 0.05);
            head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.22, 0.05);
          }
        }
      }

      workspaceMaterials.forEach(({ material, targetOpacity }) => {
        material.opacity = targetOpacity * workspaceReveal * (1 - exit);
      });
      if (screenLight) {
        const material = screenLight.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 2 + Math.sin(performance.now() / 140) * 0.35;
        lights.setPointLight(screenLight);
      }

      container.style.transform = `translate3d(0, ${-exit * 105}%, 0)`;
      container.style.opacity = String(1 - smoothstep(0.35, 1, exit));

      const landingContainer = document.querySelector<HTMLElement>(".landing-container");
      if (landingContainer) {
        landingContainer.style.opacity = String(1 - smoothstep(0.18, 0.82, intro));
        landingContainer.style.transform = `translate3d(0, ${intro * 22}%, 0)`;
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
