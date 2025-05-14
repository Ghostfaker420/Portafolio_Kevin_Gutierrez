/**
 * Script para convertir imágenes a formato WebP
 * WebP ofrece mejor compresión que JPEG y PNG manteniendo buena calidad
 * 
 * Para ejecutar: node webp-convert.js
 * Requiere: npm install sharp imagemin imagemin-webp
 */

const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

// Carpetas que contienen imágenes para convertir
const imageFolders = [
  'images/Letras',
  'images/Ilustraciones',
  'images/Pokemon',
  'images/Sticker Tanda 2',
  'images/Stickers Tanda 1'
];

// Extensiones de imagen a procesar
const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.PNG', '.JPEG'];

// Función para convertir una imagen a WebP usando Sharp
async function convertToWebP(imagePath) {
  try {
    // Obtener información de la ruta
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath, path.extname(imagePath));
    
    // Crear nombre para la versión WebP
    const webpPath = path.join(dir, `${filename}.webp`);
    
    console.log(`Convirtiendo: ${imagePath} a WebP`);
    
    // Convertir la imagen a WebP con Sharp
    await sharp(imagePath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    
    console.log(`✓ Imagen WebP guardada: ${webpPath}`);
    return webpPath;
  } catch (error) {
    console.error(`Error al convertir ${imagePath}:`, error);
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
    const convertedImages = [];
    
    // Procesar cada archivo
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      
      // Si es un directorio, procesarlo recursivamente
      if (stat.isDirectory()) {
        const subResults = await processFolder(filePath);
        convertedImages.push(...subResults);
        continue;
      }
      
      // Verificar si es una imagen por su extensión
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext) || imageExtensions.includes(ext.toUpperCase())) {
        // Verificar si ya existe una versión WebP
        const baseName = path.basename(file, ext);
        const webpFile = path.join(folderPath, `${baseName}.webp`);
        
        if (fs.existsSync(webpFile)) {
          console.log(`Omitiendo imagen ya convertida: ${file}`);
          continue;
        }
        
        // Convertir la imagen
        const webpPath = await convertToWebP(filePath);
        if (webpPath) {
          convertedImages.push(webpPath);
        }
      }
    }
    
    return convertedImages;
  } catch (error) {
    console.error(`Error al procesar la carpeta ${folderPath}:`, error);
    return [];
  }
}

// Función para actualizar referencias HTML para usar WebP con fallback
async function updateHtmlWithWebP() {
  try {
    const htmlFile = 'index.html';
    console.log(`\nActualizando referencias de imágenes en ${htmlFile} para usar WebP...`);
    
    // Verificar si existe el archivo HTML
    if (!fs.existsSync(htmlFile)) {
      console.warn(`El archivo ${htmlFile} no existe. Omitiendo actualización HTML.`);
      return;
    }
    
    // Leer el archivo HTML
    const cheerio = require('cheerio');
    const htmlContent = await fs.readFile(htmlFile, 'utf-8');
    
    // Cargar el HTML con cheerio
    const $ = cheerio.load(htmlContent);
    
    // Contador de imágenes actualizadas
    let updatedCount = 0;
    
    // Procesar todas las imágenes
    $('img').each((index, element) => {
      const img = $(element);
      const src = img.attr('src');
      
      // Omitir imágenes SVG y las que ya tienen picture
      if (src && !src.endsWith('.svg') && !img.parent().is('picture')) {
        const ext = path.extname(src);
        const webpSrc = src.replace(ext, '.webp');
        
        // Verificar si existe la versión WebP
        if (fs.existsSync(webpSrc)) {
          // Crear estructura picture para WebP con fallback
          const picture = $('<picture></picture>');
          const sourceWebP = $('<source></source>').attr({
            srcset: webpSrc,
            type: 'image/webp'
          });
          
          // Clonar la imagen original para usarla como fallback
          const imgClone = img.clone();
          
          // Reemplazar la imagen con la estructura picture
          img.replaceWith(picture);
          picture.append(sourceWebP);
          picture.append(imgClone);
          
          console.log(`✓ Actualizada: ${src} → WebP con fallback`);
          updatedCount++;
        }
      }
    });
    
    // Guardar los cambios
    if (updatedCount > 0) {
      // Crear una copia de seguridad del archivo original
      await fs.copy(htmlFile, `${htmlFile}.webp-backup`);
      console.log(`✓ Copia de seguridad creada: ${htmlFile}.webp-backup`);
      
      // Guardar el archivo actualizado
      await fs.writeFile(htmlFile, $.html());
      console.log(`✓ Archivo HTML actualizado con ${updatedCount} referencias de imágenes WebP`);
    } else {
      console.log('No se encontraron imágenes para actualizar a WebP');
    }
  } catch (error) {
    console.error('Error al actualizar las referencias WebP:', error);
  }
}

// Función principal
async function main() {
  try {
    console.log('Iniciando conversión de imágenes a WebP...');
    
    let totalConverted = 0;
    
    // Procesar cada carpeta de imágenes
    for (const folder of imageFolders) {
      const convertedImages = await processFolder(folder);
      totalConverted += convertedImages.length;
    }
    
    console.log(`\n✅ Proceso completado. Se convirtieron ${totalConverted} imágenes a formato WebP.`);
    
    // Actualizar referencias en el HTML
    if (totalConverted > 0) {
      await updateHtmlWithWebP();
    }
    
    console.log('\n📋 Resumen:');
    console.log('1. Las imágenes WebP son hasta un 30% más pequeñas que JPEG y PNG');
    console.log('2. Se ha agregado soporte de fallback para navegadores antiguos');
    console.log('3. Para usar las imágenes WebP, ejecute: npm run webp-convert');
  } catch (error) {
    console.error('Error en el proceso de conversión a WebP:', error);
  }
}

// Ejecutar el script
main();