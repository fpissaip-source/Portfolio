import * as THREE from "three";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const hemisphere = new THREE.HemisphereLight(0xd8ccff, 0x241829, 1.35);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xffd7c2, 0.9);
  keyLight.position.set(-2.5, 5, 6);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xa875ff, 1.45);
  rimLight.position.set(4, 2, -5);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0x8bb8ff, 0.45);
  fillLight.position.set(-4, 1, -2);
  scene.add(fillLight);

  const screenPointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  screenPointLight.position.set(3, 12, 4);
  scene.add(screenPointLight);

  function setPointLight(screenLight: THREE.Mesh | null) {
    const material = screenLight?.material as THREE.MeshStandardMaterial | undefined;
    screenPointLight.intensity =
      material && material.opacity > 0.75
        ? Math.max(3, material.emissiveIntensity * 6)
        : 0;
  }

  function turnOnLights() {
    gsap.to(hemisphere, { intensity: 1.35, duration: 1.2, ease: "power2.out" });
    gsap.to(keyLight, { intensity: 0.9, duration: 1.2, ease: "power2.out" });
    gsap.to(rimLight, { intensity: 1.45, duration: 1.2, ease: "power2.out" });
    gsap.to(".character-rim", { y: "55%", opacity: 0.8, duration: 1.5 });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
