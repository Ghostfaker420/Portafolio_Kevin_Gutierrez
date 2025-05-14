/**
 * Script para analizar imágenes del portafolio y proporcionar estadísticas
 * Útil para identificar imágenes que necesitan optimización
 * 
 * Para ejecutar: node analyze-images.js
 * Requiere: npm install fs-extra image-size
 */

const fs = require('fs-extra');
const path = require('path');
const sizeOf = require('image-size');

// Carpetas que contienen imágenes para analizar
const imageFolders = [
  'images/Letras',
  'images/Ilustraciones',
  'images/Pokemon',
  'images/Sticker Tanda 2',
  'images/Stickers Tanda 1'
];

// Extensiones de imagen a procesar
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.JPG', '.PNG', '.JPEG'];

// Función para formatear el tamaño en KB o MB
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

// Función para analizar una imagen
async function analyzeImage(imagePath) {
  try {
    // Obtener estadísticas del archivo
    const stats = await fs.stat(imagePath);
    const fileSize = stats.size;
    
    // Obtener dimensiones de la imagen
    const dimensions = sizeOf(imagePath);
    
    // Calcular densidad de píxeles (tamaño por píxel)
    const pixelCount = dimensions.width * dimensions.height;
    const bytesPerPixel = fileSize / pixelCount;
    
    return {
      path: imagePath,
      size: fileSize,
      formattedSize: formatSize(fileSize),
      width: dimensions.width,
      height: dimensions.height,
      type: dimensions.type,
      bytesPerPixel: bytesPerPixel,
      efficiency: bytesPerPixel < 0.5 ? 'Buena' : bytesPerPixel < 1 ? 'Regular' : 'Baja'
    };
  } catch (error) {
    console.error(`Error al analizar ${imagePath}:`, error);
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
    
    console.log(`\nAnalizando carpeta: ${folderPath}`);
    
    // Leer archivos en la carpeta
    const files = fs.readdirSync(folderPath);
    const analyzedImages = [];
    
    // Procesar cada archivo
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      
      // Si es un directorio, procesarlo recursivamente
      if (stat.isDirectory()) {
        const subResults = await processFolder(filePath);
        analyzedImages.push(...subResults);
        continue;
      }
      
      // Verificar si es una imagen por su extensión
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext) || imageExtensions.includes(ext.toUpperCase())) {
        // Analizar la imagen
        const imageData = await analyzeImage(filePath);
        if (imageData) {
          analyzedImages.push(imageData);
        }
      }
    }
    
    return analyzedImages;
  } catch (error) {
    console.error(`Error al procesar la carpeta ${folderPath}:`, error);
    return [];
  }
}

