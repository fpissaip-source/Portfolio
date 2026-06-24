import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const HDR_URL =
  "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/char_enviorment.hdr";

const setLighting = (scene: THREE.Scene) => {
  const hemisphere = new THREE.HemisphereLight(0xd8ccff, 0x241829, 1.25);
  scene.add(hemisphere);

  const directionalLight = new THREE.DirectionalLight(0xffd7c2, 0.75);
  directionalLight.position.set(-2.5, 5, 6);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const rimLight = new THREE.DirectionalLight(0xa875ff, 1.35);
  rimLight.position.set(4, 2, -5);
  scene.add(rimLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  scene.add(pointLight);

  let lightsOn = false;
  new RGBELoader().load(
    HDR_URL,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = lightsOn ? 0.72 : 0.22;
      scene.environmentRotation.set(5.76, 85.85, 1);
    },
    undefined,
    () => {
      scene.environmentIntensity = 0.45;
    }
  );

  function setPointLight(screenLight: THREE.Mesh | null) {
    const material = screenLight?.material as THREE.MeshStandardMaterial | undefined;
    pointLight.intensity = material && material.opacity > 0.75
      ? Math.max(3, material.emissiveIntensity * 6)
      : 0;
  }

  function turnOnLights() {
    lightsOn = true;
    gsap.to(scene, { environmentIntensity: 0.72, duration: 1.4, ease: "power2.out" });
    gsap.to(".character-rim", { y: "55%", opacity: 0.8, duration: 1.5 });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
