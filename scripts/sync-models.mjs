import { createCipheriv, createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(
  new URL("../public/models/", import.meta.url)
);

const assets = [
  {
    name: "character.glb",
    url: "https://media.githubusercontent.com/media/MoncyDev/Portfolio-Website/main/public/models/character.glb",
    sha256: "c287a4d10bbbbc4c779f7b0a68b666b530ef9754142843aa048b4d5976c0d052",
  },
  {
    name: "char_enviorment.hdr",
    url: "https://raw.githubusercontent.com/MoncyDev/Portfolio-Website/main/public/models/char_enviorment.hdr",
    sha256: "366401083df3216cf9dd21d113d1d02c5f55d474ee9ffa121af1486a5396eccf",
  },
];

const encryptedAsset = {
  name: "character.enc",
  sha256: "727391097c9c122211f7e3f5e18f219765f15450abb7f49be15b5703500476b7",
  iv: "70135c02ed9aa2706c61a5d61051e6e1",
};

const digest = (buffer) =>
  createHash("sha256").update(buffer).digest("hex");

async function hasValidLocalCopy(path, expectedHash) {
  try {
    const existing = await readFile(path);
    return digest(existing) === expectedHash;
  } catch {
    return false;
  }
}

await mkdir(outputDirectory, { recursive: true });

for (const asset of assets) {
  const target = fileURLToPath(
    new URL(`../public/models/${asset.name}`, import.meta.url)
  );

  if (await hasValidLocalCopy(target, asset.sha256)) {
    console.log(`✓ ${asset.name} already verified`);
    continue;
  }

  console.log(`↓ Downloading ${asset.name}`);
  const response = await fetch(asset.url, {
    headers: { "user-agent": "issa-portfolio-build" },
  });

  if (!response.ok) {
    throw new Error(
      `Could not download ${asset.name}: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const actualHash = digest(buffer);

  if (actualHash !== asset.sha256) {
    throw new Error(
      `${asset.name} failed checksum validation. Expected ${asset.sha256}, received ${actualHash}.`
    );
  }

  await writeFile(target, buffer);
  console.log(`✓ ${asset.name} downloaded and verified`);
}

const characterPath = fileURLToPath(
  new URL("../public/models/character.glb", import.meta.url)
);
const encryptedPath = fileURLToPath(
  new URL("../public/models/character.enc", import.meta.url)
);

if (!(await hasValidLocalCopy(encryptedPath, encryptedAsset.sha256))) {
  const character = await readFile(characterPath);
  const key = createHash("sha256")
    .update("Character3D" + "#@")
    .digest();
  const iv = Buffer.from(encryptedAsset.iv, "hex");
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(character),
    cipher.final(),
  ]);

  const actualHash = digest(encrypted);
  if (actualHash !== encryptedAsset.sha256) {
    throw new Error(
      `${encryptedAsset.name} failed checksum validation. Expected ${encryptedAsset.sha256}, received ${actualHash}.`
    );
  }

  await writeFile(encryptedPath, encrypted);
  console.log(`✓ ${encryptedAsset.name} generated and verified`);
} else {
  console.log(`✓ ${encryptedAsset.name} already verified`);
}
