# Problemas Conocidos y Limitaciones - ABL Youtube

1. **Bloqueo por Procesos Zombi de FFmpeg**: Si la aplicación se fuerza a cerrar durante una conversión activa, `ffmpeg.exe` puede quedar bloqueado en memoria. El script de descarga ejecuta `taskkill /F /IM ffmpeg.exe /IM ffprobe.exe /IM yt-dlp.exe` para resolverlo antes de actualizar binarios.
2. **Actualización de Algoritmos de YouTube**: En ocasiones YouTube realiza cambios de cifrado en sus streamings. La aplicación resuelve esto permitiendo descargar la última versión de `yt-dlp.exe` desde sus releases oficiales de GitHub.