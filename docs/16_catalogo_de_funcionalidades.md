# Funcionalidades del Sistema - ABL Youtube

| ID | Funcionalidad | Descripción | Componente / IPC | Estado |
|---|---|---|---|---|
| F-01 | Descarga de Vídeo Individual | Extracción de audio en MP3 de máxima calidad desde una URL de YouTube. | `start-download` | Completo |
| F-02 | Descarga de Playlists | Extracción plana de la lista completa y procesamiento secuencial pista por pista. | `start-download` | Completo |
| F-03 | Selección de Carpeta de Destino | Cuadro de diálogo nativo de selección de carpetas con fallback a descargas del SO. | `select-download-dir` | Completo |
| F-04 | Cancelación de Procesos | Interrupción inmediata del proceso activo mediante `activeDownloadProcess.kill()`. | `cancel-download` | Completo |
| F-05 | Auto-Setup de Binarios | Descarga e instalación autónoma de `yt-dlp.exe` y `ffmpeg.exe` en primer arranque. | `download-dependencies` | Completo |
| F-06 | Control de Ventana Frameless | Minimizar, maximizar y cerrar la ventana transparente desde botones custom. | `window-control` | Completo |
| F-07 | Feedback Visual de Progreso | Visualización animada con barra de porcentaje, velocidad (MB/s) y tiempo estimado ETA. | `App.jsx` / Framer Motion | Completo |