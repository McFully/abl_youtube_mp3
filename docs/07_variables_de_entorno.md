# Variables de Entorno - ABL Youtube

| Variable | Ámbito | Descripción | Ejemplo / Valor por Defecto |
|---|---|---|---|
| `VITE_DEV_SERVER_URL` | Main Process (Dev) | URL del servidor de desarrollo Vite. | `http://localhost:5173` |
| `DIST` | Main Process | Ruta absoluta hacia la carpeta compilada `dist`. | `path.join(__dirname, '../dist')` |
| `VITE_PUBLIC` | Main Process | Ruta hacia los assets estáticos de la carpeta `public`. | `process.env.DIST` o `path.join(__dirname, '../public')` |