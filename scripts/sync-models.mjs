import { createCipheriv, createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(
  new URL("../public/models/", import.meta.url)
);

await mkdir(outputDirectory, { recursive: true });

const characterPath = fileURLToPath(
  new URL("../public/models/character.glb", import.meta.url)
);
const hdrPath = fileURLToPath(
  new URL("../public/models/char_enviorment.hdr", import.meta.url)
);

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// If files already exist locally (committed to repo), skip download entirely
if (await fileExists(characterPath)) {
  console.log("✓ character.glb already present, skipping download");
} else {
  console.log("↓ Downloading character.glb");
  const response = await fetch(
    "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/character.glb",
    { headers: { "user-agent": "issa-portfolio-build" } }
  );
  if (!response.ok) {
    throw new Error(`Could not download character.glb: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(characterPath, buffer);
  console.log("✓ character.glb downloaded");
}

if (await fileExists(hdrPath)) {
  console.log("✓ char_enviorment.hdr already present, skipping download");
} else {
  console.log("↓ Downloading char_enviorment.hdr");
  const response = await fetch(
    "https://raw.githubusercontent.com/MoncyDev/Portfolio-Website/main/public/models/char_enviorment.hdr",
    { headers: { "user-agent": "issa-portfolio-build" } }
  );
  if (!response.ok) {
    throw new Error(`Could not download char_enviorment.hdr: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(hdrPath, buffer);
  console.log("✓ char_enviorment.hdr downloaded");
}

// Generate character.enc if not present
const encryptedPath = fileURLToPath(
  new URL("../public/models/character.enc", import.meta.url)
);
if (await fileExists(encryptedPath)) {
  console.log("✓ character.enc already present");
} else {
  const character = await readFile(characterPath);
  const key = createHash("sha256").update("Character3D" + "#@").digest();
  const iv = Buffer.from("70135c02ed9aa2706c61a5d61051e6e1", "hex");
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([iv, cipher.update(character), cipher.final()]);
  await writeFile(encryptedPath, encrypted);
  console.log("✓ character.enc generated");
}
