interface Project {
  ticker: string;
  name: string;
  status: "LIVE" | "PAPER" | "DEPLOYED";
  desc: string;
  stack: string[];
}

const PROJECTS: Project[] = [
  {
    ticker: "QNT",
    name: "Quant Trading Dashboard",
    status: "PAPER",
    desc: "Strategie-Dashboard mit Risikomanagement, Marktanalyse, Backtesting und Telegram-Interface.",
    stack: ["Python", "Alpaca API", "Telegram", "Backtesting"],
  },
  {
    ticker: "SCR",
    name: "ScraperWRLD Bot",
    status: "LIVE",
    desc: "Telegram-gesteuerter Web-Scraper mit konfigurierbaren Diensten und Umgebungsvariablen.",
    stack: ["Python", "Telegram Bot API", "FlareSolverr"],
  },
  {
    ticker: "GGD",
    name: "GuardianGrid",
    status: "DEPLOYED",
    desc: "Destiny-2-Companion-App mit sicherer Session-Verwaltung und Freemium-Funktionen.",
    stack: ["Express", "React", "TypeScript", "Drizzle ORM", "PostgreSQL"],
  },
  {
    ticker: "RTD",
    name: "Road Trip Dashboard",
    status: "DEPLOYED",
    desc: "Dashboard für Roadtrips mit GPS, Tacho, Kosten-Schätzung und Restaurant-Finder.",
    stack: ["JavaScript", "Gemini API", "Geolocation"],
  },
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <span className="eyebrow">portfolio.log</span>
      <h2 className="section__title">Ausgewählte Systeme</h2>
      <div className="ticker-list">
        {PROJECTS.map((project) => (
          <article className="ticker-card" key={project.ticker}>
            <div className="ticker-card__head">
              <span className="ticker-card__symbol">{project.ticker}</span>
              <span className={`ticker-card__status ticker-card__status--${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
            <h3 className="ticker-card__name">{project.name}</h3>
            <p className="ticker-card__desc">{project.desc}</p>
            <ul className="ticker-card__stack">
              {project.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
