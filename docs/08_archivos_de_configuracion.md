# Archivos de Configuración - ABL Youtube

1. **`package.json`**: Define los scripts de arranque (`dev`, `build`, `electron:dev`, `electron:build`) y las dependencias principales (`react`, `framer-motion`, `lucide-react`, `electron`, `vite`).
2. **`vite.config.js`**: Configuración de compilación Vite utilizando `vite-plugin-electron` para bundlear `electron/main.js` en `dist-electron/main.js` y `vite-plugin-electron-renderer` para soporte en React.
3. **`eslint.config.js`**: Configuración de ESLint con reglas para React Hooks y React Refresh.
4. **`electron/preload.js`**: Define el objeto `electronAPI` con canales IPC válidos (`window-control`, `select-download-dir`, `start-download`, `cancel-download`, `check-dependencies`, `download-dependencies`, `download-progress`, `dependency-progress`).