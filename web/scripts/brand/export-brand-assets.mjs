import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const brandRoot = path.join(webRoot, "public", "brand");
const pngRoot = path.join(brandRoot, "exports", "png");
const webpRoot = path.join(brandRoot, "exports", "webp");
const faviconRoot = path.join(brandRoot, "favicon");

const sources = {
  icon: path.join(brandRoot, "icons", "smv-icon-master.svg"),
  profile: path.join(brandRoot, "icons", "smv-icon-circle.svg"),
  horizontalDark: path.join(brandRoot, "logos", "smv-logo-horizontal-dark.svg"),
  horizontalLight: path.join(brandRoot, "logos", "smv-logo-horizontal-light.svg"),
  watermark: path.join(brandRoot, "social", "smv-watermark-horizontal.svg"),
  watermarkCompact: path.join(brandRoot, "social", "smv-watermark-compact.svg"),
  favicon: path.join(faviconRoot, "favicon.svg"),
};

const jobs = [];

function addPair(source, stem, width, options = {}) {
  jobs.push({ source, output: path.join(pngRoot, `${stem}.png`), width, format: "png", ...options });
  jobs.push({ source, output: path.join(webpRoot, `${stem}.webp`), width, format: "webp", ...options });
}

for (const size of [32, 64, 128, 256, 512, 1024]) {
  addPair(sources.icon, `smv-icon-${size}x${size}`, size, { height: size });
}

for (const size of [256, 512, 1024]) {
  addPair(sources.profile, `smv-profile-${size}x${size}`, size, { height: size });
}

for (const width of [320, 640, 960, 1280, 1920]) {
  addPair(sources.horizontalDark, `smv-logo-horizontal-dark-${width}w`, width);
  addPair(sources.horizontalLight, `smv-logo-horizontal-light-${width}w`, width);
}

for (const [useCase, width, source] of [
  ["instagram-post", 420, sources.watermark],
  ["instagram-carousel", 420, sources.watermark],
  ["reel-cover", 360, sources.watermarkCompact],
  ["youtube-thumbnail", 480, sources.watermark],
]) {
  addPair(source, `smv-watermark-${useCase}-${width}w`, width);
}

jobs.push(
  { source: sources.favicon, output: path.join(faviconRoot, "favicon-16x16.png"), width: 16, height: 16, format: "png" },
  { source: sources.favicon, output: path.join(faviconRoot, "favicon-32x32.png"), width: 32, height: 32, format: "png" },
  { source: sources.profile, output: path.join(faviconRoot, "apple-touch-icon.png"), width: 180, height: 180, format: "png" },
  { source: sources.profile, output: path.join(faviconRoot, "app-icon-192.png"), width: 192, height: 192, format: "png" },
  { source: sources.profile, output: path.join(faviconRoot, "app-icon-512.png"), width: 512, height: 512, format: "png" },
);

async function assertSource(file) {
  try {
    await access(file);
  } catch {
    throw new Error(`Brand export aborted: missing SVG master at ${path.relative(webRoot, file)}`);
  }
}

async function render(job) {
  const pipeline = sharp(job.source, { density: 384 }).resize({
    width: job.width,
    height: job.height,
    fit: job.height ? "contain" : "inside",
    withoutEnlargement: false,
  });

  if (job.format === "webp") {
    pipeline.webp({ lossless: true, quality: 100, effort: 6 });
  } else {
    pipeline.png({ compressionLevel: 9, adaptiveFiltering: false });
  }

  const info = await pipeline.toFile(job.output);
  console.log(`generated ${info.width}x${info.height}  ${path.relative(webRoot, job.output)}`);
}

async function main() {
  await Promise.all(Object.values(sources).map(assertSource));
  await Promise.all([pngRoot, webpRoot, faviconRoot].map((directory) => mkdir(directory, { recursive: true })));
  for (const job of jobs) await render(job);
  console.log(`Brand export complete: ${jobs.length} files generated.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

