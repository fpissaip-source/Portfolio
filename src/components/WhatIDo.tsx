import "./styles/WhatIDo.css";

const services = [
  {
    title: "AI DEV",
    subtitle: "KI-Produkte",
    description: "Ich entwickle moderne Assistenten, Webanwendungen und digitale Werkzeuge.",
    tags: ["TypeScript", "React", "PostgreSQL", "Node.js"],
  },
  {
    title: "BUILD",
    subtitle: "Digitale Produkte & Web-Apps",
    description: "Von der Idee zum fertigen Produkt mit klarem Design und sauberer Technik.",
    tags: ["React", "Vite", "Three.js", "GSAP"],
  },
];

const WhatIDo = () => (
  <section className="whatIDO">
    <div className="what-box"><h2 className="title">WHAT I DO</h2></div>
    <div className="what-box"><div className="what-box-in">
      {services.map((service) => (
        <article className="what-content" key={service.title}>
          <div className="what-content-in">
            <h3>{service.title}</h3><h4>{service.subtitle}</h4><p>{service.description}</p>
            <div className="what-content-flex">{service.tags.map((tag) => <div className="what-tags" key={tag}>{tag}</div>)}</div>
          </div>
        </article>
      ))}
    </div></div>
  </section>
);

export default WhatIDo;
