/**
 * fixes.js - Correcciones para problemas de compatibilidad y rendimiento
 * Este archivo soluciona conflictos entre los diferentes scripts y mejora el rendimiento
 * Versión: 2.0 - Optimizada para resolver problemas con Panolens
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicando correcciones de compatibilidad...');
    
    // 1. Resolver conflicto entre gallery.js e interactive.js
    resolveScriptConflicts();
    
    // 2. Corregir problemas con el visor de imágenes
    fixImageViewer();
    
    // 3. Optimizar carga de recursos
    optimizeResourceLoading();
    
    // 4. Corregir problemas con el visor 360°
    fixPanoramaViewer();
    
    // 5. Corregir problemas de CSS duplicados
    fixCSSConflicts();
    
    console.log('Correcciones aplicadas correctamente');
});

/**
 * Resuelve conflictos entre los diferentes archivos JavaScript
 */
function resolveScriptConflicts() {
    console.log('Resolviendo conflictos entre scripts...');
    
    // Verificar si ya existe una función openFullImage global
    if (typeof window.openFullImage !== 'function' && typeof openFullImage === 'function') {
        // Guardar referencia a la función original
        window.openFullImage = openFullImage;
    }
    
    // Verificar si createImageViewer está definido en image-viewer.js
    if (typeof createImageViewer === 'function') {
        // Asegurarse de que openFullImage use createImageViewer si está disponible
        if (!window._originalOpenFullImage) {
            window._originalOpenFullImage = window.openFullImage;
            
            window.openFullImage = function(src, altText) {
                createImageViewer(src, altText);
            };
        }
    }
    
    // Evitar inicializaciones duplicadas
    if (window._initializationComplete) return;
    window._initializationComplete = true;
    
    // Asegurar que las variables globales necesarias existan
    if (typeof window.panoramaViewer === 'undefined') {
        window.panoramaViewer = null;
    }
    
    if (typeof window.viewer === 'undefined') {
        window.viewer = null;
    }
}

/**
 * Corrige problemas con el visor de imágenes
 */
function fixImageViewer() {
    // Verificar si ya se aplicó la corrección para evitar duplicados
    if (window._imageViewerFixed) return;
    window._imageViewerFixed = true;
    
    // Asegurarse de que todos los enlaces de imágenes tengan el evento correcto
    document.querySelectorAll('.sticker-item a, .sticker-item-link').forEach(link => {
        // Verificar si el enlace ya tiene un controlador de eventos
        const hasClickHandler = link.getAttribute('data-has-click-handler') === 'true';
        
        if (!hasClickHandler) {
            // Marcar el enlace como procesado
            link.setAttribute('data-has-click-handler', 'true');
            
            // Añadir el evento correcto sin reemplazar el elemento
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const imageSrc = this.getAttribute('href');
                const imageAlt = this.querySelector('img')?.getAttribute('alt') || 'Imagen de sticker';
                
                // Usar la función disponible para mostrar la imagen
                if (typeof window.openFullImage === 'function') {
                    window.openFullImage(imageSrc, imageAlt);
                } else if (typeof createImageViewer === 'function') {
                    createImageViewer(imageSrc, imageAlt);
                } else {
                    console.error('No se encontró ninguna función para mostrar imágenes');
                }
            });
        }
    });
    
    console.log('Visor de imágenes corregido correctamente');
}

/**
 * Optimiza la carga de recursos
 */
function optimizeResourceLoading() {
    // Implementar lazy loading para imágenes que no lo tengan
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Corregir rutas de imágenes problemáticas
    document.querySelectorAll('img[src*="Sticker Tanda"]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.includes(' ')) {
            // Las URLs no deberían tener espacios, reemplazar con %20
            const newSrc = src.replace(/ /g, '%20');
            img.setAttribute('src', newSrc);
        }
    });
    
    // Corregir enlaces a imágenes
    document.querySelectorAll('a[href*="Sticker Tanda"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(' ')) {
            // Las URLs no deberían tener espacios, reemplazar con %20
            const newHref = href.replace(/ /g, '%20');
            link.setAttribute('href', newHref);
        }
    });
}

