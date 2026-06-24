import * as THREE from "three";

export const MOBILE_BREAKPOINT = 1024;

export const isMobileViewport = () => window.innerWidth <= MOBILE_BREAKPOINT;

/**
 * Starts as a tight portrait: face, neck and shoulders only.
 * The mobile camera uses a wider FOV and sits closer so the crop remains
 * comparable to desktop in a narrow portrait viewport.
 */
export function setInitialCamera(camera: THREE.PerspectiveCamera) {
  const mobile = isMobileViewport();

  camera.fov = mobile ? 22 : 14.5;
  camera.zoom = mobile ? 1 : 1.1;
  camera.position.set(0, mobile ? 13.25 : 13.1, mobile ? 16.6 : 24.7);
  camera.rotation.set(0, 0, 0);
  camera.updateProjectionMatrix();
}

export function getWorkspaceCameraTarget() {
  if (isMobileViewport()) {
    return { x: 0.25, y: 9.1, z: 64 };
  }

  return { x: 0, y: 8.4, z: 75 };
}
