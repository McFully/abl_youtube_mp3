# Sistema de Diseño y UI/UX - ABL Youtube

## Tokens de Estilos en `src/index.css`

```css
:root {
  --bg-color: #08090C;
  --bg-gradient: radial-gradient(circle at 50% 0%, #1c0e12 0%, #08090C 100%);
  --surface-color: rgba(22, 24, 30, 0.6);
  --surface-hover: rgba(30, 33, 41, 0.8);
  --primary-color: #EF4444; /* Rojo característico de YouTube */
  --primary-hover: #DC2626;
  --primary-active: #B91C1C;
  --primary-glow: rgba(239, 68, 68, 0.25);
  --secondary-color: #10B981; /* Verde éxito */
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);
  --radius-lg: 16px;
  --radius-md: 10px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Estilo Visual y Layout
- **Ventana Frameless Glassmorphic**: Borde fino de `1px solid rgba(255,255,255,0.08)`, sombra proyectada `0 25px 50px -12px rgba(0,0,0,0.5)` y esquinas redondeadas de `16px`.
- **TitleBar Arrastrable**: Región superior con `-webkit-app-region: drag` y controles de ventana con `-webkit-app-region: no-drag`.
- **Estados de Descarga**:
  - `En Cola`: Fondo gris tenue con badge neutro.
  - `Descargando`: Borde rojo brillante con resplandor glow y animación de barra.
  - `Convirtiendo`: Badge dorado `#FCD34D`.
  - `Completado`: Borde verde esmeralda `#10B981`.