/**
 * Corrige problemas con el visor 360°
 * Esta función ha sido mejorada para garantizar la carga correcta de THREE.js y PANOLENS
 */
function fixPanoramaViewer() {
    console.log('Corrigiendo visor 360°...');
    
    // Cargar los estilos CSS específicos para el panorama
    loadPanoramaStyles();
    
    // Verificar si el elemento panorama existe (en lugar de pano)
    const panoElement = document.getElementById('panorama');
    if (!panoElement) {
        // También verificar si existe el elemento pano (para compatibilidad)
        const altPanoElement = document.getElementById('pano');
        if (!altPanoElement) {
            console.log('No se encontró el elemento #panorama o #pano - No estamos en la página de experiencias 360°');
            return;
        }
        // Si encontramos pano pero no panorama, usamos pano
        console.log('Usando elemento #pano para el visor 360°');
        loadRequiredLibraries(function() {
            initializePanorama(altPanoElement);
        });
        return;
    }
    
    console.log('Elemento panorama encontrado, verificando bibliotecas...');
    
    // Cargar THREE.js y PANOLENS si no están disponibles
    loadRequiredLibraries(function() {
        // Una vez cargadas las bibliotecas, inicializar el panorama
        initializePanorama(panoElement);
    });
}

/**
 * Carga los estilos CSS específicos para el visor panorámico
 */
function loadPanoramaStyles() {
    // Verificar si ya se cargaron los estilos
    if (document.querySelector('link[href*="panorama.css"]')) {
        return;
    }
    
    // Crear elemento link para cargar el CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/panorama.css';
    link.type = 'text/css';
    
    // Añadir al head
    document.head.appendChild(link);
    console.log('Estilos del panorama cargados correctamente');
}

/**
 * Carga las bibliotecas necesarias para el visor 360°
 */
function loadRequiredLibraries(callback) {
    // Verificar si THREE.js está cargado
    if (typeof THREE === 'undefined') {
        console.log('THREE.js no está cargado, cargando dinámicamente...');
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/156/three.min.js', function() {
            console.log('THREE.js cargado correctamente');
            
            // Después cargar PANOLENS
            if (typeof PANOLENS === 'undefined') {
                console.log('PANOLENS no está cargado, cargando dinámicamente...');
                loadScript('https://cdn.jsdelivr.net/npm/panolens@0.12.1/build/panolens.min.js', function() {
                    console.log('PANOLENS cargado correctamente');
                    // Ejecutar callback cuando ambas bibliotecas estén cargadas
                    setTimeout(callback, 500); // Pequeño retraso para asegurar que todo esté inicializado
                });
            } else {
                callback();
            }
        });
    } else if (typeof PANOLENS === 'undefined') {
        // Si THREE ya está cargado pero PANOLENS no
        console.log('PANOLENS no está cargado, cargando dinámicamente...');
        loadScript('https://cdn.jsdelivr.net/npm/panolens@0.12.1/build/panolens.min.js', function() {
            console.log('PANOLENS cargado correctamente');
            setTimeout(callback, 500);
        });
    } else {
        // Ambas bibliotecas ya están cargadas
        console.log('THREE.js y PANOLENS ya están cargados');
        callback();
    }
}

/**
 * Carga un script de forma dinámica
 */
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    script.onerror = function() {
        console.error('Error al cargar el script:', url);
    };
    document.head.appendChild(script);
}

/**
 * Inicializa el visor panorámico
 */
