/**
 * Script para optimizar imágenes reduciendo su resolución a la mitad
 * Este script procesa todas las imágenes en las carpetas del proyecto
 * y genera versiones optimizadas con el sufijo '-optimized'
 * 
 * Para ejecutar: node optimize-images.js
 * Requiere: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Carpetas que contienen imágenes para optimizar
const imageFolders = [
  'images/Letras',
  'images/Ilustraciones',
  'images/Pokemon',
  'images/Sticker Tanda 2',
  'images/Stickers Tanda 1'
];

// Extensiones de imagen a procesar
const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.PNG', '.JPEG'];

// Función para procesar una imagen
async function optimizeImage(imagePath) {
  try {
    // Obtener información de la ruta
    const dir = path.dirname(imagePath);
    const ext = path.extname(imagePath);
    const filename = path.basename(imagePath, ext);
    
    // Crear nombre para la versión optimizada
    const optimizedPath = path.join(dir, `${filename}-optimized${ext}`);
    
    console.log(`Procesando: ${imagePath}`);
    
    // Procesar la imagen con sharp
    await sharp(imagePath)
      // Redimensionar a la mitad del tamaño original
      .metadata()
      .then(metadata => {
        return sharp(imagePath)
          .resize({
            width: Math.floor(metadata.width / 2),
            height: Math.floor(metadata.height / 2),
            fit: 'inside',
            withoutEnlargement: true
          })
          // Ajustar calidad según el formato
          .jpeg({ quality: 80 })
          .png({ quality: 80 })
          .toFile(optimizedPath);
      });
    
    console.log(`✓ Imagen optimizada guardada: ${optimizedPath}`);
    return optimizedPath;
  } catch (error) {
    console.error(`Error al procesar ${imagePath}:`, error);
    return null;
  }
}

// Función para procesar todas las imágenes en una carpeta
async function processFolder(folderPath) {
  try {
    // Verificar si la carpeta existe
    if (!fs.existsSync(folderPath)) {
      console.warn(`La carpeta ${folderPath} no existe. Omitiendo...`);
      return [];
    }
    
    console.log(`\nProcesando carpeta: ${folderPath}`);
    
    // Leer archivos en la carpeta
    const files = fs.readdirSync(folderPath);
    const optimizedImages = [];
    
    // Procesar cada archivo
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      
      // Si es un directorio, procesarlo recursivamente
      if (stat.isDirectory()) {
        const subResults = await processFolder(filePath);
        optimizedImages.push(...subResults);
        continue;
      }
      
      // Verificar si es una imagen por su extensión
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext) || imageExtensions.includes(ext.toUpperCase())) {
        // Verificar si ya existe una versión optimizada
        const baseName = path.basename(file, ext);
        if (baseName.endsWith('-optimized')) {
          console.log(`Omitiendo imagen ya optimizada: ${file}`);
          continue;
        }
        
        // Optimizar la imagen
        const optimizedPath = await optimizeImage(filePath);
        if (optimizedPath) {
          optimizedImages.push(optimizedPath);
        }
      }
    }
    
    return optimizedImages;
  } catch (error) {
    console.error(`Error al procesar la carpeta ${folderPath}:`, error);
    return [];
  }
}

// Función principal
async function main() {
  console.log('Iniciando proceso de optimización de imágenes...');
  
  let totalOptimized = 0;
  
  // Procesar cada carpeta de imágenes
  for (const folder of imageFolders) {
    const optimizedImages = await processFolder(folder);
    totalOptimized += optimizedImages.length;
  }
  
  console.log(`\n✅ Proceso completado. Se optimizaron ${totalOptimized} imágenes.`);
  console.log('\nPara usar las imágenes optimizadas, actualice las referencias en el HTML');
  console.log('Ejemplo: "images/Letras/IMG_2316.png" → "images/Letras/IMG_2316-optimized.png"');
}

// Ejecutar el script
main().catch(error => {
  console.error('Error en el proceso de optimización:', error);
});