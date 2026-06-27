import type { PropsWithChildren } from "react";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I&apos;m</h2>
          <h1>ISSA</h1>
        </div>
        <div className="landing-info">
          <h3>An Autonomous</h3>
          <h2 className="landing-role landing-role-primary">AI Developer</h2>
          <h2 className="landing-role landing-role-secondary">Creator</h2>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Landing;
