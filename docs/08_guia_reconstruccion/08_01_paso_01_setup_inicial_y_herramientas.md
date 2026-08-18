# 08.01 Paso 1: Setup Inicial y Herramientas - ABL Youtube

## Guía Quirúrgica de Reconstrucción

### Paso 1: Inicialización del Proyecto
```bash
mkdir ABL_Youtube && cd ABL_Youtube
npm init -y
```

### Paso 2: Instalación de Dependencias
```bash
npm install react@^19.2.5 react-dom@^19.2.5 framer-motion@^12.38.0 lucide-react@^1.14.0
npm install -D electron@^41.5.0 vite@^8.0.10 vite-plugin-electron@^0.29.1 vite-plugin-electron-renderer@^0.14.7 concurrently@^10.0.3 wait-on@^9.0.10 electron-builder@^26.8.1
```

### Paso 3: Crear la Estructura de Directorios
```bash
mkdir -p electron src/platform public bin scripts
```

### Paso 4: Escribir los Archivos Principales
1. Crear `electron/main.js` con las funciones HTTPS `downloadUrlToFile`, la descompresión con PowerShell y los IPC Handlers.
2. Crear `electron/preload.js` con el `contextBridge`.
3. Crear `src/platform/bridge.js` para abstraer las llamadas IPC.
4. Crear `src/index.css` con todas las variables CSS de tema oscuro glassmorphic.
5. Crear `src/App.jsx` ensamblando el título nativo, la caja de enlace, la selección de destino y la lista animada Framer Motion.
