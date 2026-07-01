export default function Contact() {
  return (
    <section className="section" id="contact">
      <span className="eyebrow">connect()</span>
      <h2 className="section__title">Lass uns was bauen.</h2>
      <p className="about__text" style={{ marginBottom: 32 }}>
        Offen für Projekte rund um Automation, Bots und Web-Systeme.
      </p>
      <div className="contact__links">
        <a href="mailto:hello@example.com" className="contact__link">
          hello@example.com ↗
        </a>
        <a href="https://github.com/" className="contact__link" target="_blank" rel="noreferrer">
          github ↗
        </a>
      </div>
      <p className="contact__footnote">
        {/* TODO: echte Mail-Adresse & Links eintragen */}
        E-Mail und Links sind Platzhalter — bitte ersetzen.
      </p>
    </section>
  );
}
