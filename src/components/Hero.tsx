import Scene3D from "../three/Scene";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__scene">
        <Scene3D modelUrl="/models/character.glb" revealProgress={1} />
      </div>
      <div className="hero__content">
        <span className="eyebrow">system online</span>
        <h1 className="hero__title">
          Issa
          <br />
          baut Bots, Tools
          <br />
          &amp; Web-Systeme.
        </h1>
        <p className="hero__sub">
          Automation, Trading-Systeme, Full-Stack. Von der Idee bis ins produktive Deployment.
        </p>
      </div>
      <div className="hero__log">
        <div className="hero__log-line">profile: issa</div>
        <div className="hero__log-line">modules loaded</div>
        <div className="hero__log-line">status: online</div>
      </div>
    </section>
  );
}
