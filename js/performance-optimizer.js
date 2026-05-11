/**
 * performance-optimizer.js - Script para optimizar el rendimiento de la página
 * Implementa lazy loading, optimización de imágenes y mejora la experiencia de carga
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el optimizador de imágenes después de que el DOM esté listo
    const ImageOptimizer = {
        config: {
            rootMargin: '50px 0px',
            threshold: 0.1
        },

        init() {
            // Asegurar que el loader esté visible inicialmente
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.style.display = 'flex';
                loader.style.opacity = '1';
            }

            this.initLazyLoading();
            this.setupLoader();
        },

        setupLoader() {
            // Establecer un tiempo máximo de espera para el loader
            const maxLoadTime = 5000; // 5 segundos máximo
            
            setTimeout(() => {
                this.hideLoader();
            }, maxLoadTime);

            // Intentar ocultar el loader cuando las imágenes críticas estén cargadas
            const criticalImages = Array.from(document.querySelectorAll('img:not([loading="lazy"])'))
                .filter(img => !img.complete);

            if (criticalImages.length === 0) {
                this.hideLoader();
                return;
            }

            Promise.all(
                criticalImages.map(img => {
                    return new Promise((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    });
                })
            ).then(() => this.hideLoader());
        },

        hideLoader() {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        },

        initLazyLoading() {
            // Agregar loading="lazy" a todas las imágenes que no lo tengan
            document.querySelectorAll('img:not([loading])').
                forEach(img => img.setAttribute('loading', 'lazy'));

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(
                    this.handleIntersection.bind(this),
                    this.config
                );

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            } else {
                this.loadAllImages();
            }
        },

        handleIntersection(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target, observer);
                }
            });
        },

        loadImage(img, observer) {
            const src = img.getAttribute('data-src');
            if (src) {
                // Crear una nueva imagen para precargar
                const tempImage = new Image();
                tempImage.onload = () => {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                };
                tempImage.src = src;
            }
        },

        loadAllImages() {
            document.querySelectorAll('img[data-src]').forEach(img => {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
            });
        }
    };

    // Inicializar el optimizador
    ImageOptimizer.init();
});

const FormatDetector = {
    async detectWebP() {
        try {
            const elem = document.createElement('canvas');
            const hasSupport = elem.getContext && 
                          elem.getContext('2d') && 
                          elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            return hasSupport;
        } catch (e) {
            console.warn('Error detectando soporte WebP:', e);
            return false;
        }
    },

    async detectAVIF() {
        try {
            const elem = document.createElement('canvas');
            return elem.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        } catch (e) {
            console.warn('Error detectando soporte AVIF:', e);
            return false;
        }
    }
};

    // Si el navegador soporta WebP, intentar usar versiones WebP de las imágenes
    FormatDetector.detectWebP().then(canUseWebP => {
        if (canUseWebP) {
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
    }).catch(error => {
        console.warn('Error al detectar soporte WebP:', error);
    });
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
                    resizeImage(img, canvas, ctx);
                } else {
                    img.onload = () => resizeImage(img, canvas, ctx);
                }
            }
        });
    };

    // Función para redimensionar imagen
    function resizeImage(img, canvas, ctx) {
        try {
            // Solo procesar si la imagen es grande
            if (img.naturalWidth > window.innerWidth) {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const newWidth = window.innerWidth;
                const newHeight = newWidth * aspectRatio;
                
                canvas.width = newWidth;
                canvas.height = newHeight;
                
                // Dibujar la imagen redimensionada
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                // Reemplazar la imagen con la versión optimizada
                img.src = canvas.toDataURL('image/jpeg', 0.8);
            }
        } catch (error) {
            console.warn('Error al redimensionar imagen:', error);
        }
    }

    // Ejecutar optimizaciones
    try {
        ImageOptimizer.initLazyLoading();
        FormatDetector.detectWebP().then(canUseWebP => {
            if (canUseWebP) {
                optimizeImageFormat();
            }
        });
        optimizeImageSize();
    } catch (error) {
        console.error('Error al ejecutar optimizaciones:', error);
        // Asegurar que el loader se oculte incluso si hay errores
        hideLoader();
    }
    
    // Ocultar el loader cuando las imágenes críticas estén cargadas
    window.addEventListener('load', hideLoader);
    
    // Establecer un tiempo máximo para el loader (5 segundos)
    setTimeout(hideLoader, 5000);

    // Manejar errores de carga de imágenes
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Error al cargar imagen:', e.target.src);
            // Intentar cargar una imagen de respaldo o mostrar un placeholder
            e.target.src = 'images/placeholder.svg';
        }
    }, true);
});