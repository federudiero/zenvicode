import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const dir = join(process.cwd(), 'public', 'media', 'marketing');

function isPng(file) {
  return extname(file).toLowerCase() === '.png';
}

async function convert(file) {
  const inputPath = join(dir, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const outputPath = join(dir, outputName);
  console.log(`Converting ${file} -> ${outputName}`);
  await sharp(inputPath)
    .webp({ quality: 82 })
    .toFile(outputPath);
}

async function main() {
  const files = readdirSync(dir).filter((f) => {
    const p = join(dir, f);
    return statSync(p).isFile() && isPng(f);
  });

  if (files.length === 0) {
    console.log('No PNG files found in public/media/marketing');
    return;
  }

  for (const f of files) {
    try {
      await convert(f);
    } catch (e) {
      console.error(`Failed converting ${f}:`, e);
    }
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});