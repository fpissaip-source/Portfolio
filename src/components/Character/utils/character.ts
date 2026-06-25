import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import createIssaCharacter from "./createIssaCharacter";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loadCharacter = async (): Promise<GLTF> => {
    const gltf = createIssaCharacter();
    const character = gltf.scene;

    character.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;
      }
    });

    await renderer.compileAsync(character, camera, scene);
    return gltf;
  };

  return { loadCharacter };
};

export default setCharacter;
