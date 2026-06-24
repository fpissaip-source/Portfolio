const technologies = [
  ["React", "RE"],
  ["Next.js", "NX"],
  ["Node.js", "ND"],
  ["Express", "EX"],
  ["MongoDB", "MO"],
  ["MySQL", "MY"],
  ["TypeScript", "TS"],
  ["JavaScript", "JS"],
] as const;

const TechStack = () => {
  return (
    <section className="techstack" aria-labelledby="techstack-title">
      <h2 id="techstack-title">My Techstack</h2>
      <div className="techstack-orbit">
        {technologies.map(([name, mark], index) => (
          <div
            className="techstack-token"
            key={name}
            style={{ "--token-index": index } as React.CSSProperties}
          >
            <strong aria-hidden="true">{mark}</strong>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
