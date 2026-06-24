import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  const modelUrl = "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/character.glb";

  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => new Promise<GLTF | null>((resolve, reject) => {
    loader.load(
      modelUrl,
      async (gltf) => {
        const character = gltf.scene;
        await renderer.compileAsync(character, camera, scene);
        character.traverse((child: any) => {
          if (child.isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = true;
          }
        });
        resolve(gltf);
        setCharTimeline(character, camera);
        setAllTimeline();
        character.getObjectByName("footR")?.position.setY(3.36);
        character.getObjectByName("footL")?.position.setY(3.36);
        dracoLoader.dispose();
      },
      undefined,
      reject
    );
  });

  return { loadCharacter };
};

export default setCharacter;
