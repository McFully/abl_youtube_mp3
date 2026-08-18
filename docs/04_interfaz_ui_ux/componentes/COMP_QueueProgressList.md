# Componente QueueProgressList - ABL Youtube

## Ficha Técnica
- **Ubicación en Código**: `src/App.jsx` (líneas 189-244).
- **Animaciones**: `AnimatePresence` y `motion.div` de Framer Motion.

## Estructura de la Lista de Pistas
Mapea el array `queue` de objetos de pista:
```javascript
<motion.div 
  key={item.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  className={`track-item ${item.status}`}
>
  ...
</motion.div>
```

## Badges de Estado e Indicadores Visuales
- `.status-queued`: `En Cola` (Gris)
- `.status-downloading`: `Descargando` (Rojo `#FFAAAA`)
- `.status-converting`: `Convirtiendo` (Dorado `#FCD34D`)
- `.status-completed`: `Completado` (Verde `#A7F3D0`)
- `.status-failed`: `Error` (Rojo alerta `#FCA5A5`)
