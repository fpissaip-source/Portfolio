export interface SceneScrollProgress {
  intro: number;
  desk: number;
  exit: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function updateScrollVariables(): SceneScrollProgress {
  const viewport = Math.max(window.innerHeight, 1);
  const intro = clamp(window.scrollY / viewport);
  const desk = clamp((window.scrollY - viewport * 0.7) / (viewport * 1.4));
  const exit = clamp((window.scrollY - viewport * 2.1) / viewport);

  document.documentElement.style.setProperty("--scene-intro", String(intro));
  document.documentElement.style.setProperty("--scene-desk", String(desk));
  document.documentElement.style.setProperty("--scene-exit", String(exit));

  return { intro, desk, exit };
}
