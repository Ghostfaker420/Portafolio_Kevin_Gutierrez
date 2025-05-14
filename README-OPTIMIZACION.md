# Optimización de Imágenes para el Portafolio

Este documento explica las dos opciones implementadas para optimizar las imágenes del portafolio, reduciendo su resolución a la mitad y mejorando el rendimiento del sitio.

## Opción 1: Optimización en tiempo real (Cliente)

Se ha implementado un script JavaScript que optimiza las imágenes automáticamente cuando se carga la página:

- El script `js/image-optimizer.js` ya está incluido en el HTML
- Reduce la resolución de las imágenes a la mitad en el navegador del usuario
- No requiere modificar los archivos originales
- Funciona automáticamente al cargar la página

### Herramientas adicionales

#### Conversión a WebP

WebP es un formato moderno que ofrece mejor compresión que JPEG y PNG manteniendo buena calidad.

1. Ejecutar el script de conversión:

```
npm run webp-convert
```

Este script:
- Convierte todas las imágenes a formato WebP
- Actualiza automáticamente el HTML para usar WebP con fallback para navegadores antiguos
- Reduce significativamente el tamaño de las imágenes (hasta un 30%)

#### Análisis de imágenes

Analiza todas las imágenes del portafolio y genera un informe detallado:

```
npm run analyze
```

El informe incluye:
- Estadísticas de tamaño y formato
- Gráficos de distribución
- Identificación de imágenes que necesitan optimización
- Recomendaciones personalizadas

**Ventajas:**
- Implementación inmediata sin necesidad de procesar archivos
- No requiere herramientas adicionales

**Desventajas:**
- La optimización ocurre después de que las imágenes originales ya se han descargado
- Consume recursos del dispositivo del usuario

## Opción 2: Optimización previa (Servidor)

Se ha creado un script Node.js para procesar todas las imágenes y generar versiones optimizadas:

### Requisitos previos

1. Tener Node.js instalado
2. Instalar las dependencias necesarias:

```
npm install
```

O instalar manualmente:

```
npm install sharp cheerio fs-extra imagemin imagemin-webp image-size
```

### Pasos para optimizar las imágenes

1. Ejecutar el script desde la terminal:

```
node optimize-images.js
```

2. El script procesará todas las imágenes en las carpetas:
   - images/Letras
   - images/Ilustraciones
   - images/Pokemon
   - images/Sticker Tanda 2
   - images/Stickers Tanda 1

3. Para cada imagen, creará una versión optimizada con el sufijo `-optimized`
   - Ejemplo: `IMG_2316.png` → `IMG_2316-optimized.png`

4. Actualizar las referencias en el HTML para usar las imágenes optimizadas:

   **Opción A: Actualización automática**
   - Instalar las dependencias necesarias: `npm install cheerio fs-extra`
   - Ejecutar el script: `node update-image-references.js`
   - El script actualizará automáticamente todas las referencias de imágenes en el HTML
   - Se creará una copia de seguridad del HTML original como `index.html.backup`

   **Opción B: Actualización manual**
   - Buscar: `src="images/Letras/IMG_2316.png"`
   - Reemplazar con: `src="images/Letras/IMG_2316-optimized.png"`

### Herramientas adicionales

#### Conversión a WebP

WebP es un formato moderno que ofrece mejor compresión que JPEG y PNG manteniendo buena calidad.

1. Ejecutar el script de conversión:

```
npm run webp-convert
```

Este script:
- Convierte todas las imágenes a formato WebP
- Actualiza automáticamente el HTML para usar WebP con fallback para navegadores antiguos
- Reduce significativamente el tamaño de las imágenes (hasta un 30%)

#### Análisis de imágenes

Analiza todas las imágenes del portafolio y genera un informe detallado:

```
npm run analyze
```

El informe incluye:
- Estadísticas de tamaño y formato
- Gráficos de distribución
- Identificación de imágenes que necesitan optimización
- Recomendaciones personalizadas

**Ventajas:**
- Mejor rendimiento para los usuarios
- Reduce el consumo de ancho de banda
- Las imágenes se cargan más rápido

**Desventajas:**
- Requiere actualizar manualmente las referencias en el HTML
- Necesita Node.js y dependencias adicionales

## Recomendación

Para obtener el mejor rendimiento, se recomienda usar la **Opción 2** (optimización previa) y actualizar las referencias en el HTML. Esto proporcionará la mejor experiencia de usuario y reducirá significativamente los tiempos de carga.

Si prefieres una solución rápida sin modificar archivos, la **Opción 1** (optimización en tiempo real) ya está implementada y funcionando automáticamente.