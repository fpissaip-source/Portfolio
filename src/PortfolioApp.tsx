import "./base.css";
import "./components.css";
import VisualLanding from "./components/VisualLanding";
import About from "./components/About";
import WorkGrid from "./components/WorkGrid";
import Contact from "./components/Contact";

export default function PortfolioApp() {
  return (
    <main>
      <VisualLanding />
      <About />
      <WorkGrid />
      <Contact />
      <footer className="footer">Issa Hareb Portfolio</footer>
    </main>
  );
}
