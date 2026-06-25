import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline" aria-hidden="true">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Self-Employed</h4>
                <h5>AI & Creator</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Aufbau von Lukas AI, TikTok-Affiliate und StudyForge. Autonome
              Systeme, digitale Produkte und Content-Maschinen, die unabhängig
              von Zeit und Ort Einnahmen generieren.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>TikTok Affiliate</h4>
                <h5>Content Creator</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Bereits im ersten Monat erzielte der Content 1,8 Millionen Views
              und 103 Verkäufe. Strategischer Einsatz von TikTok-Algorithmen
              für automatisierte Reichweite und messbare Ergebnisse.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Lead Developer</h4>
                <h5>Lukas AI</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Entwicklung eines vollständig autonomen KI-Agenten mit
              persistentem Gedächtnis, Zielverfolgung und Tagebuch — über
              27.000 Zeilen TypeScript-Code, PostgreSQL und Claude AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
