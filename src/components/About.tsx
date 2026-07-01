export default function About() {
  return (
    <section className="section" id="about">
      <span className="eyebrow">whoami</span>
      <h2 className="section__title">Vom Skript zum System.</h2>
      <p className="about__text">
        Ich baue Werkzeuge, die selbst laufen: Trading-Bots, die Marktregime erkennen. Scraper, die
        sich gegen Anti-Bot-Maßnahmen behaupten. Dashboards, die auf dem eigenen Server leben statt
        in fremder Cloud. Der rote Faden ist Automation — Dinge, die einmal richtig gebaut werden
        und danach zuverlässig weiterarbeiten.
      </p>
      <hr className="hairline" />
      <div className="about__grid">
        <div>
          <span className="about__label">Fokus</span>
          <p>Web-Entwicklung, Bot-Systeme, Automation</p>
        </div>
        <div>
          <span className="about__label">Setup</span>
          <p>Eigener Ubuntu-Server, Claude Code via SSH/Tailscale</p>
        </div>
        <div>
          <span className="about__label">Interessen</span>
          <p>Finance & Investing, Systemarchitektur, Roadtrips</p>
        </div>
      </div>
    </section>
  );
}
