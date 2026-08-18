# Lógica Principal del Sistema - ABL Youtube

La lógica central de la aplicación habita en `electron/main.js` y se descompone en 3 motores clave:

## 1. Motor de Descarga Autónomo de Dependencias (`download-dependencies`)
- Comprueba si existen `bin/yt-dlp.exe` y `bin/ffmpeg.exe` con tamaño superior a 1 MB.
- Si no existen, realiza peticiones HTTPS nativas siguiendo redirecciones HTTP 301/302 automáticamente.
- Notifica el porcentaje de descarga al cliente mediante el evento `dependency-progress`.
- Ejecuta `powershell` para descomprimir la versión ligera de FFmpeg con `Expand-Archive` y mover los binarios ejecutables a `bin/`.

## 2. Motor de Procesamiento y Cola de Descarga (`start-download`)
- Invoca `yt-dlp.exe --dump-json --flat-playlist <URL>` mediante `child_process.spawn`.
- Convierte las líneas JSON recibidas en una lista de objetos de pista:
  ```json
  {
    "id": "videoId",
    "title": "Nombre de la canción",
    "url": "https://www.youtube.com/watch?v=...",
    "status": "queued",
    "progress": 0
  }
```
- Emite el evento `init-queue` al Renderer Process.
- Itera secuencialmente sobre cada elemento invocando `yt-dlp.exe`:
  `yt-dlp -x --audio-format mp3 --audio-quality 0 --ffmpeg-location bin/ --newline --progress -o "<outDir>/%(title)s.%(ext)s" <url>`

## 3. Expresiones Regulares de Extracción de Progreso (Regex Engine)
- Porcentaje: `/\[download\]\s+(\d+\.\d+)%/`
- Velocidad: `/at\s+([^\s]+)/`
- ETA (Tiempo Restante): `/ETA\s+([^\s]+)/`
- Transición a conversión: Si la línea incluye `[ExtractAudio]` o `[ffmpeg]`, cambia el estado a `converting`.