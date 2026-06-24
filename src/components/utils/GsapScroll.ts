import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  _character: THREE.Object3D | null,
  _camera: THREE.PerspectiveCamera | null
) {}

export function setAllTimeline() {
  ScrollTrigger.getById("career")?.kill();
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      id: "career",
      trigger: ".career-section",
      start: "top 70%",
      end: "bottom 60%",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "5%", opacity: 0 }, { maxHeight: "100%", opacity: 1, duration: 1 }, 0)
    .fromTo(".career-info-box", { opacity: 0, y: 35 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.7 }, 0.05);
}
