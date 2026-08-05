# Architecture Decision Record: CDN for Assets Distribution

## Contexto
El paquete `stellar-void` depende de múltiples imágenes estáticas (`.webp`) de gran tamaño (sprites de planetas y objetos espaciales). Incluir estas imágenes en el bundle de JavaScript mediante Base64 causaría un impacto severo en el rendimiento (TTV/TTI) debido al enorme tamaño del bundle resultante. Por otro lado, usar scripts `postinstall` de NPM para copiar los archivos es propenso a errores en monorepos y suele ser bloqueado por políticas de seguridad (`--ignore-scripts`).

## Decisión
Se ha decidido utilizar **jsDelivr** (un CDN gratuito y robusto para paquetes NPM) como el mecanismo predeterminado para servir los assets estáticos de Stellar Void.

### Convención de URL
La URL base para cargar los sprites por defecto será:
`https://cdn.jsdelivr.net/npm/stellar-void@1.0.0/assets`

### Versionado
La versión está fijada estáticamente a `@1.0.0` en el código fuente. 
- **Ventaja**: Garantiza que si en el futuro cambian los nombres, tamaños o estructuras de los sprites en la versión `2.0.0`, los usuarios que instalaron la versión `1.0.0` no sufrirán roturas, ya que seguirán descargando los assets compatibles con su versión de código.
- **Mantenimiento**: En cada Major Release, se debe actualizar esta constante en el código.

### Fallback y Self-Hosting
No se implementará un fallback automático complejo a nivel de red dentro de la librería (debido a limitaciones del cargador de imágenes interno de tsParticles). En su lugar:
1. El CDN de jsDelivr tiene alta disponibilidad garantizada para producción.
2. Si el desarrollador consumidor requiere soporte offline o alojamiento local por cumplimiento normativo, puede anular este comportamiento pasando la propiedad `assetBasePath="/su/ruta/local"` al componente `<StellarVoid />`. 

## Consecuencias
- La instalación del componente es "Plug & Play" con cero configuración.
- El tamaño del paquete NPM se mantiene pequeño (solo código y tipados), mientras que los assets se sirven eficientemente bajo demanda y se benefician del caché global.
