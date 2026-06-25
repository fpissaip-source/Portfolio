import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>GitHub</h4>
            <p>
              <a
                href="https://github.com/fpissaip-source"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                github.com/fpissaip-source
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/fpissaip-source"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="[LINKEDIN]"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Built by <span>Issa</span>
              <br /> AI Developer & Creator
            </h2>
            <h5>
              <MdCopyright /> 2026 — Deutschland
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
