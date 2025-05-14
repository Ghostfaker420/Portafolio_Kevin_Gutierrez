/**
 * Script para optimizar imágenes reduciendo su resolución a la mitad
 * Este script utiliza la API de Canvas para redimensionar imágenes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Función para optimizar una imagen
    function optimizeImage(imgElement) {
        // Solo procesar si la imagen ya está cargada
        if (!imgElement.complete) {
            imgElement.onload = function() {
                processImage(imgElement);
            };
        } else {
            processImage(imgElement);
        }
    }

    // Función para procesar la imagen usando canvas
    function processImage(imgElement) {
        // Obtener las dimensiones originales
        const originalWidth = imgElement.naturalWidth;
        const originalHeight = imgElement.naturalHeight;
        
        // Calcular las nuevas dimensiones (mitad del tamaño original)
        const newWidth = Math.floor(originalWidth / 2);
        const newHeight = Math.floor(originalHeight / 2);
        
        // Crear un canvas para redimensionar la imagen
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Dibujar la imagen redimensionada en el canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0, newWidth, newHeight);
        
        // Convertir el canvas a una URL de datos con calidad reducida (0.8 = 80%)
        const optimizedSrc = canvas.toDataURL('image/jpeg', 0.8);
        
        // Reemplazar la fuente de la imagen con la versión optimizada
        imgElement.src = optimizedSrc;
        
        // Añadir atributo para indicar que la imagen ha sido optimizada
        imgElement.setAttribute('data-optimized', 'true');
        
        // Registrar en consola para depuración
        console.log(`Imagen optimizada: ${imgElement.alt || 'sin alt'} - Tamaño original: ${originalWidth}x${originalHeight} -> Nuevo: ${newWidth}x${newHeight}`);
    }

    // Seleccionar todas las imágenes que no sean SVG (los SVG ya son ligeros)
    const images = document.querySelectorAll('img:not([src$=".svg"])');
    
    // Optimizar cada imagen
    images.forEach(function(img) {
        // Evitar optimizar imágenes ya procesadas
        if (!img.hasAttribute('data-optimized')) {
            optimizeImage(img);
        }
    });
    
    console.log(`Proceso de optimización iniciado para ${images.length} imágenes`);
});