# 01.04 Patrones de Diseño y Convenciones - ABL Youtube

## Patrones Destacados
1. **Bridge Pattern (`src/platform/bridge.js`)**: Encapsula las invocaciones IPC de Electron permitiendo fallback o mocks si la app se ejecuta fuera de Electron.
2. **Sequential Queue Pattern**: Las descargas de listas de reproducción procesan las pistas una a una para evitar congestión de red o baneos de IP por abuso de rate limit de YouTube.
3. **Event-Driven Progress Streaming**: Notificación en tiempo real desde el Main Process al Renderer Process utilizando regex matching sobre `stdout` del proceso hijo `yt-dlp.exe`.