function initializePanorama(container) {
    console.log('Inicializando visor panorámico...');
    
    // Verificar si ya hay un visor inicializado
    if (window.panoramaViewer) {
        console.log('Ya existe un visor panorámico, no se creará uno nuevo');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const loadingElement = document.getElementById('panorama-loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        } else {
            // Crear un indicador de carga si no existe
            const newLoadingElement = document.createElement('div');
            newLoadingElement.id = 'panorama-loading';
            newLoadingElement.className = 'panorama-loading';
            newLoadingElement.innerHTML = '<div class="panorama-loading-spinner"></div><p>Cargando panorama...</p>';
            container.appendChild(newLoadingElement);
        }
        
        // Crear el visor PANOLENS con opciones mejoradas
        window.panoramaViewer = new PANOLENS.Viewer({
            container: container,
            autoRotate: true,
            autoRotateSpeed: 0.5,
            controlBar: true, // Activar barra de control para mejor usabilidad
            enableReticle: false,
            viewIndicator: true, // Activar indicador de vista para mejor orientación
            initialLookAt: new THREE.Vector3(0, 0, 0),
            cameraFov: 75,
            output: 'console' // Mostrar logs en consola para depuración
        });
        
        console.log('Visor PANOLENS creado correctamente');
        
        // Cargar la imagen panorámica predeterminada
        const defaultPanoramaPath = 'images/360_1.jpg';
        const panoramaImage = new PANOLENS.ImagePanorama(defaultPanoramaPath);
        
        // Manejar evento de carga
        panoramaImage.addEventListener('load', function() {
            console.log('Imagen panorámica cargada correctamente');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        });
        
        // Manejar evento de error
        panoramaImage.addEventListener('error', function(e) {
            console.error('Error al cargar la imagen panorámica:', e);
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            container.innerHTML = `
                <div style="color: white; text-align: center; padding: 20px; background-color: rgba(0,0,0,0.7);">
                    <p>Error al cargar la imagen panorámica.</p>
                    <p>Por favor, verifica que el archivo exista y sea accesible.</p>
                </div>
            `;
        });
        
        // Agregar el panorama al visor
        window.panoramaViewer.add(panoramaImage);
        
        // Configurar botones de control
        setupPanoramaControls();
        
        console.log('Panorama inicializado correctamente');
    }
    } catch (error) {
        console.error('Error al inicializar el panorama:', error);
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px; background-color: rgba(0,0,0,0.7);">
                <p>Error al inicializar el visor 360°.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

/**
 * Configura los controles del visor panorámico
 * Esta función ha sido mejorada para crear los controles dinámicamente si no existen
 */
function setupPanoramaControls() {
    // Buscar el contenedor del panorama
    let panoramaWrapper = document.querySelector('.panorama-wrapper');
    if (!panoramaWrapper) {
        // Si no existe un wrapper, crear uno alrededor del elemento panorama
        const panoElement = document.getElementById('panorama') || document.getElementById('pano');
        if (panoElement) {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'panorama-wrapper';
            // Insertar el wrapper antes del elemento panorama
            panoElement.parentNode.insertBefore(newWrapper, panoElement);
            // Mover el elemento panorama dentro del wrapper
            newWrapper.appendChild(panoElement);
            panoramaWrapper = newWrapper;
        } else {
            console.error('No se pudo encontrar un contenedor para el panorama');
            return;
        }
    }
    
    // Verificar si ya existe el contenedor de controles
    let controlsContainer = panoramaWrapper.querySelector('.panorama-controls');
    if (!controlsContainer) {
        // Crear el contenedor de controles
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'panorama-controls';
        panoramaWrapper.appendChild(controlsContainer);
    }
    
    // Crear o configurar el botón de pantalla completa
    let fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!fullscreenBtn) {
        fullscreenBtn = document.createElement('button');
        fullscreenBtn.id = 'fullscreen-btn';
        fullscreenBtn.className = 'panorama-control-btn';
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        controlsContainer.appendChild(fullscreenBtn);
    }
    
    // Configurar evento del botón de pantalla completa
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            if (panoramaWrapper.requestFullscreen) {
                panoramaWrapper.requestFullscreen();
            } else if (panoramaWrapper.mozRequestFullScreen) {
                panoramaWrapper.mozRequestFullScreen();
            } else if (panoramaWrapper.webkitRequestFullscreen) {
                panoramaWrapper.webkitRequestFullscreen();
            } else if (panoramaWrapper.msRequestFullscreen) {
                panoramaWrapper.msRequestFullscreen();
            }
            // Cambiar icono a comprimir
            const icon = fullscreenBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-compress';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            // Cambiar icono a expandir
            const icon = fullscreenBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-expand';
        }
    });
    
    // Crear o configurar el botón de información
    let infoBtn = document.getElementById('info-btn');
    if (!infoBtn) {
        infoBtn = document.createElement('button');
        infoBtn.id = 'info-btn';
        infoBtn.className = 'panorama-control-btn';
        infoBtn.innerHTML = '<i class="fas fa-info"></i>';
        controlsContainer.appendChild(infoBtn);
    }
    
    // Configurar evento del botón de información
    infoBtn.addEventListener('click', function() {
        const infoOverlay = document.createElement('div');
        infoOverlay.className = 'panorama-info-overlay';
        infoOverlay.innerHTML = `
            <div class="panorama-info-content">
                <h3>Acerca de esta vista</h3>
                <p>Esta es una vista panorámica 360° de una de mis intervenciones urbanas. Puedes arrastrar para mirar alrededor o usar la rueda del ratón para hacer zoom.</p>
                <button class="btn btn--outline close-info">Cerrar</button>
            </div>
        `;
        
        panoramaWrapper.appendChild(infoOverlay);
        
        // Cerrar el overlay al hacer clic en el botón
        document.querySelector('.close-info').addEventListener('click', function() {
            infoOverlay.remove();
        });
    });
    
    // Crear o configurar el botón de rotación
    let rotateBtn = document.getElementById('rotate-btn');
    if (!rotateBtn) {
        rotateBtn = document.createElement('button');
        rotateBtn.id = 'rotate-btn';
        rotateBtn.className = 'panorama-control-btn';
        rotateBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        controlsContainer.appendChild(rotateBtn);
    }
    
    // Configurar evento del botón de rotación
    if (window.panoramaViewer) {
        rotateBtn.addEventListener('click', function() {
            // Alternar rotación automática
            window.panoramaViewer.OrbitControls.autoRotate = !window.panoramaViewer.OrbitControls.autoRotate;
            
            // Cambiar el icono según el estado
            const icon = rotateBtn.querySelector('i');
            if (icon) {
                if (window.panoramaViewer.OrbitControls.autoRotate) {
                    icon.className = 'fas fa-sync-alt';
                } else {
                    icon.className = 'fas fa-pause';
                }
            }
        });
    }
    
    // Ajustar el visor al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        if (window.panoramaViewer) {
            window.panoramaViewer.onWindowResize();
        }
    });
    
    // Ajustar el visor al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        if (window.panoramaViewer) {
            window.panoramaViewer.onWindowResize();
        }
    });
}

