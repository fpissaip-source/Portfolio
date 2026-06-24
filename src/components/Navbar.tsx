import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | undefined;

const Navbar = () => {
  useEffect(() => {
    const mobile = window.innerWidth <= 1024;
    if (!mobile) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.25,
        speed: 1,
        effects: true,
        autoResize: true,
      });
      smoother.scrollTop(0);
      smoother.paused(true);
    }

    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".header ul a"));
    const clickHandlers = links.map((element) => {
      const handler = (event: Event) => {
        if (smoother && window.innerWidth > 1024) {
          event.preventDefault();
          smoother.scrollTo(element.getAttribute("data-href"), true, "top top");
        }
      };
      element.addEventListener("click", handler);
      return { element, handler };
    });

    const refresh = () => smoother?.refresh();
    window.addEventListener("resize", refresh);
    return () => {
      clickHandlers.forEach(({ element, handler }) => element.removeEventListener("click", handler));
      window.removeEventListener("resize", refresh);
      smoother?.kill();
      smoother = undefined;
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="#landingDiv" className="navbar-title" data-cursor="disable">ISSA</a>
        <a href="https://github.com/fpissaip-source" target="_blank" rel="noreferrer" className="navbar-connect" data-cursor="disable">GitHub</a>
        <ul>
          <li><a data-href="#about" href="#about"><HoverLinks text="ABOUT" /></a></li>
          <li><a data-href="#work" href="#work"><HoverLinks text="WORK" /></a></li>
          <li><a data-href="#contact" href="#contact"><HoverLinks text="CONTACT" /></a></li>
        </ul>
      </div>
      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  );
};

export default Navbar;
