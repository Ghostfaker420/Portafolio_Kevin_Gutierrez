document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando script de panorama.js");
    
    // Elementos del DOM
    const panoramaContainer = document.getElementById('panorama');
    
    // Verificar que el contenedor existe
    if (!panoramaContainer) {
        console.log("No se encontró el contenedor #panorama - No estamos en la página de experiencias 360°");
        return; // Salir silenciosamente si no estamos en la página correcta
    }
    
    // Obtener otros elementos del DOM solo si estamos en la página correcta
    const loadingElement = document.getElementById('panorama-loading');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const infoBtn = document.getElementById('info-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    
    console.log("Inicializando visor 360° - Contenedor encontrado");
    
    // Definir variables globales para que sean accesibles desde otros scripts
    window.panoramaViewer = null;
    window.viewer = null;

    // Verificar si THREE y PANOLENS están cargados
    if (typeof THREE === 'undefined' || typeof PANOLENS === 'undefined') {
        console.error("Error: THREE o PANOLENS no están definidos. Verificando carga de bibliotecas...");
        
        // Crear una función para cargar scripts de forma secuencial
        const loadScript = function(url, callback) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = callback;
            script.onerror = function() {
                console.error('Error al cargar el script:', url);
            };
            document.head.appendChild(script);
        };
        
        // Cargar THREE.js primero, luego PANOLENS
        if (typeof THREE === 'undefined') {
            console.log("Cargando THREE.js dinámicamente");
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/156/three.min.js", function() {
                console.log("THREE.js cargado correctamente");
                
                // Después cargar PANOLENS si es necesario
                if (typeof PANOLENS === 'undefined') {
                    console.log("Cargando PANOLENS dinámicamente");
                    loadScript("https://cdn.jsdelivr.net/npm/panolens@0.12.1/build/panolens.min.js", function() {
                        console.log("PANOLENS cargado correctamente, iniciando panorama");
                        // Pequeño retraso para asegurar que todo esté inicializado
                        setTimeout(function() {
                            initPanorama();
                        }, 500);
                    });
                } else {
                    setTimeout(function() {
                        initPanorama();
                    }, 500);
                }
            });
        } else if (typeof PANOLENS === 'undefined') {
            // Si THREE ya está cargado pero PANOLENS no
            console.log("Cargando PANOLENS dinámicamente");
            loadScript("https://cdn.jsdelivr.net/npm/panolens@0.12.1/build/panolens.min.js", function() {
                console.log("PANOLENS cargado correctamente, iniciando panorama");
                // Pequeño retraso para asegurar que todo esté inicializado
                setTimeout(function() {
                    initPanorama();
                }, 500);
            });
        }
        
        if (loadingElement) {
            loadingElement.innerHTML = '<div class="panorama-loading-spinner"></div><p>Cargando bibliotecas necesarias...</p>';
            loadingElement.style.display = 'flex';
        }
        return;
    }
    
    // Inicializar el panorama
    initPanorama();
    
    // Función principal de inicialización del panorama
    function initPanorama() {
        console.log("PANOLENS detectado correctamente, iniciando visor");

        // Mostrar carga inicial
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }

        try {
            // Configuración del visor PANOLENS
            window.panoramaViewer = new PANOLENS.Viewer({
                container: panoramaContainer,
                autoRotate: true,
                autoRotateSpeed: 0.5,
                controlBar: false,
                enableReticle: false,
                viewIndicator: false,
                initialLookAt: new THREE.Vector3(0, 0, 0),
                cameraFov: 75,
                output: 'none' // Reducir logs para mejor rendimiento
            });
            
            console.log("Visor PANOLENS creado correctamente");

            // Crear el panorama con imagen predeterminada
            const defaultPanoramaPath = 'images/360_1.jpg';
            window.viewer = loadPanoramaImage(defaultPanoramaPath);
            
            // Configurar selector de panoramas
            setupPanoramaSelector(window.panoramaViewer);
            
            // Configurar botones de control
            setupControlButtons(window.panoramaViewer);
            
            // Ocultar carga cuando el panorama esté listo
            setTimeout(function() {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            }, 2000);
        } catch (error) {
            console.error("Error al inicializar el visor panorámico:", error);
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            panoramaContainer.innerHTML = `
                <div style="color: white; text-align: center; padding: 20px; background-color: rgba(0,0,0,0.7);">
                    <p>Error al inicializar el visor 360°.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Cargar imagen panorámica
    function loadPanoramaImage(imagePath) {
        console.log("Intentando cargar imagen panorámica:", imagePath);
        
        // Mostrar carga
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.style.opacity = '1';
        }
        
        try {
            const panoramaImage = new PANOLENS.ImagePanorama(imagePath);

            // Manejar evento de carga
            panoramaImage.addEventListener('load', function() {
                console.log("PANOLENS: Panorama cargado correctamente");
                if (loadingElement) {
                    loadingElement.style.opacity = '0';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                    }, 500); // Ocultar suavemente
                }
            });

            // Manejar evento de error
            panoramaImage.addEventListener('error', function(e) {
                console.error('PANOLENS: Error al cargar la imagen panorámica:', imagePath);
                if (loadingElement) {
                    loadingElement.style.display = 'none'; // Ocultar carga si hay error
                }
                panoramaContainer.innerHTML = `<div style="color:white; background:rgba(0,0,0,0.7); padding:1em; text-align:center;">
                    <p>Error al cargar imagen 360°</p>
                    <p>Por favor, verifica que el archivo existe: ${imagePath}</p>
                </div>`;
            });
            
            // Agregar el panorama al visor
            if (window.panoramaViewer) {
                window.panoramaViewer.add(panoramaImage);
            }

            return panoramaImage;
        } catch (error) {
            console.error('Error al crear el panorama:', error);
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            panoramaContainer.innerHTML = `<div style="color:white; background:rgba(0,0,0,0.7); padding:1em; text-align:center;">
                <p>Error al crear el panorama</p>
                <p>Error: ${error.message}</p>
            </div>`;
            return null;
        }
    }

    // Configurar selector de panoramas
    function setupPanoramaSelector(viewer) {
        const thumbnails = document.querySelectorAll('.panorama-thumb');
        if (thumbnails.length === 0) {
            console.log("No se encontraron miniaturas para el selector de panoramas");
            return;
        }
        
        console.log(`Configurando ${thumbnails.length} miniaturas para selector de panoramas`);
        
        // Crear un mapa para almacenar los panoramas cargados
        const panoramaMap = new Map();
        
        // Configurar cada miniatura
        thumbnails.forEach((thumb, index) => {
            const panoramaPath = thumb.dataset.panorama;
            if (!panoramaPath) {
                console.warn(`Miniatura ${index} no tiene atributo data-panorama`);
                return;
            }
            
            // Cargar el panorama solo cuando se hace clic (lazy loading)
            thumb.addEventListener('click', function() {
                // Mostrar indicador de carga
                if (loadingElement) {
                    loadingElement.style.display = 'flex';
                    loadingElement.style.opacity = '1';
                }
                
                // Verificar si ya tenemos este panorama cargado
                let panorama;
                if (panoramaMap.has(panoramaPath)) {
                    panorama = panoramaMap.get(panoramaPath);
                    console.log(`Usando panorama previamente cargado: ${panoramaPath}`);
                } else {
                    // Cargar nuevo panorama
                    panorama = loadPanoramaImage(panoramaPath);
                    panoramaMap.set(panoramaPath, panorama);
                    viewer.add(panorama);
                }
                
                // Cambiar al panorama seleccionado
                viewer.setPanorama(panorama);
                
                // Actualizar clase activa en miniaturas
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            
            // Activar el primer panorama por defecto
            if (index === 0) {
                const defaultPanorama = loadPanoramaImage(panoramaPath);
                panoramaMap.set(panoramaPath, defaultPanorama);
                viewer.add(defaultPanorama);
                thumb.classList.add('active');
            }
        });
    }
    
    // Configurar botones de control
    function setupControlButtons(viewer) {
        // Botón de pantalla completa
        if (fullscreenBtn) {
            console.log("Configurando botón de pantalla completa");
            fullscreenBtn.addEventListener('click', function() {
                toggleFullscreen(panoramaContainer);
            });
        }
        
        // Botón de información
        if (infoBtn) {
            console.log("Configurando botón de información");
            infoBtn.addEventListener('click', function() {
                const infoOverlay = document.createElement('div');
                infoOverlay.className = 'panorama-info-overlay';
                infoOverlay.innerHTML = `
                    <div class="panorama-info-content">
                        <h3>Información del Panorama</h3>
                        <p>Explora esta vista 360° usando el ratón o las flechas del teclado.</p>
                        <p>Puedes hacer zoom con la rueda del ratón o los gestos de pinza en dispositivos táctiles.</p>
                        <button class="close-info-btn">Cerrar</button>
                    </div>
                `;
                panoramaContainer.appendChild(infoOverlay);
                
                // Botón para cerrar la información
                infoOverlay.querySelector('.close-info-btn').addEventListener('click', function() {
                    infoOverlay.remove();
                });
            });
        }
        
        // Botón de rotación
        if (rotateBtn) {
            console.log("Configurando botón de rotación");
            let autoRotating = true; // Comienza con rotación automática
            
            rotateBtn.addEventListener('click', function() {
                autoRotating = !autoRotating;
                viewer.OrbitControls.autoRotate = autoRotating;
                
                // Cambiar icono según estado
                rotateBtn.innerHTML = autoRotating ? 
                    '<i class="fas fa-sync-alt"></i>' : 
                    '<i class="fas fa-pause"></i>';
            });
        }
    }
    
    // Función auxiliar para alternar pantalla completa
    function toggleFullscreen(element) {
        if (!document.fullscreenElement) {
            // Entrar en pantalla completa
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { // Firefox
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { // Chrome, Safari y Opera
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { // IE/Edge
                element.msRequestFullscreen();
            }
            console.log("Entrando en modo pantalla completa");
        } else {
            // Salir de pantalla completa
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            console.log("Saliendo de modo pantalla completa");
        }
    }
    
    if (infoBtn) {
        console.log("Configurando botón de información");
        infoBtn.addEventListener('click', function() {
            console.log("Botón de información presionado");
            const infoOverlay = document.createElement('div');
            infoOverlay.className = 'panorama-info-overlay';
            infoOverlay.innerHTML = `
                <div class="panorama-info-content">
                    <h3>Acerca de esta vista</h3>
                    <p>Esta es una vista panorámica 360° de una de mis intervenciones urbanas. Puedes arrastrar para mirar alrededor o usar la rueda del ratón para hacer zoom.</p>
                    <button class="btn btn--outline close-info">Cerrar</button>
                </div>
            `;
            
            const panoramaWrapper = document.querySelector('.panorama-wrapper');
            if (panoramaWrapper) {
                panoramaWrapper.appendChild(infoOverlay);
                
                // Cerrar el overlay al hacer clic en el botón
                document.querySelector('.close-info').addEventListener('click', function() {
                    infoOverlay.remove();
                });
            } else {
                console.error("No se encontró el elemento .panorama-wrapper para mostrar la información");
            }
        });
    } else {
        console.log("Botón de información no encontrado en el DOM");
    }
    
    if (rotateBtn) {
        console.log("Configurando botón de rotación");
        rotateBtn.addEventListener('click', function() {
            console.log("Botón de rotación presionado");
            viewer.autoRotate = !viewer.autoRotate;
            viewer.autoRotateSpeed = viewer.autoRotate ? 0.3 : 0;
            console.log("Estado de rotación automática: " + (viewer.autoRotate ? "Activado" : "Desactivado"));
            
            // Cambiar el icono según el estado
            const icon = rotateBtn.querySelector('i');
            if (icon) {
                if (viewer.autoRotate) {
                    icon.className = 'fas fa-sync-alt';
                } else {
                    icon.className = 'fas fa-pause';
                }
            }
        });
    } else {
        console.log("Botón de rotación no encontrado en el DOM");
    }

    // Añadir efectos de parallax sutiles al desplazarse
    const experienceSection = document.querySelector('.virtual-experiences');
    if (experienceSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const sectionPosition = experienceSection.getBoundingClientRect().top + window.scrollY;
            const offset = scrollPosition - sectionPosition;
            
            if (offset > -500 && offset < 500) {
                const parallaxElements = experienceSection.querySelectorAll('.experience-card');
                parallaxElements.forEach(element => {
                    const speed = 0.05;
                    const yPos = -(offset * speed);
                    // Solo aplicamos parallax al contenedor general, no al visor
                    if (!element.querySelector('#panorama')) { 
                       element.style.transform = `translateY(${yPos}px)`;
                    }
                });
            }
        });
    }

    // Ajuste para responsividad de PANOLENS
    window.addEventListener('resize', function(){
        console.log("Evento resize detectado - Ajustando visor");
        if (viewer) {
            viewer.onWindowResize();
        }
    });
    
    // Asegurar que el visor se inicialice correctamente después de que todo esté cargado
    window.addEventListener('load', function() {
        console.log("Evento load completo - Verificando visor");
        if (viewer) {
            viewer.onWindowResize();
            console.log("Visor ajustado después de carga completa");
        }
    });
});