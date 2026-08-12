# Architecture Decision Record: Embedded Base64 Assets

## Contexto
Históricamente, el paquete `stellar-void` utilizaba el CDN de jsDelivr para distribuir múltiples imágenes estáticas (`.webp`) de los sprites planetarios, documentado originalmente en un ADR previo. Esta decisión se había tomado bajo el supuesto de que las imágenes eran pesadas y dañarían el rendimiento si se incluían en el bundle de Javascript.

Sin embargo, tras una agresiva ronda de optimización gráfica, los sprites (`.webp`) redujeron su peso masivamente (entre 800 bytes y 10 KB cada uno). Mantener la latencia de red para activos tan pequeños provocaba destellos (Flash of Unstyled Content - FOUC) en el renderizado inicial del `<canvas>`, degradando la experiencia visual fluida.

## Decisión
Se ha revertido la política de CDN y se decidió **embeber todos los sprites como cadenas Base64 (`data URIs`) directamente en el código fuente** de `@ajrojasfuentes/core`.

### Mecanismo Técnico
1. **Precarga en Memoria:** Se ha introducido un módulo `sprites.ts` que almacena los strings de Base64. Una función `preloadAllSprites()` decodifica nativamente todos los sprites en la memoria de la GPU usando `createImageBitmap()` al momento en que el engine inicializa.
2. **Eliminación de la dependencia externa:** La propiedad `assetBasePath` en la configuración pública ha sido removida completamente. El componente se vuelve verdaderamente "Zero Config" en todos los entornos, incluyendo infraestructuras de red cerradas sin acceso a internet público (como intranets corporativas).

## Consecuencias
- **Ventaja:** Renderizado instantáneo (Time to Interactive = 0 para gráficos) y ausencia absoluta de "FOUC".
- **Ventaja:** Elimina un punto de falla de red; `stellar-void` ya no depende de la disponibilidad o bloqueo de DNS/CDNs.
- **Ventaja:** El tamaño de la librería sube un par de docenas de KB en JS, pero el trade-off a favor del rendimiento de CPU/GPU del canvas es netamente positivo.
- **Mantenimiento:** La carpeta `/assets/` original se mantiene en la raíz del repositorio de forma exclusiva como "fuente de la verdad", pero la carpeta de caché `assets/` ha sido eliminada del proceso de empaquetado (build-time).
