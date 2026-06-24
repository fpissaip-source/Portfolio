import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, RGBELoader } from "three-stdlib";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/character.enc";
const HDR_URL = "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/char_enviorment.hdr";

async function decryptFile(url: string, password: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
  const encryptedData = await response.arrayBuffer();
  const passwordBuffer = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", passwordBuffer);
  const key = await crypto.subtle.importKey("raw", hash.slice(0, 32), { name: "AES-CBC" }, false, ["decrypt"]);
  const iv = new Uint8Array(encryptedData.slice(0, 16));
  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, encryptedData.slice(16));
}

function isMobile() {
  return window.innerWidth <= 1024;
}

function setInitialCamera(camera: THREE.PerspectiveCamera) {
  const mobile = isMobile();
  camera.fov = mobile ? 22 : 14.5;
  camera.zoom = mobile ? 1 : 1.1;
  camera.position.set(0, mobile ? 13.25 : 13.1, mobile ? 16.6 : 24.7);
  camera.updateProjectionMatrix();
}

export default function Scene() {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(14.5, innerWidth / innerHeight, 0.1, 1000);
    setInitialCamera(camera);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile(), powerPreference: "high-performance" });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile() ? 1.4 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xc7a9ff, 1.1);
    keyLight.position.set(-0.5, 2, 3);
    scene.add(keyLight);
    const screenPoint = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
    screenPoint.position.set(3, 12, 4);
    scene.add(screenPoint);

    new RGBELoader().load(HDR_URL, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.64;
    });

    let character: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let head: THREE.Object3D | null = null;
    let neck: THREE.Object3D | null = null;
    let monitor: any = null;
    let screen: any = null;
    const cleanups: Array<() => void> = [];
    let frame = 0;
    const clock = new THREE.Clock();

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(draco);

    decryptFile(MODEL_URL, "Character3D#@")
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer]));
        loader.load(url, (gltf) => {
          URL.revokeObjectURL(url);
          character = gltf.scene;
          scene.add(character);
          mixer = new THREE.AnimationMixer(character);
          head = character.getObjectByName("spine006") || null;
          neck = character.getObjectByName("spine005") || null;

          character.traverse((object: any) => {
            if (object.material?.name === "Material.027") {
              monitor = object;
              monitor.material.transparent = true;
              monitor.material.opacity = 0;
              monitor.material.color.set("#ffffff");
            }
            if (object.name === "screenlight" && object.material) {
              screen = object;
              screen.material.transparent = true;
              screen.material.opacity = 0;
              screen.material.emissive?.set("#c8bfff");
            }
          });

          const intro = THREE.AnimationClip.findByName(gltf.animations, "introAnimation");
          if (intro) {
            const action = mixer.clipAction(intro);
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.play();
          }
          ["key1", "key2", "key5", "key6", "typing", "Blink"].forEach((name) => {
            const clip = THREE.AnimationClip.findByName(gltf.animations, name);
            if (clip) mixer!.clipAction(clip).play();
          });

          const mobile = isMobile();
          const introTimeline = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
          introTimeline
            .to(character!.rotation, { y: mobile ? 0.45 : 0.7 }, 0)
            .to(camera.position, { z: mobile ? 28 : 22 }, 0)
            .to(".hero-copy", { opacity: 0, yPercent: 35 }, 0);

          const deskTimeline = gsap.timeline({ scrollTrigger: { trigger: ".about", start: mobile ? "top 75%" : "center 55%", end: mobile ? "bottom -20%" : "bottom top", scrub: true } });
          deskTimeline
            .to(camera.position, { x: mobile ? 0.25 : 0, y: mobile ? 9.1 : 8.4, z: mobile ? 64 : 75, ease: "power3.inOut" }, 0)
            .to(character!.rotation, { y: 0.92, x: 0.12 }, 0)
            .to(".about-copy", { opacity: 0, yPercent: 20 }, 0.35)
            .fromTo(".workspace-copy", { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0 }, 0.6);
          if (neck) deskTimeline.to(neck.rotation, { x: mobile ? 0.5 : 0.6 }, 0.25);
          if (monitor) deskTimeline.to(monitor.material, { opacity: 1 }, 0.42).fromTo(monitor.position, { y: -10, z: 2 }, { y: 0, z: 0 }, 0.25);
          if (screen) deskTimeline.to(screen.material, { opacity: 1 }, 0.58);

          const exitTimeline = gsap.timeline({ scrollTrigger: { trigger: ".career", start: "top 85%", end: "top 20%", scrub: true } });
          exitTimeline.to(container, { yPercent: -115, opacity: 0 });

          cleanups.push(() => introTimeline.kill(), () => deskTimeline.kill(), () => exitTimeline.kill());
          setLoaded(true);
          ScrollTrigger.refresh();
        }, undefined, console.error);
      })
      .catch(console.error);

    const pointer = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / innerHeight) * 2 + 1;
    };
    addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      if (scrollY < 10) setInitialCamera(camera);
      else camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile() ? 1.4 : 2));
      ScrollTrigger.refresh();
    };
    addEventListener("resize", onResize);

    const render = () => {
      frame = requestAnimationFrame(render);
      if (head && scrollY < 180) {
        head.rotation.y += (pointer.x * 0.42 - head.rotation.y) * 0.08;
        head.rotation.x += (-pointer.y * 0.22 - 0.15 - head.rotation.x) * 0.06;
      }
      if (screen?.material?.opacity > 0.8) screenPoint.intensity = 8 + Math.random() * 8;
      else screenPoint.intensity = 0;
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onPointer);
      removeEventListener("resize", onResize);
      cleanups.forEach((cleanup) => cleanup());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      renderer.dispose();
      draco.dispose();
      container.replaceChildren();
    };
  }, []);

  return <div className={`scene ${loaded ? "is-loaded" : ""}`} ref={host}><div className="loader">LOADING 3D EXPERIENCE</div></div>;
}
