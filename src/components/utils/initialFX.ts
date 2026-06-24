import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother?.paused(false);
  document.querySelector("main")?.classList.add("main-active");
  gsap.fromTo(".landing-container", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 });
}
