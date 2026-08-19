# SCRIPTS NPM Y AUTOMATIZACIONES CLI

## 1. COMANDOS REGISTRADOS
| Comando | Script Ejecutado |
| :--- | :--- |
| `npm run dev` | `vite` |
| `npm run build` | `vite build` |
| `npm run electron:dev` | `npx concurrently "npm run dev" "npx wait-on http://localhost:5173 && electron ."` |
| `npm run electron:build` | `npm run build && node scripts/build.cjs` |
| `npm run lint` | `eslint .` |
| `npm run preview` | `vite preview` |
