# ABL Youtube - Resumen General

**ABL Youtube** es una aplicación de escritorio nativa para Windows desarrollada con **Electron**, **Vite**, **React 19** y **Framer Motion**. Permite la descarga automatizada, extracción de metadatos y conversión secuencial a MP3 de alta calidad (VBR 0 / 320kbps equivalent) desde vídeos individuales o playlists completas de YouTube.

## Características Destacadas
- **Binarios Autocontenidos e Instalación Autónoma**: Descarga y extracción automática de los binarios esenciales de `yt-dlp.exe` y `ffmpeg.exe` en la primera ejecución vía PowerShell.
- **Soporte de Playlists Completas**: Extracción de listas en formato JSON mediante `--flat-playlist --dump-json` y procesamiento secuencial con reporte de velocidad (MB/s) y ETA en tiempo real.
- **Interfaz Framer Motion Glassmorphic**: Ventana personalizada `frameless` transparente con botones de control nativo, animaciones fluidas y diseño oscuro enfocado en el rojo característico de YouTube (`#EF4444`).
- **Bridge IPC Seguro**: Puente `contextBridge` aislado (`contextIsolation: true`) con canal bidireccional seguro sin exposición de Node.js en el cliente.