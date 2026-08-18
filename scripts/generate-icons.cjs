const { app, BrowserWindow, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(() => {
  try {
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    win.loadURL('data:text/html,<html><body></body></html>');

    win.webContents.on('did-finish-load', async () => {
      try {
        const logoPath = "C:\\Users\\Aritz\\Desktop\\Proyectos Antigravity\\Software\\ABL Youtube\\ABL Youtube MP3 LOGO.png";
        
        if (!fs.existsSync(logoPath)) {
          console.error('Logo file not found at:', logoPath);
          app.quit();
          return;
        }

        console.log('Reading logo for circular crop...');
        const base64Image = fs.readFileSync(logoPath).toString('base64');
        
        const resultDataUrl = await win.webContents.executeJavaScript(`
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const size = Math.min(img.width, img.height);
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d');
              
              // 1. Draw temporary image to read pixel data
              ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
              
              const imgData = ctx.getImageData(0, 0, size, size);
              const pixels = imgData.data;
              
              // 2. Find top margin along the vertical center line
              const cx = Math.floor(size / 2);
              let topMargin = 0;
              for (let y = 0; y < size; y++) {
                const idx = (y * size + cx) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                // Check if color is not black (threshold 30)
                if (r + g + b > 30) {
                  topMargin = y;
                  break;
                }
              }
              
              // 3. Find left margin along the horizontal center line
              const cy = Math.floor(size / 2);
              let leftMargin = 0;
              for (let x = 0; x < size; x++) {
                const idx = (cy * size + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                if (r + g + b > 30) {
                  leftMargin = x;
                  break;
                }
              }
              
              // Use the detected margin with a 2px safety inset to cut off all black background
              const margin = Math.max(topMargin, leftMargin);
              const radius = (size / 2) - margin - 2;
              
              // 4. Clear and draw the clean cropped circle
              ctx.clearRect(0, 0, size, size);
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
              ctx.clip();
              
              ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
              
              resolve(canvas.toDataURL('image/png'));
            };
            img.src = 'data:image/png;base64,${base64Image}';
          })
        `);

        const buffer = Buffer.from(resultDataUrl.split(',')[1], 'base64');
        const img = nativeImage.createFromBuffer(buffer);

        const publicDir = path.join(__dirname, '../public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }

        // 1. Generate icon.ico
        const png256 = img.resize({ width: 256, height: 256, quality: 'best' }).toPNG();
        
        function pngToIco(pngBuffer, width, height) {
          const header = Buffer.alloc(6);
          header.writeUInt16LE(0, 0);
          header.writeUInt16LE(1, 2);
          header.writeUInt16LE(1, 4);

          const entry = Buffer.alloc(16);
          entry.writeUInt8(width === 256 ? 0 : width, 0);
          entry.writeUInt8(height === 256 ? 0 : height, 1);
          entry.writeUInt8(0, 2);
          entry.writeUInt8(0, 3);
          entry.writeUInt16LE(1, 4);
          entry.writeUInt16LE(32, 6);
          entry.writeUInt32LE(pngBuffer.length, 8);
          entry.writeUInt32LE(22, 12);

          return Buffer.concat([header, entry, pngBuffer]);
        }

        const icoBuffer = pngToIco(png256, 256, 256);
        fs.writeFileSync(path.join(publicDir, 'icon.ico'), icoBuffer);
        fs.writeFileSync(path.join(__dirname, '../icon.ico'), icoBuffer);
        console.log('Generated public/icon.ico & root icon.ico with transparent background');

        // 2. Generate PNGs
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
          console.log(`Generated public/${filename}`);
        }

        // Write cropped logo
        fs.writeFileSync(path.join(publicDir, 'logo.png'), buffer);
        fs.writeFileSync(logoPath, buffer);
        console.log('Saved transparent cropped logo to public/logo.png and original logoPath');

        console.log('All icons generated successfully!');
      } catch (err) {
        console.error('Inner error during generation:', err);
      } finally {
        app.quit();
      }
    });
  } catch (error) {
    console.error('Error generating icons:', error);
    app.quit();
  }
});
