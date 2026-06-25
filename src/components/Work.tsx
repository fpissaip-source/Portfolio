import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Work = () => {
  useGSAP(() => {
    if (window.innerWidth <= 1024) return;

    const boxes = Array.from(document.querySelectorAll<HTMLElement>(".work-box"));
    const container = document.querySelector<HTMLElement>(".work-container");
    const flex = document.querySelector<HTMLElement>(".work-flex");

    if (!boxes.length || !container || !flex) return;

    const calculateDistance = () => {
      const firstBox = boxes[0].getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const totalWidth = firstBox.width * boxes.length;
      return Math.max(0, totalWidth - containerRect.width);
    };

    let distance = calculateDistance();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${distance}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        id: "work",
        onRefresh: () => {
          distance = calculateDistance();
        },
      },
    });

    timeline.to(flex, {
      x: () => -distance,
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
              <p>
                Persistentes Gedächtnis, Zielverfolgung, Tagebuch, SSE-Chat und
                autonome Workflows.
              </p>
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
              <p>
                PDF-Analyse, Zusammenfassungen, Quiz-Generierung und
                Mock-Klausuren in einer modernen Lernplattform.
              </p>
            </div>
            <WorkImage image="/images/placeholder.webp" alt="StudyForge" />
          </div>

          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>03</h3>
                <div>
                  <h4>TikTok Affiliate</h4>
                  <p>Content & Performance</p>
                </div>
              </div>
              <h4>Results</h4>
              <p>
                1,8 Millionen Views und 103 Verkäufe bereits im ersten Monat.
              </p>
            </div>
            <WorkImage image="/images/placeholder.webp" alt="TikTok Affiliate Projekt" />
          </div>

          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>04</h3>
                <div>
                  <h4>B&amp;B Taxi-Service Essen</h4>
                  <p>Business Website</p>
                </div>
              </div>
              <h4>Features</h4>
              <p>
                SEO-Landingpages, Buchungsanfragen, Service-Übersicht und
                responsives Webdesign.
              </p>
            </div>
            <WorkImage
              image="/images/placeholder.webp"
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
