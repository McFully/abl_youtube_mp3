# Flujo de Datos - ABL Youtube

## Diagrama de Secuencia de Descarga

```
[Usuario] --(Pega URL + Clic Descargar)--> [src/App.jsx]
                                                |
                                                | platform.startDownload(url, outDir)
                                                v
                                       [src/platform/bridge.js]
                                                |
                                                | electronAPI.invoke('start-download')
                                                v
                                       [electron/main.js]
                                                |
        +---------------------------------------+---------------------------------------+
        |                                                                               |
        | 1. spawn(ytdlpPath, ['--dump-json', '--flat-playlist', url])                  | 2. Iterate items & spawn(ytdlpPath, ['-x', '--audio-format', 'mp3', ...])
        v                                                                               v
 [Extracción JSON Pistas]                                                       [Captura stdout/stderr Regex]
        |                                                                               |
        | win.webContents.send('download-progress', { type: 'init-queue', items })      | win.webContents.send('download-progress', { type: 'update-item', progress, speed, eta })
        v                                                                               v
 [src/App.jsx: setQueue(data.items)]                                            [src/App.jsx: Actualiza elemento en estado queue]
```