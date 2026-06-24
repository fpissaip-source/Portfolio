import * as THREE from "three";

export const MOBILE_BREAKPOINT = 1024;
export const isMobileViewport = () => window.innerWidth <= MOBILE_BREAKPOINT;

export function getInitialCamera() {
  return isMobileViewport()
    ? { fov: 16.5, x: 0, y: 12.95, z: 27.5, zoom: 1 }
    : { fov: 14.5, x: 0, y: 13.1, z: 24.7, zoom: 1.1 };
}

export function getWorkspaceCamera() {
  return isMobileViewport()
    ? { x: 0.2, y: 8.65, z: 57 }
    : { x: 0, y: 8.4, z: 75 };
}

export function setInitialCamera(camera: THREE.PerspectiveCamera) {
  const value = getInitialCamera();
  camera.fov = value.fov;
  camera.zoom = value.zoom;
  camera.position.set(value.x, value.y, value.z);
  camera.rotation.set(0, 0, 0);
  camera.updateProjectionMatrix();
}
