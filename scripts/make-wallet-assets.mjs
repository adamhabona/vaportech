// Generates the Apple/Google Wallet pass images in public/wallet/.
// Run: node scripts/make-wallet-assets.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const out = "public/wallet";
mkdirSync(out, { recursive: true });

// Globe mark, matching the navbar's lucide Globe icon.
const globe = (stroke, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
  ${bg ? `<rect width="24" height="24" rx="5" fill="${bg}"/>` : ""}
  <g fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="${bg ? "translate(3.6 3.6) scale(0.7)" : ""}">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
    <path d="M2 12h20"/>
  </g>
</svg>`;

const render = (svg, w, h, file) =>
  sharp(Buffer.from(svg)).resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${out}/${file}`);

await Promise.all([
  // Apple icon (shown in notifications / lock screen): solid background
  render(globe("#ffffff", "#0a0a0c"), 29, 29, "icon.png"),
  render(globe("#ffffff", "#0a0a0c"), 58, 58, "icon@2x.png"),
  render(globe("#ffffff", "#0a0a0c"), 87, 87, "icon@3x.png"),
  // Apple logo (top left of pass, next to logoText): transparent
  render(globe("#ffffff"), 50, 50, "logo.png"),
  render(globe("#ffffff"), 100, 100, "logo@2x.png"),
  render(globe("#ffffff"), 150, 150, "logo@3x.png"),
  // Google program logo (circle-cropped by Google)
  render(globe("#ffffff", "#0a0a0c"), 660, 660, "google-logo.png"),
]);
console.log("wallet assets written to", out);
