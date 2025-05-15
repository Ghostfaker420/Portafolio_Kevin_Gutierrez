/**
 * performance-optimizer.js - Script para optimizar el rendimiento de la página
 * Implementa lazy loading, optimización de imágenes y mejora la experiencia de carga
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ocultar el loader cuando la página esté lista
    const hideLoader = () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    };

    // Implementar lazy loading para todas las imágenes
    const lazyLoadImages = () => {
        // Usar IntersectionObserver para cargar imágenes cuando sean visibles
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Seleccionar todas las imágenes con atributo data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    };

    // Convertir imágenes a formato WebP cuando sea posible
    const optimizeImageFormat = () => {
        // Verificar soporte de WebP
        const canUseWebP = () => {
            const elem = document.createElement('canvas');
            if (elem.getContext && elem.getContext('2d')) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        };

        // Si el navegador soporta WebP, intentar usar versiones WebP de las imágenes
        if (canUseWebP()) {
            document.querySelectorAll('img:not([src$=".svg"])').forEach(img => {
                const currentSrc = img.src;
                if (currentSrc && !currentSrc.includes('data:') && !currentSrc.endsWith('.webp') && !currentSrc.endsWith('.svg')) {
                    // Crear la ruta para la versión WebP
                    const webpSrc = currentSrc.substring(0, currentSrc.lastIndexOf('.')) + '.webp';
                    
                    // Verificar si existe la versión WebP antes de cambiar
                    const testImg = new Image();
                    testImg.onload = () => { img.src = webpSrc; };
                    testImg.onerror = () => { /* Mantener la imagen original */ };
                    testImg.src = webpSrc;
                }
            });
        }
    };

    // Optimizar tamaño de imágenes según el dispositivo
    const optimizeImageSize = () => {
        const screenWidth = window.innerWidth;
        
        document.querySelectorAll('.collection-item__image').forEach(img => {
            // Reducir la calidad de imagen en dispositivos móviles
            if (screenWidth <= 768) {
                // Crear un canvas para redimensionar la imagen
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Esperar a que la imagen esté cargada
                if (img.complete) {
                    resizeImage();
                } else {
                    img.onload = resizeImage;
                }
                
                function resizeImage() {
                    // Solo procesar si la imagen es grande
                    if (img.naturalWidth > screenWidth) {
                        const aspectRatio = img.naturalHeight / img.naturalWidth;
                        const newWidth = screenWidth;
                        const newHeight = newWidth * aspectRatio;
                        
                        canvas.width = newWidth;
                        canvas.height = newHeight;
                        
                        // Dibujar la imagen redimensionada
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);
                        
                        // Reemplazar la imagen con la versión optimizada
                        img.src = canvas.toDataURL('image/jpeg', 0.8);
                    }
                }
            }
        });
    };

    // Ejecutar optimizaciones
    lazyLoadImages();
    optimizeImageFormat();
    optimizeImageSize();
    
    // Ocultar el loader cuando las imágenes críticas estén cargadas
    window.addEventListener('load', hideLoader);
    
    // Establecer un tiempo máximo para el loader (3 segundos)
    setTimeout(hideLoader, 3000);
});