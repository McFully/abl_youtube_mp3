# Componente AppTitleBar - ABL Youtube

## Ficha Técnica del Elemento
- **Ubicación en Código**: `src/App.jsx` (líneas 104-120) y `src/index.css` (`.title-bar`, `.app-info`, `.window-controls`, `.control-btn`).
- **Tipo**: Componente de cabecera frameless arrastrable.

## Especificación Estética (CSS)
```css
.title-bar {
  height: 48px;
  background-color: rgba(8, 9, 12, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  -webkit-app-region: drag;
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}

.control-btn {
  width: 36px;
  height: 36px;
  -webkit-app-region: no-drag;
}
```

## Botones e Interacción IPC
- **Minimizar**: `platform.control('minimize')` -> `electronAPI.send('window-control', 'minimize')`.
- **Maximizar / Restaurar**: `platform.control('maximize')` -> `electronAPI.send('window-control', 'maximize')`.
- **Cerrar**: `platform.control('close')` -> `electronAPI.send('window-control', 'close')`.