/**
 * Corrige conflictos de CSS
 */
function fixCSSConflicts() {
    console.log('Corrigiendo conflictos de CSS...');
    
    // Corregir problemas con la clase .custom-cursor que puede causar problemas de rendimiento
    if (document.querySelector('.custom-cursor')) {
        // Si existe, asegurarse de que no cause problemas en dispositivos móviles
        if (window.innerWidth <= 768) {
            document.querySelector('.custom-cursor').style.display = 'none';
        }
    }
    
    // Corregir problemas con efectos de parallax que pueden causar problemas de rendimiento
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        // Simplificar los efectos de parallax para mejorar el rendimiento
        layer.style.transform = 'none';
    });
    
    // Corregir problemas con animaciones que pueden causar problemas de rendimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Si el usuario prefiere reducir el movimiento, desactivar todas las animaciones
        document.documentElement.classList.add('reduce-motion');
    }
    
    // Asegurarse de que las variables CSS no entren en conflicto
    const style = document.createElement('style');
    style.textContent = `
        /* Asegurar que las variables CSS de base.css tengan prioridad */
        :root {
            --primary-color: #e85e27;
            --primary-color-light: #ff6a30;
            --primary-color-dark: #c94d1b;
            --secondary-color: #cac5b8;
            --text-color: #f5f6fa;
            --dark-bg: rgba(26, 26, 26, 0.5);
            --darker-bg: rgba(18, 18, 18, 0.7);
            --white: #fefcf0;
        }
    `;
    document.head.appendChild(style);
}