import sharp from "sharp";
import { readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");

async function compressJpg(filename, { maxWidth = 1600, quality = 80 } = {}) {
  const inputPath = join(publicDir, filename);
  const before = (await stat(inputPath)).size;
  const buffer = await readFile(inputPath);

  const image = sharp(buffer).rotate();
  const metadata = await image.metadata();
  const resize =
    metadata.width && metadata.width > maxWidth ? { width: maxWidth } : null;

  const pipeline = resize ? image.resize(resize) : image;
  const out = await pipeline
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toBuffer();

  await writeFile(inputPath, out);
  const after = out.length;
  console.log(
    `${filename}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${((1 - after / before) * 100).toFixed(0)}% smaller)`
  );
}

const targets = [
  "couvert.jpeg",
  "sopa_capeletti.jpeg",
  "carnes_chapa.jpeg",
  "rodizio_massas.jpeg",
  "panna_cota.jpeg",
  "salao.jpeg",
  "mesa_posta.jpeg",
  "fachada.jpeg",
  "drink.jpeg",
  "masa.jpeg",
];

for (const file of targets) {
  try {
    await compressJpg(file);
  } catch (err) {
    console.error(`Failed: ${file}`, err.message);
  }
}
