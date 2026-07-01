interface SceneProps {
  modelUrl: string;
  revealProgress: number;
}

export default function Scene({ modelUrl, revealProgress }: SceneProps) {
  return (
    <div className="scene" data-model={modelUrl} data-progress={revealProgress}>
      <div className="scene__placeholder" aria-hidden="true" />
    </div>
  );
}
