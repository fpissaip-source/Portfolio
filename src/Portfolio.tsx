import Scene from "./Scene";

const projects = [
  ["01", "Lukas AI", "Autonomous AI Agent"],
  ["02", "StudyForge", "AI Learning Platform"],
  ["03", "@lucy_srg", "TikTok Affiliate"],
  ["04", "B&B Taxi Essen", "Business Website"],
];

export default function Portfolio() {
  return <main>
    <header className="nav"><a href="#top" className="brand">ISSA</a><nav><a href="#about">ABOUT</a><a href="#work">WORK</a><a href="#contact">CONTACT</a></nav><a href="https://github.com/fpissaip-source" target="_blank" rel="noreferrer">GITHUB</a></header>
    <Scene />
    <section className="hero" id="top"><div className="hero-copy"><p>Hello! I'm</p><h1>ISSA</h1><div className="role"><span>AI Developer</span><span>Creator</span></div></div><div className="scroll-label">SCROLL TO EXPLORE</div></section>
    <section className="about section" id="about"><div className="about-copy"><p className="eyebrow">ABOUT ME</p><h2>Ich baue autonome KI-Systeme, digitale Produkte und Content-Maschinen mit echtem Impact.</h2><p>Mein Fokus liegt auf intelligenter Automation, starken Nutzererlebnissen und skalierbaren Projekten.</p></div></section>
    <section className="workspace section"><div className="workspace-copy"><p className="eyebrow">WHAT I DO</p><h2>Von der Idee bis zum laufenden System.</h2><div className="service-grid"><article><strong>AI DEV</strong><h3>Autonome Systeme</h3><p>Agenten, Chatbots und Workflows, die lernen und handeln.</p></article><article><strong>BUILD</strong><h3>Digitale Produkte</h3><p>Web-Apps, Automationen und moderne Markenauftritte.</p></article></div></div></section>
    <section className="career section"><p className="eyebrow">EXPERIENCE</p><h2>My career <i>&</i><br />experience</h2><div className="timeline"><article><time>2023</time><div><h3>Self-Employed</h3><p>AI & Creator</p></div><p>Aufbau von Lukas AI, TikTok-Affiliate und StudyForge.</p></article><article><time>NOW</time><div><h3>Lead Developer</h3><p>Lukas AI</p></div><p>Autonomer KI-Agent mit Gedächtnis und Zielverfolgung.</p></article></div></section>
    <section className="work section" id="work"><p className="eyebrow">SELECTED PROJECTS</p><h2>My <span>Work</span></h2><div className="project-grid">{projects.map(([number,name,type])=><article className="project" key={name}><div className="project-number">{number}</div><div className="project-visual"><span>{name}</span></div><p>{type}</p><h3>{name}</h3></article>)}</div></section>
    <footer className="contact section" id="contact"><p className="eyebrow">CONTACT</p><h2>Let's build something<br /><span>unforgettable.</span></h2><div className="contact-links"><a href="https://github.com/fpissaip-source" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.tiktok.com/@lucy_srg" target="_blank" rel="noreferrer">TikTok ↗</a></div><p className="copyright">© 2026 Issa</p></footer>
  </main>;
}