// Función para generar un informe HTML
async function generateReport(analyzedImages) {
  // Ordenar imágenes por tamaño (de mayor a menor)
  analyzedImages.sort((a, b) => b.size - a.size);
  
  // Calcular estadísticas generales
  const totalSize = analyzedImages.reduce((sum, img) => sum + img.size, 0);
  const avgSize = totalSize / analyzedImages.length;
  const typeCount = {};
  
  analyzedImages.forEach(img => {
    typeCount[img.type] = (typeCount[img.type] || 0) + 1;
  });
  
  // Crear contenido HTML
  let html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análisis de Imágenes - Portafolio</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
      h1, h2 { color: #2c3e50; }
      .container { max-width: 1200px; margin: 0 auto; }
      .summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .summary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
      .summary-item { background-color: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
      th { background-color: #f2f2f2; }
      tr:hover { background-color: #f5f5f5; }
      .efficiency-good { color: green; }
      .efficiency-medium { color: orange; }
      .efficiency-low { color: red; }
      .chart-container { margin: 20px 0; height: 400px; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div class="container">
      <h1>Análisis de Imágenes - Portafolio</h1>
      
      <div class="summary">
        <h2>Resumen</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <h3>Total de imágenes</h3>
            <p>${analyzedImages.length}</p>
          </div>
          <div class="summary-item">
            <h3>Tamaño total</h3>
            <p>${formatSize(totalSize)}</p>
          </div>
          <div class="summary-item">
            <h3>Tamaño promedio</h3>
            <p>${formatSize(avgSize)}</p>
          </div>
          <div class="summary-item">
            <h3>Formatos</h3>
            <p>${Object.entries(typeCount).map(([type, count]) => `${type}: ${count}`).join('<br>')}</p>
          </div>
        </div>
      </div>
      
      <h2>Distribución por formato</h2>
      <div class="chart-container">
        <canvas id="formatChart"></canvas>
      </div>
      
      <h2>Top 10 imágenes más grandes</h2>
      <div class="chart-container">
        <canvas id="sizeChart"></canvas>
      </div>
      
      <h2>Lista completa de imágenes</h2>
      <table>
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Formato</th>
            <th>Tamaño</th>
            <th>Dimensiones</th>
            <th>Eficiencia</th>
          </tr>
        </thead>
        <tbody>
          ${analyzedImages.map(img => `
            <tr>
              <td>${path.basename(img.path)}</td>
              <td>${img.type}</td>
              <td>${img.formattedSize}</td>
              <td>${img.width}x${img.height}</td>
              <td class="efficiency-${img.efficiency === 'Buena' ? 'good' : img.efficiency === 'Regular' ? 'medium' : 'low'}">${img.efficiency}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <script>
      // Gráfico de distribución por formato
      const formatCtx = document.getElementById('formatChart').getContext('2d');
      new Chart(formatCtx, {
        type: 'pie',
        data: {
          labels: ${JSON.stringify(Object.keys(typeCount))},
          datasets: [{
            data: ${JSON.stringify(Object.values(typeCount))},
            backgroundColor: [
              '#4bc0c0', '#ff6384', '#36a2eb', '#ffcd56', '#9966ff', '#ff9f40'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Distribución por formato' }
          }
        }
      });
      
      // Gráfico de top 10 imágenes más grandes
      const top10 = ${JSON.stringify(analyzedImages.slice(0, 10).map(img => ({ 
        name: path.basename(img.path), 
        size: Math.round(img.size / 1024) // Convertir a KB
      })))};
      
      const sizeCtx = document.getElementById('sizeChart').getContext('2d');
      new Chart(sizeCtx, {
        type: 'bar',
        data: {
          labels: top10.map(img => img.name),
          datasets: [{
            label: 'Tamaño (KB)',
            data: top10.map(img => img.size),
            backgroundColor: '#36a2eb'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Top 10 imágenes más grandes' }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Tamaño (KB)' } }
          }
        }
      });
    </script>
  </body>
  </html>
  `;
  
  // Guardar el informe
  const reportPath = 'image-analysis-report.html';
  await fs.writeFile(reportPath, html);
  console.log(`\n✅ Informe generado: ${reportPath}`);
  console.log('Abra este archivo en su navegador para ver el análisis detallado.');
  
  return reportPath;
}

// Función principal
async function main() {
  try {
    console.log('Iniciando análisis de imágenes...');
    
    const allImages = [];
    
    // Procesar cada carpeta de imágenes
    for (const folder of imageFolders) {
      const images = await processFolder(folder);
      allImages.push(...images);
    }
    
    if (allImages.length === 0) {
      console.log('\n❌ No se encontraron imágenes para analizar.');
      return;
    }
    
    console.log(`\n📊 Análisis completado. Se analizaron ${allImages.length} imágenes.`);
    
    // Mostrar estadísticas básicas en consola
    const totalSize = allImages.reduce((sum, img) => sum + img.size, 0);
    console.log(`\nTamaño total: ${formatSize(totalSize)}`);
    console.log(`Tamaño promedio: ${formatSize(totalSize / allImages.length)}`);
    
    // Encontrar la imagen más grande
    const largestImage = allImages.reduce((largest, img) => 
      img.size > largest.size ? img : largest, allImages[0]);
    console.log(`\nImagen más grande: ${path.basename(largestImage.path)}`);
    console.log(`  - Tamaño: ${largestImage.formattedSize}`);
    console.log(`  - Dimensiones: ${largestImage.width}x${largestImage.height}`);
    console.log(`  - Formato: ${largestImage.type}`);
    
    // Generar informe HTML
    const reportPath = await generateReport(allImages);
    
    console.log('\n📋 Recomendaciones:');
    console.log('1. Considere convertir imágenes grandes a formato WebP (npm run webp-convert)');
    console.log('2. Optimice imágenes PNG y JPG (npm run optimize)');
    console.log('3. Reduzca las dimensiones de imágenes muy grandes');
  } catch (error) {
    console.error('Error en el análisis de imágenes:', error);
  }
}

// Ejecutar el script
main();