# 01.02 Arquitectura del Sistema y Diagrama C4 - ABL Youtube

## Diagrama C4 Contenedores y Procesos

```
+-----------------------------------------------------------------------------------+
|                                   ABL Youtube App                                 |
|                                                                                   |
|  +-----------------------------+     IPC Channel     +-------------------------+  |
|  | Renderer Process            | <-----------------> | Main Process            |  |
|  | (React 19 / Framer Motion)  |                     | (Electron / Node.js ESM)|  |
|  +-----------------------------+                     +------------+------------+  |
|                                                                   |               |
|                                                                   | child_process |
|                                                                   v               |
|                                                      +-------------------------+  |
|                                                      | CLI Binaries            |  |
|                                                      | (yt-dlp.exe / ffmpeg)   |  |
|                                                      +-------------------------+  |
+-----------------------------------------------------------------------------------+
```
