import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { setInitialCamera } from "./cameraUtils";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement | null>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;

  const canvas3d = canvasDiv.current.getBoundingClientRect();
  renderer.setSize(canvas3d.width, canvas3d.height);
  camera.aspect = canvas3d.width / canvas3d.height;

  if (window.scrollY < 8) {
    setInitialCamera(camera);
  } else {
    camera.updateProjectionMatrix();
  }

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.id !== "work") trigger.kill();
  });

  setCharTimeline(character, camera);
  setAllTimeline();
  ScrollTrigger.refresh();
}
