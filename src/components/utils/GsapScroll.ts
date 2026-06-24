import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getWorkspaceCameraTarget, isMobileViewport } from "../Character/utils/cameraUtils";

function findSceneParts(character: THREE.Object3D) {
  let screenLight: any = null;
  let monitor: any = null;

  character.traverse((object: any) => {
    if (object.material?.name === "Material.027") {
      monitor = object;
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.color.set("#FFFFFF");
    }

    if (object.name === "screenlight" && object.material) {
      screenLight = object;
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive?.set("#C8BFFF");
    }
  });

  return {
    monitor,
    screenLight,
    neckBone: character.getObjectByName("spine005"),
  };
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera | null
) {
  const mobile = isMobileViewport();

  ["character-landing", "character-workspace", "character-exit"].forEach((id) =>
    ScrollTrigger.getById(id)?.kill()
  );

  const tl1 = gsap.timeline({
    scrollTrigger: {
      id: "character-landing",
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      id: "character-workspace",
      trigger: ".about-section",
      start: mobile ? "top 78%" : "center 55%",
      end: mobile ? "bottom -35%" : "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl3 = gsap.timeline({
    scrollTrigger: {
      id: "character-exit",
      trigger: ".whatIDO",
      start: mobile ? "top 72%" : "top top",
      end: mobile ? "center top" : "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl1
    .fromTo(
      ".character-model",
      { xPercent: 0, yPercent: 0 },
      { xPercent: mobile ? -7 : -25, yPercent: mobile ? 2 : 0, duration: 1 },
      0
    )
    .to(".landing-container", { opacity: 0, duration: 0.45 }, 0)
    .to(".landing-container", { yPercent: 35, duration: 0.8 }, 0)
    .fromTo(
      ".about-me",
      { yPercent: mobile ? 10 : -50, opacity: mobile ? 0 : 1 },
      { yPercent: 0, opacity: 1, duration: 1 },
      0
    );

  tl2
    .to(".about-section", { yPercent: mobile ? 8 : 30, duration: 6 }, 0)
    .to(".about-section", { opacity: 0, delay: mobile ? 4 : 3, duration: 2 }, 0)
    .fromTo(
      ".character-model",
      { pointerEvents: "inherit" },
      {
        pointerEvents: "none",
        xPercent: mobile ? -4 : -12,
        yPercent: mobile ? -3 : 0,
        delay: 2,
        duration: 5,
      },
      0
    )
    .fromTo(
      ".what-box-in",
      { display: "none", opacity: 0 },
      { display: "flex", opacity: 1, duration: 0.4, delay: mobile ? 5.2 : 6 },
      0
    )
    .fromTo(
      ".character-rim",
      { opacity: 1, scaleX: 1.4 },
      { opacity: 0, scale: 0, yPercent: -70, duration: 5, delay: 2 },
      0.3
    );

  tl3
    .fromTo(
      ".character-model",
      { yPercent: mobile ? -3 : 0 },
      { yPercent: -115, duration: 4, ease: "none", delay: mobile ? 0 : 1 },
      0
    )
    .fromTo(".whatIDO", { yPercent: 0 }, { yPercent: mobile ? 4 : 15, duration: 2 }, 0);

  if (!character || !camera) return;

  const { monitor, screenLight, neckBone } = findSceneParts(character);
  const workspaceCamera = getWorkspaceCameraTarget();

  if (screenLight?.material) {
    gsap.killTweensOf(screenLight.material);
    gsap.to(screenLight.material, {
      emissiveIntensity: 5.5,
      duration: 0.12,
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
      ease: "steps(2)",
    });
  }

  tl1
    .fromTo(
      character.rotation,
      { y: 0, x: 0 },
      { y: mobile ? 0.5 : 0.7, x: 0, duration: 1 },
      0
    )
    .to(camera.position, { z: mobile ? 29 : 22, duration: 1 }, 0);

  tl2
    .to(
      camera.position,
      {
        x: workspaceCamera.x,
        y: workspaceCamera.y,
        z: workspaceCamera.z,
        duration: 6,
        delay: mobile ? 1.1 : 2,
        ease: "power3.inOut",
      },
      0
    )
    .to(
      character.rotation,
      { y: 0.92, x: 0.12, delay: mobile ? 2 : 3, duration: 3 },
      0
    );

  if (neckBone) {
    tl2.to(neckBone.rotation, { x: mobile ? 0.5 : 0.6, delay: 2, duration: 3 }, 0);
  }

  if (monitor?.material) {
    tl2
      .to(monitor.material, { opacity: 1, duration: 0.8, delay: mobile ? 2.7 : 3.2 }, 0)
      .fromTo(
        monitor.position,
        { y: -10, z: 2 },
        { y: 0, z: 0, delay: mobile ? 1.2 : 1.5, duration: 3 },
        0
      );
  }

  if (screenLight?.material) {
    tl2.to(
      screenLight.material,
      { opacity: 1, duration: 0.8, delay: mobile ? 3.5 : 4.5 },
      0
    );
  }

  tl3.to(character.rotation, { x: -0.04, duration: 2, delay: mobile ? 0 : 1 }, 0);
}

export function setAllTimeline() {
  ScrollTrigger.getById("career")?.kill();

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      id: "career",
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "10%" }, { maxHeight: "100%", duration: 0.5 }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-section",
      { yPercent: 0 },
      { yPercent: isMobileViewport() ? 0 : 20, duration: 0.5, delay: 0.2 },
      0
    );
}
