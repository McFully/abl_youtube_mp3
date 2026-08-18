# Arquitectura del Sistema - ABL Youtube

**ABL Youtube** está estructurado bajo la arquitectura multi-proceso estándar de **Electron**, separando de forma estricta las capacidades del sistema operativo en el proceso Principal (**Main Process**) y la interfaz de usuario en el proceso de Renderizado (**Renderer Process**).

## Diagrama de Arquitectura de Procesos Electron

```
+-------------------------------------------------------------------------+
|                              Electron Main Process                      |
|  (electron/main.js - Node.js ESM Engine)                                |
|                                                                         |
|  - Ventana principal BrowserWindow (frameless, transparent)            |
|  - Invocación y control de procesos externos: yt-dlp.exe, ffmpeg.exe    |
|  - Descarga autónoma de binarios vía HTTPS                              |
|  - Descompresión nativa mediante PowerShell (Expand-Archive)            |
|  - Manipulación de archivos de logs en appData/userData                 |
+------------------------------------+------------------------------------+
                                     |
                       ContextBridge / Preload IPC
                       (electron/preload.js + platform/bridge.js)
                                     |
+------------------------------------+------------------------------------+
|                            Electron Renderer Process                    |
|  (src/App.jsx - React 19 + Framer Motion)                              |
|                                                                         |
|  - UI Glassmorphic (Vanilla CSS Variables)                              |
|  - Barra de título personalizada (TitleBar Component)                   |
|  - Panel de entrada de URL y selección de carpeta (GlassPanel)          |
|  - Cola de descarga secuencial animada (QueueProgressList)              |
+-------------------------------------------------------------------------+
```

## Canales IPC y Contratos
- `window-control`: Envió unidireccional `minimize`, `maximize`, `close`.
- `select-download-dir`: Invocación asíncrona que despliega `dialog.showOpenDialog`.
- `get-default-dir`: Devuelve la ruta por defecto `app.getPath('downloads')`.
- `check-dependencies`: Comprueba la existencia y tamaño de `yt-dlp.exe` y `ffmpeg.exe`.
- `download-dependencies`: Descarga binarios desde GitHub Releases y notifica progreso vía `dependency-progress`.
- `start-download`: Ejecuta la extracción de metadatos `--flat-playlist --dump-json` e inicia el bucle secuencial.
- `cancel-download`: Mata el proceso activo `activeDownloadProcess.kill()`.
- `download-progress`: Evento emitido desde Main hacia Renderer con actualizaciones de cola y porcentaje.