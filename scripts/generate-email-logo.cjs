const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const svgPath = path.join(root, "scripts/email-logo-source.svg");
const outPath = path.join(root, "public/assets/logo.png");

sharp(svgPath)
  .resize(312, 64)
  .png()
  .toFile(outPath)
  .then(() => {
    process.stdout.write(`Wrote ${outPath}\n`);
  })
  .catch((err) => {
    process.stderr.write(String(err) + "\n");
    process.exit(1);
  });
