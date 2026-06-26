import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
    if (window.innerWidth <= 1024) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>01</h3>
                <div>
                  <h4>Lukas AI</h4>
                  <p>Autonomous AI Agent</p>
                </div>
              </div>
              <h4>Features</h4>
              <p>Persistentes Gedächtnis, Zielverfolgung, Tagebuch, SSE-Chat, Higgsfield Studio</p>
            </div>
            <WorkImage image="/images/placeholder.webp" alt="Lukas AI" />
          </div>
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>02</h3>
                <div>
                  <h4>StudyForge</h4>
                  <p>AI Learning Platform</p>
                </div>
              </div>
              <h4>Features</h4>
              <p>PDF-Upload, KI-Analyse, Quiz-Generierung, React, Node.js, OpenAI</p>
            </div>
            <WorkImage image="/images/placeholder.webp" alt="StudyForge" />
          </div>
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>03</h3>
                <div>
                  <h4>TikTok @lucy_srg</h4>
                  <p>Affiliate & Content</p>
                </div>
              </div>
              <h4>Results</h4>
              <p>1,8M Views — 103 Verkäufe — TikTok Affiliate Marketing Strategy</p>
            </div>
            <WorkImage image="/images/placeholder.webp" alt="TikTok @lucy_srg" />
          </div>
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>04</h3>
                <div>
                  <h4>B&B Taxi-Service Essen</h4>
                  <p>Business Website</p>
                </div>
              </div>
              <h4>Features</h4>
              <p>Online-Anfragen, Service-Übersicht, Kundenbewertungen, responsives Design</p>
            </div>
            <WorkImage
              image={`${import.meta.env.BASE_URL}images/taxi-bb-poster.jpg`}
              video={`${import.meta.env.BASE_URL}videos/taxi-bb.mp4`}
              alt="B&B Taxi-Service Essen"
              link="https://taxibbessen.de"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
