/**
 * Script para actualizar automáticamente las referencias de imágenes en el HTML
 * después de ejecutar el proceso de optimización de imágenes
 * 
 * Para ejecutar: node update-image-references.js
 * Requiere: npm install cheerio fs-extra
 */

const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

// Archivo HTML principal
const htmlFile = 'index.html';

// Función para verificar si existe la versión optimizada de una imagen
function optimizedVersionExists(imagePath) {
  // Obtener información de la ruta
  const dir = path.dirname(imagePath);
  const ext = path.extname(imagePath);
  const filename = path.basename(imagePath, ext);
  
  // Ruta de la versión optimizada
  const optimizedPath = path.join(dir, `${filename}-optimized${ext}`);
  
  // Verificar si existe
  return fs.existsSync(optimizedPath) ? optimizedPath : null;
}

// Función principal
async function main() {
  try {
    console.log(`Actualizando referencias de imágenes en ${htmlFile}...`);
    
    // Leer el archivo HTML
    const htmlContent = await fs.readFile(htmlFile, 'utf-8');
    
    // Cargar el HTML con cheerio
    const $ = cheerio.load(htmlContent);
    
    // Contador de imágenes actualizadas
    let updatedCount = 0;
    
    // Procesar todas las imágenes
    $('img').each((index, element) => {
      const img = $(element);
      const src = img.attr('src');
      
      // Omitir imágenes SVG y las que ya están optimizadas
      if (src && !src.endsWith('.svg') && !src.includes('-optimized')) {
        // Verificar si existe la versión optimizada
        const optimizedPath = optimizedVersionExists(src);
        
        if (optimizedPath) {
          // Actualizar la referencia
          const newSrc = src.replace(/(\.\w+)$/, '-optimized$1');
          img.attr('src', newSrc);
          console.log(`✓ Actualizada: ${src} → ${newSrc}`);
          updatedCount++;
        }
      }
    });
    
    // Guardar los cambios
    if (updatedCount > 0) {
      // Crear una copia de seguridad del archivo original
      await fs.copy(htmlFile, `${htmlFile}.backup`);
      console.log(`✓ Copia de seguridad creada: ${htmlFile}.backup`);
      
      // Guardar el archivo actualizado
      await fs.writeFile(htmlFile, $.html());
      console.log(`✓ Archivo HTML actualizado con ${updatedCount} referencias de imágenes optimizadas`);
    } else {
      console.log('No se encontraron imágenes para actualizar');
    }
    
    console.log('\n✅ Proceso completado');
    console.log('\nNota: Este script actualiza las referencias solo después de haber ejecutado');
    console.log('el script de optimización de imágenes (optimize-images.js)');
  } catch (error) {
    console.error('Error al actualizar las referencias:', error);
  }
}

// Ejecutar el script
main();