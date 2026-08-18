# 01.05 Mapa Forense de Directorios y Archivos - ABL Youtube

- **`electron/main.js`**: Proceso Principal Electron con handlers para `window-control`, `select-download-dir`, `get-default-dir`, `check-dependencies`, `download-dependencies`, `start-download` y `cancel-download`.
- **`electron/preload.js`**: ContextBridge expone `window.electron` con métodos seguros `send`, `invoke` y `on`.
- **`src/platform/bridge.js`**: Capa de abstracción del frontend que invoca `window.electron`.
- **`src/App.jsx`**: Vistas, tarjeta glassmorphic, entrada de URL y renderizado animado de la cola de descargas.
- **`src/index.css`**: Variables CSS globales, diseño glassmorphic y clases utilitarias.
- **`scripts/build.cjs`**: Script de compilación nativo.
