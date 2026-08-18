# Vista MainDownloader - ABL Youtube

## Especificación Completa de la Vista Principal
- **Componente Raíz**: `src/App.jsx`
- **Layout Contenedor**: Flexbox vertical con `height: 100vh`, desbordamiento controlado `overflow: hidden` y scrollbar personalizado en la lista de descarga.

## Diagrama de la Interfaz Visual

```
+-------------------------------------------------------------------+
| [Logo] ABL YouTube MP3                      [-  ] [ [] ] [  X  ]  | -> AppTitleBar
+-------------------------------------------------------------------+
| [ Logo ]  ABL YouTube MP3                                         |
|           Extractor y conversor de audio MP3 para vídeos y        | -> Header
|           playlists completas de YouTube.                         |
+-------------------------------------------------------------------+
| ENLACE DE YOUTUBE (VÍDEO O PLAYLIST)                              |
| [ https://www.youtube.com/playlist?list=... ] [ Descargar MP3 ]   |
|                                                                   | -> DownloadGlassPanel
| CARPETA DE DESTINO                                                |
| [ C:\Users\User\Downloads                 ] [ Cambiar Carpeta ]   |
+-------------------------------------------------------------------+
| COLA DE DESCARGA                                         3 pistas |
| +---------------------------------------------------------------+ |
| | [Music] Cancion 01.mp3                  [ DESCARGANDO ] 45%   | |
| | [============                      ] 4.2MB/s ETA: 00:08     | | -> QueueProgressList
| +---------------------------------------------------------------+ |
| | [Music] Cancion 02.mp3                  [ EN COLA ]           | |
| +---------------------------------------------------------------+ |
+-------------------------------------------------------------------+
```
