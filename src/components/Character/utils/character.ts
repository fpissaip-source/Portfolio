import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";

const MODEL_URL = `${import.meta.env.BASE_URL}models/character.glb`;

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
  );
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () =>
    new Promise<GLTF>((resolve, reject) => {
      loader.load(
        MODEL_URL,
        async (gltf) => {
          const character = gltf.scene;
          await renderer.compileAsync(character, camera, scene);
          character.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = true;
            }
          });
          character.getObjectByName("footR")?.position.setY(3.36);
          character.getObjectByName("footL")?.position.setY(3.36);
          dracoLoader.dispose();
          resolve(gltf);
        },
        undefined,
        reject
      );
    });

  return { loadCharacter };
};

export default setCharacter;
