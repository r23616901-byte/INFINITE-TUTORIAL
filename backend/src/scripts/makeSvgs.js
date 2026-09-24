const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../../../frontend/public');
const logoB64 = fs.readFileSync(path.join(publicDir, 'logo-transparent.png')).toString('base64');
const emblemB64 = fs.readFileSync(path.join(publicDir, 'logo-emblem-transparent.png')).toString('base64');

// Generate logo.svg with aspect ratio 941:505
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 941 505" width="100%" height="100%">
  <image href="data:image/png;base64,${logoB64}" x="0" y="0" width="941" height="505" />
</svg>`;
fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg);

// Generate favicon.svg with square aspect ratio
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <image href="data:image/png;base64,${emblemB64}" x="25" y="0" width="450" height="500" />
</svg>`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);

console.log('SVGs generated successfully!');
