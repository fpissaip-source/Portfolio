import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!ScrollTrigger.isTouch) return;

    const cleanups: Array<() => void> = [];

    cardsRef.current.forEach((card) => {
      if (!card) return;
      card.classList.remove("what-noTouch");

      const handleClick = () => {
        card.classList.toggle("what-content-active");
        card.classList.remove("what-sibling");

        const siblings = card.parentElement
          ? Array.from(card.parentElement.children)
          : [];

        siblings.forEach((sibling) => {
          if (sibling !== card && sibling instanceof HTMLElement) {
            sibling.classList.remove("what-content-active");
            sibling.classList.toggle("what-sibling");
          }
        });
      };

      card.addEventListener("click", handleClick);
      cleanups.push(() => card.removeEventListener("click", handleClick));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2" aria-hidden="true">
            <svg width="100%">
              <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              <line x1="100%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
            </svg>
          </div>

          <div
            className="what-content what-noTouch"
            ref={(element) => {
              cardsRef.current[0] = element;
            }}
          >
            <div className="what-border1" aria-hidden="true">
              <svg height="100%">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            </div>
            <div className="what-corner" aria-hidden="true" />
            <div className="what-content-in">
              <h3>AI DEV</h3>
              <h4>Autonome KI-Systeme</h4>
              <p>
                Ich entwickle intelligente Agenten, Chatbots und automatisierte
                Systeme, die eigenständig denken, lernen und handeln.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">TypeScript</div>
                <div className="what-tags">Claude AI</div>
                <div className="what-tags">PostgreSQL</div>
                <div className="what-tags">Node.js</div>
                <div className="what-tags">React</div>
                <div className="what-tags">Express.js</div>
                <div className="what-tags">SSE Streams</div>
                <div className="what-tags">Drizzle ORM</div>
              </div>
              <div className="what-arrow" aria-hidden="true" />
            </div>
          </div>

          <div
            className="what-content what-noTouch"
            ref={(element) => {
              cardsRef.current[1] = element;
            }}
          >
            <div className="what-border1" aria-hidden="true">
              <svg height="100%">
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            </div>
            <div className="what-corner" aria-hidden="true" />
            <div className="what-content-in">
              <h3>BUILD</h3>
              <h4>Digitale Produkte &amp; Web-Apps</h4>
              <p>
                Von der Idee zum fertigen Produkt — Full-Stack Web-Apps,
                Content-Maschinen und System-Automationen mit echtem Impact.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">React</div>
                <div className="what-tags">Vite</div>
                <div className="what-tags">Automation</div>
                <div className="what-tags">Product Strategy</div>
                <div className="what-tags">Content Creation</div>
                <div className="what-tags">Three.js</div>
                <div className="what-tags">GSAP</div>
              </div>
              <div className="what-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
