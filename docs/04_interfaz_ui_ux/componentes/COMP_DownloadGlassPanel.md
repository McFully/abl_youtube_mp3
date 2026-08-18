# Componente DownloadGlassPanel - ABL Youtube

## Ficha Técnica
- **Ubicación en Código**: `src/App.jsx` (líneas 137-186) y `src/index.css` (`.glass-panel`, `.input-group`, `.text-input`, `.btn-primary`).

## Props / Estado Manejado
- `url`: Estado string local con la URL del vídeo o playlist introducida.
- `downloadDir`: Estado string local con la ruta absoluta de destino.
- `isDownloading`: Booleano que deshabilita los inputs durante la ejecución activos y conmuta el botón principal entre "Descargar MP3" (`btn-primary`) y "Cancelar" (`btn-danger`).
- `errorMessage`: String con el mensaje de error validado en caso de fallos.

## Renderizado de Interfaz Glassmorphic
- Fondo traslúcido `rgba(22, 24, 30, 0.6)` con efecto desenfoque `backdrop-filter: blur(8px)`.
- Input de texto con `box-shadow` reactivo al foco con resplandor rojo YouTube (`rgba(239, 68, 68, 0.25)`).
