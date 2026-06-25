import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot =
  "https://raw.githubusercontent.com/MoncyDev/Portfolio-Website/main";

const sources = [
  "src/index.css",
  "src/App.css",
  "src/components/styles/style.css",
  "src/components/styles/Navbar.css",
  "src/components/styles/SocialIcons.css",
  "src/components/styles/Landing.css",
  "src/components/styles/About.css",
  "src/components/styles/WhatIDo.css",
  "src/components/styles/Career.css",
  "src/components/styles/Work.css",
  "src/components/styles/Contact.css",
  "src/components/styles/Cursor.css",
  "src/components/styles/Loading.css",
];

const targetUrl = new URL(
  "../src/styles/generated-components.css",
  import.meta.url
);
const targetPath = fileURLToPath(targetUrl);

await mkdir(fileURLToPath(new URL("../src/styles/", import.meta.url)), {
  recursive: true,
});

const sections = [];

for (const source of sources) {
  const url = `${repositoryRoot}/${source}`;
  const response = await fetch(url, {
    headers: { "user-agent": "issa-portfolio-build" },
  });

  if (!response.ok) {
    throw new Error(
      `Could not download ${source}: ${response.status} ${response.statusText}`
    );
  }

  const css = await response.text();
  sections.push(`/* ${source} */\n${css.trim()}\n`);
  console.log(`✓ ${source}`);
}

await writeFile(
  targetPath,
  `/* Generated before the Vite build. Do not edit manually. */\n\n${sections.join("\n")}`,
  "utf8"
);

console.log("✓ Complete component stylesheet generated");
