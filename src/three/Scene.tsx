import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface Props {
  modelUrl: string;
  revealProgress: number;
}

export default function Scene3D({ modelUrl, revealProgress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef(revealProgress);
  const [failed, setFailed] = useState(false);
  revealRef.current = revealProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 1.2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xff9f1c, 2);
    light.position.set(2, 3, 2);
    scene.add(light);

    const placeholder = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff9f1c, wireframe: true })
    );
    scene.add(placeholder);

    let model: THREE.Object3D | null = null;
    const materials: THREE.Material[] = [];
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 2.2 / (Math.max(size.x, size.y, size.z) || 1);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const list = Array.isArray(object.material) ? object.material : [object.material];
          list.forEach((material) => {
            material.transparent = true;
            material.opacity = 0;
            materials.push(material);
          });
        }
      });
      scene.remove(placeholder);
      scene.add(model);
    }, undefined, () => setFailed(true));

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      placeholder.rotation.x += 0.003;
      placeholder.rotation.y += 0.006;
      materials.forEach((material) => {
        material.opacity += (revealRef.current - material.opacity) * 0.06;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      draco.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [modelUrl]);

  return (
    <div ref={containerRef} className="scene3d" aria-hidden="true">
      {failed && <p className="scene3d__fallback">3D-Modell noch nicht hinterlegt.</p>}
    </div>
  );
}
