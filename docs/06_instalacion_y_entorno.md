# Configuración e Instalación - ABL Youtube

## Requisitos Previos
- Windows 10 u 11 (x64).
- Node.js 18.0.0 o superior con NPM 9+.

## Pasos para Compilación y Ejecución en Desarrollo
1. Clonar el repositorio o posicionarse en la carpeta raíz `ABL Youtube/`.
2. Instalar dependencias con NPM:
```bash
npm install
```
3. Iniciar el servidor de desarrollo concurrentemente con Electron:
```bash
npm run electron:dev
```
Este comando ejecuta `concurrently "npm run dev" "npx wait-on http://localhost:5173 && electron ."`.

## Pasos para Empaquetar la Aplicación Ejecutable
```bash
npm run electron:build
```
El script `scripts/build.cjs` ejecuta la compilación de Vite y genera los instaladores en la carpeta `dist/` o `dist-electron/`.