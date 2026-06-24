import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, RGBELoader } from "three-stdlib";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MODEL = "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/character.enc";
const HDR = "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/char_enviorment.hdr";
const mobile = () => innerWidth <= 1024;

async function decrypt(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
  const encrypted = await response.arrayBuffer();
  const password = new TextEncoder().encode("Character3D#@");
  const hash = await crypto.subtle.digest("SHA-256", password);
  const key = await crypto.subtle.importKey("raw", hash.slice(0, 32), { name: "AES-CBC" }, false, ["decrypt"]);
  return crypto.subtle.decrypt({ name: "AES-CBC", iv: new Uint8Array(encrypted.slice(0, 16)) }, key, encrypted.slice(16));
}

function resetCamera(camera: THREE.PerspectiveCamera) {
  const small = mobile();
  camera.fov = small ? 22 : 14.5;
  camera.zoom = small ? 1 : 1.1;
  camera.position.set(0, small ? 13.25 : 13.1, small ? 16.6 : 24.7);
  camera.updateProjectionMatrix();
}

export default function ThreeScene() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(14.5, innerWidth / innerHeight, 0.1, 1000);
    resetCamera(camera);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile(), powerPreference: "high-performance" });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile() ? 1.4 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xc7a9ff, 1.1);
    keyLight.position.set(-0.5, 2, 3);
    scene.add(keyLight);
    const screenLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
    screenLight.position.set(3, 12, 4);
    scene.add(screenLight);

    new RGBELoader().load(HDR, texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.64;
    });

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(draco);

    let mixer: THREE.AnimationMixer | null = null;
    let head: THREE.Object3D | null = null;
    let screen: any = null;
    let frame = 0;
    const clock = new THREE.Clock();
    const timelines: gsap.core.Timeline[] = [];

    decrypt(MODEL).then(buffer => {
      const objectUrl = URL.createObjectURL(new Blob([buffer]));
      loader.load(objectUrl, gltf => {
        URL.revokeObjectURL(objectUrl);
        const character = gltf.scene;
        scene.add(character);
        mixer = new THREE.AnimationMixer(character);
        head = character.getObjectByName("spine006") || null;
        const neck = character.getObjectByName("spine005") || null;
        let monitor: any = null;

        character.traverse((object: any) => {
          if (object.material?.name === "Material.027") {
            monitor = object;
            monitor.material.transparent = true;
            monitor.material.opacity = 0;
          }
          if (object.name === "screenlight" && object.material) {
            screen = object;
            screen.material.transparent = true;
            screen.material.opacity = 0;
            screen.material.emissive?.set("#c8bfff");
          }
        });

        ["introAnimation", "key1", "key2", "key5", "key6", "typing", "Blink"].forEach(name => {
          const clip = THREE.AnimationClip.findByName(gltf.animations, name);
          if (!clip) return;
          const action = mixer!.clipAction(clip);
          if (name === "introAnimation") { action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; }
          action.play();
        });

        const small = mobile();
        const intro = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        intro.to(character.rotation, { y: small ? 0.45 : 0.7 }, 0).to(camera.position, { z: small ? 28 : 22 }, 0).to(".hero-copy", { opacity: 0, yPercent: 35 }, 0);

        const desk = gsap.timeline({ scrollTrigger: { trigger: ".about", start: small ? "top 75%" : "center 55%", end: small ? "bottom -20%" : "bottom top", scrub: true } });
        desk.to(camera.position, { x: small ? 0.25 : 0, y: small ? 9.1 : 8.4, z: small ? 64 : 75, ease: "power3.inOut" }, 0)
          .to(character.rotation, { y: 0.92, x: 0.12 }, 0)
          .to(".about-copy", { opacity: 0, yPercent: 20 }, 0.35)
          .fromTo(".workspace-copy", { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0 }, 0.6);
        if (neck) desk.to(neck.rotation, { x: small ? 0.5 : 0.6 }, 0.25);
        if (monitor) desk.to(monitor.material, { opacity: 1 }, 0.42).fromTo(monitor.position, { y: -10, z: 2 }, { y: 0, z: 0 }, 0.25);
        if (screen) desk.to(screen.material, { opacity: 1 }, 0.58);

        const exit = gsap.timeline({ scrollTrigger: { trigger: ".career", start: "top 85%", end: "top 20%", scrub: true } });
        exit.to(container, { yPercent: -115, opacity: 0 });
        timelines.push(intro, desk, exit);
        setReady(true);
        ScrollTrigger.refresh();
      }, undefined, console.error);
    }).catch(console.error);

    const pointer = new THREE.Vector2();
    const move = (event: PointerEvent) => { pointer.x = event.clientX / innerWidth * 2 - 1; pointer.y = -(event.clientY / innerHeight * 2 - 1); };
    addEventListener("pointermove", move, { passive: true });

    const resize = () => {
      camera.aspect = innerWidth / innerHeight;
      if (scrollY < 10) resetCamera(camera); else camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, mobile() ? 1.4 : 2));
      ScrollTrigger.refresh();
    };
    addEventListener("resize", resize);

    const render = () => {
      frame = requestAnimationFrame(render);
      if (head && scrollY < 180) {
        head.rotation.y += (pointer.x * 0.42 - head.rotation.y) * 0.08;
        head.rotation.x += (-pointer.y * 0.22 - 0.15 - head.rotation.x) * 0.06;
      }
      screenLight.intensity = screen?.material?.opacity > 0.8 ? 8 + Math.random() * 8 : 0;
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", move);
      removeEventListener("resize", resize);
      timelines.forEach(timeline => timeline.kill());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      renderer.dispose();
      draco.dispose();
      container.replaceChildren();
    };
  }, []);

  return <div className={`scene ${ready ? "is-loaded" : ""}`} ref={host}><div className="loader">LOADING 3D EXPERIENCE</div></div>;
}
