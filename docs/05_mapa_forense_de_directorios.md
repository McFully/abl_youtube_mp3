# Estructura del Proyecto - ABL Youtube

```
ABL Youtube/
├── package.json                       # Configuración de scripts, dependencias y electron main
├── vite.config.js                     # Configuración de Vite con vite-plugin-electron
├── eslint.config.js                   # Reglas de linter JS/React
├── icon.ico                           # Icono de la aplicación Windows
├── logo.png / ABL Youtube MP3 LOGO.png# Assets gráficos principales
├── iniciar.bat                        # Script Batch para inicio rápido
├── bin/                               # Directorio de binarios (yt-dlp.exe, ffmpeg.exe)
├── scripts/
│   ├── build.cjs                      # Script de empaquetado personalizado
│   ├── generate-icons.cjs             # Generación de iconos ICO/PNG
│   └── noop-sign.cjs                  # Script de no-op para firma de código
├── electron/
│   ├── main.js                        # Proceso Principal Electron, Handlers IPC y descarga de dep
│   └── preload.js                     # Script Preload aislado (contextBridge)
├── public/                            # Recursos estáticos servidos en producción
└── src/
    ├── main.jsx                       # Punto de entrada de React 19
    ├── index.css                      # Variables CSS globales, estilos glassmorphic y layout
    ├── App.jsx                        # Componente principal de la UI
    └── platform/
        └── bridge.js                  # Puente de abstracción de llamadas al canal electron
```