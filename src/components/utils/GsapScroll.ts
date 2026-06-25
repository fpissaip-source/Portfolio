import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  _character: THREE.Object3D | null,
  _camera: THREE.PerspectiveCamera | null
) {}

export function setAllTimeline() {
  ScrollTrigger.getAll().forEach((trigger) => {
    const id = trigger.vars.id;
    if (typeof id === "string" && id.startsWith("career-")) {
      trigger.kill();
    }
  });

  const timeline = document.querySelector<HTMLElement>(".career-timeline");
  const careerInfo = document.querySelector<HTMLElement>(".career-info");
  const boxes = Array.from(
    document.querySelectorAll<HTMLElement>(".career-info-box")
  );

  if (!timeline || !careerInfo || boxes.length === 0) return;

  const mobile = window.matchMedia("(max-width: 900px)").matches;
  const lineState = { progress: 0 };

  timeline.style.setProperty("--career-progress", "0");

  gsap.to(lineState, {
    progress: 1,
    ease: "none",
    onUpdate: () => {
      timeline.style.setProperty(
        "--career-progress",
        lineState.progress.toFixed(4)
      );
    },
    scrollTrigger: {
      id: "career-line",
      trigger: careerInfo,
      start: mobile ? "top 84%" : "top 72%",
      end: mobile ? "bottom 45%" : "bottom 52%",
      scrub: mobile ? 0.35 : 0.6,
      invalidateOnRefresh: true,
    },
  });

  boxes.forEach((box, index) => {
    gsap.set(box, {
      opacity: 0,
      y: mobile ? 24 : 38,
    });

    gsap.to(box, {
      opacity: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        id: `career-item-${index}`,
        trigger: box,
        start: mobile ? "top 88%" : "top 80%",
        end: mobile ? "top 62%" : "top 60%",
        scrub: mobile ? 0.4 : 0.65,
        invalidateOnRefresh: true,
      },
    });
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
