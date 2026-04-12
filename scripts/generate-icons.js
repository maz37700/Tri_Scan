#!/usr/bin/env node

/**
 * PWA Icon Generator for TriScan
 * 
 * Usage: npm run generate-icons
 * 
 * This creates placeholder SVG icons at all required sizes.
 * For production, replace with proper PNG icons using:
 *   - https://realfavicongenerator.net
 *   - or: npx pwa-asset-generator logo.svg public/icons
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';

const ICONS_DIR = 'public/icons';
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

if (!existsSync(ICONS_DIR)) {
  mkdirSync(ICONS_DIR, { recursive: true });
}

const generateSVG = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#bg)"/>
  <text x="${size/2}" y="${size * 0.55}" font-size="${Math.round(size * 0.45)}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">📸</text>
  <text x="${size/2}" y="${size * 0.82}" font-size="${Math.round(size * 0.12)}" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">TriScan</text>
</svg>`;

for (const size of SIZES) {
  const svg = generateSVG(size);
  const filename = `${ICONS_DIR}/icon-${size}x${size}.svg`;
  writeFileSync(filename, svg);
  console.log(`✅ Generated ${filename}`);
}

// Apple touch icon
writeFileSync('public/apple-touch-icon.png', ''); // Placeholder
console.log('');
console.log('⚠️  SVG placeholders created. For production:');
console.log('   npx pwa-asset-generator public/favicon.svg public/icons --background "#064E3B"');
console.log('   This will generate proper PNG icons for all platforms.');
