import { useEffect, useRef } from "react";
import { useLoading } from "../context/LoadingProvider";
import { setProgress } from "./Loading";
import { setCharTimeline, setAllTimeline } from "./utils/GsapScroll";
import "./styles/CharacterImage.css";

const CharacterImage = () => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    setProgress((val) => setLoading(val));

    const setupGsap = () => {
      if (document.querySelector(".landing-section")) {
        setCharTimeline(null, null as any);
        setAllTimeline();
      } else {
        setTimeout(setupGsap, 150);
      }
    };
    setTimeout(setupGsap, 100);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);
      if (tiltRef.current) {
        if (window.scrollY < 600) {
          tiltRef.current.style.transform = `perspective(900px) rotateY(${currentX}deg) rotateX(${currentY}deg)`;
        } else {
          targetX = 0;
          targetY = 0;
          tiltRef.current.style.transform = `perspective(900px) rotateY(0deg) rotateX(0deg)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMouseMove = (e: MouseEvent) => {
      if (window.scrollY > 600) return;
      targetX = ((e.clientX / window.innerWidth) * 2 - 1) * 14;
      targetY = -((e.clientY / window.innerHeight) * 2 - 1) * 9;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 600) return;
      targetX = ((e.touches[0].clientX / window.innerWidth) * 2 - 1) * 14;
      targetY = -((e.touches[0].clientY / window.innerHeight) * 2 - 1) * 9;
    };

    const onTouchEnd = () => {
      setTimeout(() => {
        targetX = 0;
        targetY = 0;
      }, 1200);
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchmove", onTouchMove);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  const charSrc = `${import.meta.env.BASE_URL}images/issa-character.png`;

  return (
    <div className="character-container">
      <div className="character-model">
        <div className="character-rim" />
        <div className="char-img-tilt" ref={tiltRef}>
          <div
            className="char-img-front"
            style={{ backgroundImage: `url("${charSrc}")` }}
          />
        </div>
        <div className="character-ground-shadow" />
        <div className="character-hover" />
      </div>
    </div>
  );
};

export default CharacterImage;
