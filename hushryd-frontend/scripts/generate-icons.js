/**
 * Icon Generation Script for HushRyd
 * 
 * This script helps generate PNG icons from the SVG favicon design.
 * You can use this as a reference for creating the actual PNG files.
 * 
 * To use:
 * 1. Install dependencies: npm install sharp
 * 2. Run: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG template for HushRyd logo
const logoSVG = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="512" cy="512" r="480" fill="#00AFF5" stroke="#084F8D" stroke-width="32"/>
  
  <!-- Car Icon -->
  <g transform="translate(512, 512)">
    <!-- Car Body -->
    <g fill="#084F8D" transform="translate(-120, -80)">
      <!-- Main body -->
      <rect x="40" y="120" width="160" height="60" rx="8"/>
      <!-- Windshield -->
      <rect x="60" y="80" width="120" height="40" rx="6" fill="#00AFF5"/>
      <!-- Wheels -->
      <circle cx="70" cy="200" r="20" fill="#084F8D"/>
      <circle cx="170" cy="200" r="20" fill="#084F8D"/>
      <!-- Wheel centers -->
      <circle cx="70" cy="200" r="12" fill="#00AFF5"/>
      <circle cx="170" cy="200" r="12" fill="#00AFF5"/>
    </g>
    
    <!-- Pin/Location Icon -->
    <g transform="translate(-20, -160)">
      <path d="M20 20 L60 20 L60 60 L80 60 L80 80 L40 80 L40 60 L20 60 Z" fill="#084F8D"/>
    </g>
  </g>
  
  <!-- HushRyd Text -->
  <text x="512" y="720" font-size="80" font-weight="800" text-anchor="middle" fill="#084F8D" font-family="system-ui">HushRyd</text>
</svg>
`;

// Icon sizes to generate
const iconSizes = [
  { name: 'icon.png', size: 1024, path: 'assets/images/' },
  { name: 'favicon.png', size: 32, path: 'assets/images/' },
  { name: 'adaptive-icon.png', size: 1024, path: 'assets/images/' },
  { name: 'splash-icon.png', size: 1024, path: 'assets/images/' },
  { name: 'web-icon.png', size: 192, path: 'public/' },
  { name: 'apple-touch-icon.png', size: 180, path: 'public/' },
];

async function generateIcons() {
  console.log('🚗 Generating HushRyd icons...');
  
  for (const icon of iconSizes) {
    try {
      const outputPath = path.join(icon.path, icon.name);
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Generate PNG from SVG
      await sharp(Buffer.from(logoSVG))
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Error generating ${icon.name}:`, error.message);
    }
  }
  
  console.log('🎉 Icon generation complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Replace the generated files in your assets/images/ directory');
  console.log('2. Test the favicon in your browser');
  console.log('3. Verify app icons display correctly on mobile devices');
}

// Run the script
if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = { generateIcons, logoSVG };
