import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
      <footer className="footer">
        <span>© {new Date().getFullYear()} Issa</span>
        <span className="footer__status">
          <span className="eyebrow">status: online</span>
        </span>
      </footer>
    </main>
  );
}
