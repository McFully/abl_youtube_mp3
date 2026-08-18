const { app, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(() => {
  try {
    const logoPath = "C:\\Users\\Aritz\\Desktop\\Proyectos Antigravity\\Software\\ABL Youtube\\ABL Youtube MP3 LOGO.png";
    
    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found at:', logoPath);
      app.quit();
      return;
    }

    console.log('Loading logo from:', logoPath);
    const img = nativeImage.createFromPath(logoPath);
    
    // Check if the image loaded correctly
    if (img.isEmpty()) {
      console.error('Failed to load image or image is empty.');
      app.quit();
      return;
    }

    // Ensure we have a public directory (if not, we'll write to root and/or public)
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Generate icon.ico for Electron app window and electron-builder
    const icoBuffer = img.toICO();
    fs.writeFileSync(path.join(publicDir, 'icon.ico'), icoBuffer);
    console.log('Generated public/icon.ico');

    // Also copy to root as icon.ico for electron-builder config if needed
    fs.writeFileSync(path.join(__dirname, '../icon.ico'), icoBuffer);
    console.log('Generated root icon.ico');

    // 2. Generate PNGs for favicon & manifest sizes
    const sizes = {
      'favicon-96x96.png': 96,
      'apple-touch-icon.png': 180,
      'web-app-manifest-192x192.png': 192,
      'web-app-manifest-512x512.png': 512,
      'icon.png': 512
    };

    for (const [filename, size] of Object.entries(sizes)) {
      const resized = img.resize({ width: size, height: size, quality: 'best' });
      fs.writeFileSync(path.join(publicDir, filename), resized.toPNG());
      console.log(`Generated public/${filename} (${size}x${size})`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  } finally {
    app.quit();
  }
});
