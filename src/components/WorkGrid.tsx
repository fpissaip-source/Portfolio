const projects = [
  {
    code: "STF",
    name: "StudyForge",
    description: "Eine Lernplattform, die Dokumente in Zusammenfassungen, Quizfragen und Prüfungsvorbereitung verwandelt.",
    stack: ["React", "TypeScript", "AI"],
  },
  {
    code: "LKS",
    name: "L.U.K.A.S.",
    description: "Ein modulares Assistenzsystem für Analyse, Automatisierung, langfristigen Kontext und wiederkehrende Aufgaben.",
    stack: ["Python", "APIs", "Automation"],
  },
  {
    code: "GGD",
    name: "GuardianGrid",
    description: "Eine Companion-Plattform mit Anmeldung, Charakterdaten, Inventar, Loadouts und intelligenten Analysen.",
    stack: ["React", "OAuth", "Data"],
  },
  {
    code: "TBB",
    name: "TaxiBB Essen",
    description: "Eine lokale Unternehmensplattform mit Buchungsfunktion, Administration, strukturierten Daten und Suchmaschinenoptimierung.",
    stack: ["Web", "Backend", "SEO"],
  },
];

export default function WorkGrid() {
  return (
    <section className="section" id="projects">
      <span className="eyebrow">selected work</span>
      <h2 className="section__title">Ausgewählte Systeme</h2>
      <div className="ticker-list">
        {projects.map((project) => (
          <article className="ticker-card" key={project.code}>
            <div className="ticker-card__head">
              <span className="ticker-card__symbol">{project.code}</span>
              <span className="ticker-card__status">ACTIVE</span>
            </div>
            <h3 className="ticker-card__name">{project.name}</h3>
            <p className="ticker-card__desc">{project.description}</p>
            <ul className="ticker-card__stack">
              {project.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
