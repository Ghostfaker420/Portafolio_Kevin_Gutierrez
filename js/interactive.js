/**
 * Script interactivo para el portafolio de diseño
 * Incluye animaciones, efectos de parallax y funcionalidades mejoradas
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollAnimations();
    initParallaxEffects();
    initProjectsGallery();
    initTourViewer();
    initContactForm();
    initPageLoader();
    initUrbanEffects(); // Nuevos efectos urbanos
});

// Efectos urbanos adicionales
function initUrbanEffects() {
    // Efecto de spray para textos con clase spray-in
    const sprayElements = document.querySelectorAll('.spray-in');
    sprayElements.forEach(element => {
        // Aplicar efecto al entrar en viewport
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    setTimeout(() => {
                        entry.target.style.animation = 'spray 0.8s forwards';
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(element);
    });
    
    // Añadir textura urbana a elementos seleccionados
    document.querySelectorAll('.urban-texture').forEach(element => {
        element.classList.add('urban-texture-active');
    });
}

// Loader de página
function initPageLoader() {
    // Crear el loader si no existe
    if (!document.querySelector('.page-loader')) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Cargando experiencia interactiva...</div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    // Ocultar el loader cuando la página esté cargada
    window.addEventListener('load', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 500);
        }
    });
}

// Navegación y header interactivo
function initNavigation() {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    let lastScrollTop = 0;

    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Añadir clase 'scrolled' cuando se hace scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Ocultar/mostrar header al hacer scroll hacia arriba/abajo
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }
        
        lastScrollTop = scrollTop;
    });

    // Menú móvil
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Cerrar menú móvil al hacer clic en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn.querySelector('i.fa-times')) {
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    // Scroll suave a las secciones
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Resaltar enlace activo en la navegación
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Animaciones al hacer scroll
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    // Si no hay elementos con la clase 'reveal', añadirla a elementos clave
    if (revealElements.length === 0) {
        const elementsToAnimate = [
            ...document.querySelectorAll('section h2'),
            ...document.querySelectorAll('.about-content > div'),
            ...document.querySelectorAll('.project-card'),
            ...document.querySelectorAll('.tour-item'),
            ...document.querySelectorAll('.contact-form')
        ];
        
        elementsToAnimate.forEach(el => el.classList.add('reveal'));
    }
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        document.querySelectorAll('.reveal').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    // Ejecutar una vez al cargar para elementos visibles inicialmente
    revealOnScroll();
}

// Efectos de parallax simplificados para mayor estabilidad
function initParallaxEffects() {
    // Eliminar efectos de parallax que causan inestabilidad
    const parallaxHero = document.querySelector('.parallax-hero');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    // Ocultar las capas de parallax que causan inestabilidad
    if (parallaxLayers.length > 0) {
        parallaxLayers.forEach(layer => {
            layer.style.display = 'none';
        });
    }
    
    // Eliminar efectos de parallax con movimiento del mouse que causan inestabilidad
    const mouseParallaxElements = document.querySelectorAll('.mouse-parallax');
    if (mouseParallaxElements.length > 0) {
        mouseParallaxElements.forEach(element => {
            element.style.transform = 'none';
            element.style.transition = 'none';
        });
    }
    
    // Eliminar efectos de parallax al hacer scroll que causan inestabilidad
    document.querySelectorAll('.parallax').forEach(element => {
        element.style.transform = 'none';
    });
    
    // Inicializar efectos de texto dividido
    const splitTextElements = document.querySelectorAll('.split-text-animation');
    splitTextElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i] === ' ' ? ' ' : text[i];
            span.style.transitionDelay = `${i * 0.03}s`;
            element.appendChild(span);
        }
        
        setTimeout(() => {
            element.classList.add('animate');
        }, 300);
    });
    
    // Inicializar cursor personalizado
    initCustomCursor();
}

// Cursor personalizado
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Cambiar estado al pasar sobre elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .hover-lift, .project-card, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Galería de proyectos mejorada
function initProjectsGallery() {
    // Datos de proyectos - solo dejamos el de stickers
    const projects = [
        {
            title: 'Stickers',
            description: 'Colección de stickers de arte urbano con diseños originales y estilo graffiti.',
            image: 'images/Stickers Tanda 2/portada.jpg',
            category: 'arte-urbano',
            link: '#stickers-gallery'
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    
    // Si no hay contenedor de proyectos, salir de la función
    if (!projectsGrid) return;
    
    // Limpiar el contenedor
    projectsGrid.innerHTML = '';
    
    // Ya no necesitamos filtros porque solo hay un proyecto
    loadProjects(projects);
    
    // Crear el modal para la galería de stickers
    createStickersGallery();
}

function loadProjects(projectsToLoad) {
    projectsGrid.innerHTML = '';
    
    projectsToLoad.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card reveal';
        projectCard.setAttribute('data-category', project.category);
        
        projectCard.innerHTML = `
            <div class="project-img">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <div class="project-overlay-content">
                        <a href="${project.link}" class="project-link">Ver detalles</a>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
    
    // Activar animaciones para los nuevos elementos
    setTimeout(() => {
        document.querySelectorAll('.project-card.reveal').forEach(card => {
            card.classList.add('active');
        });
    }, 100);
}

// Nueva función para crear la galería de stickers
function createStickersGallery() {
    // Crear el modal si no existe
    if (!document.getElementById('stickers-gallery')) {
        const modal = document.createElement('div');
        modal.id = 'stickers-gallery';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Colección de Stickers</h2>
                <div class="stickers-container"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Evento para cerrar el modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Evento para abrir el modal al hacer clic en "Ver colección"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-link') && e.target.getAttribute('href') === '#stickers-gallery') {
            e.preventDefault();
            const modal = document.getElementById('stickers-gallery');
            modal.style.display = 'block';
            loadStickersImages();
        }
    });
}

// Función para cargar las imágenes de stickers
function loadStickersImages() {
    const stickersContainer = document.querySelector('.stickers-container');
    stickersContainer.innerHTML = '';
    
    // Lista de imágenes de stickers (ajusta los nombres según tus archivos)
    const stickerImages = [
        'sticker1.jpg',
        'sticker2.jpg',
        'sticker3.jpg',
        'sticker4.jpg',
        'sticker5.jpg',
        'sticker6.jpg',
        'sticker7.jpg',
        'sticker8.jpg'
        // Puedes agregar más imágenes según sea necesario
    ];
    
    stickerImages.forEach(image => {
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sticker-item';
        
        stickerItem.innerHTML = `
            <img src="images/Stickers Tanda 2/${image}" alt="Sticker">
        `;
        
        // Evento para ver la imagen en tamaño completo
        stickerItem.addEventListener('click', () => {
            openFullImage(`images/Stickers Tanda 2/${image}`);
        });
        
        stickersContainer.appendChild(stickerItem);
    });
}

// Función para abrir imagen en tamaño completo
function openFullImage(src) {
    const fullImageView = document.createElement('div');
    fullImageView.className = 'full-image-view';
    
    fullImageView.innerHTML = `
        <div class="full-image-container">
            <span class="close-full-image">&times;</span>
            <img src="${src}" alt="Sticker en tamaño completo">
        </div>
    `;
    
    document.body.appendChild(fullImageView);
    
    // Evento para cerrar la vista completa
    fullImageView.querySelector('.close-full-image').addEventListener('click', () => {
        fullImageView.remove();
    });
    
    // Cerrar al hacer clic fuera de la imagen
    fullImageView.addEventListener('click', (e) => {
        if (e.target === fullImageView) {
            fullImageView.remove();
        }
    });
}

// Visor de tours 360° mejorado
function initTourViewer() {
    // Datos de ejemplo para tours 360° (puedes reemplazarlos con tus propios datos)
    const tours = [
        {
            title: 'Estudio de Diseño',
            description: 'Recorrido virtual por un moderno estudio de diseño interactivo',
            panorama: 'images/360_1.jpg',
            hotspots: [
                { pitch: 0, yaw: 0, text: 'Área de trabajo principal' },
                { pitch: 10, yaw: 90, text: 'Estación de diseño 3D' }
            ]
        },
        {
            title: 'Galería de Proyectos',
            description: 'Exposición virtual de los mejores proyectos de diseño',
            panorama: 'images/360_1.jpg', // Usar la misma imagen como ejemplo
            hotspots: [
                { pitch: -10, yaw: 180, text: 'Sección de diseño web' },
                { pitch: 5, yaw: 270, text: 'Proyectos de realidad virtual' }
            ]
        },
        {
            title: 'Espacio Colaborativo',
            description: 'Área de reuniones y trabajo en equipo para proyectos creativos',
            panorama: 'images/360_1.jpg', // Usar la misma imagen como ejemplo
            hotspots: [
                { pitch: 0, yaw: 45, text: 'Mesa de reuniones' },
                { pitch: -5, yaw: 225, text: 'Pizarra de ideas' }
            ]
        }
    ];

    const toursList = document.querySelector('.tours-list');
    const panoContainer = document.getElementById('pano');
    
    // Si no hay contenedor de tours o visor panorámico, salir de la función
    if (!toursList || !panoContainer) return;
    
    // Limpiar el contenedor de la lista de tours
    toursList.innerHTML = '';
    
    // Cargar la lista de tours
    tours.forEach((tour, index) => {
        const tourItem = document.createElement('div');
        tourItem.className = 'tour-item';
        if (index === 0) tourItem.classList.add('active');
        
        tourItem.innerHTML = `
            <h3>${tour.title}</h3>
            <p>${tour.description}</p>
            <button class="tour-button" data-index="${index}">Ver Tour</button>
        `;
        
        toursList.appendChild(tourItem);
    });
    
    // Inicializar el visor 360°
    let viewer = null;
    let panoramaViewer = null;
    
    function initViewer() {
        try {
            // Comprobar si la biblioteca está cargada
            if (typeof PANOLENS === 'undefined') {
                console.error("Error: PANOLENS no está definido. Verifica que la biblioteca se haya cargado correctamente.");
                panoContainer.innerHTML = 
                    '<div style="color: white; text-align: center; padding: 20px; background-color: rgba(0,0,0,0.7);">' +
                    'Error: No se pudo cargar la biblioteca PANOLENS. Por favor, recarga la página o verifica tu conexión a Internet.' +
                    '</div>';
                return;
            }
            
            // Crear el visor
            panoramaViewer = new PANOLENS.Viewer({
                container: panoContainer,
                autoRotate: true,
                autoRotateSpeed: 0.3,
                controlBar: true,
                controlButtons: ['fullscreen', 'setting', 'video'],
                cameraFov: 90
            });
            
            // Cargar el primer tour por defecto
            loadTour(0);
            
        } catch (error) {
            console.error("Error al inicializar el visor:", error);
            panoContainer.innerHTML = 
                '<div style="color: white; text-align: center; padding: 20px; background-color: rgba(0,0,0,0.7);">' +
                'Error al inicializar el visor 360°. Error: ' + error.message + 
                '</div>';
        }
    }
    
    // Función para cargar un tour específico
    function loadTour(index) {
        try {
            const tour = tours[index];
            
            // Mostrar indicador de carga
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            }
            
            // Actualizar elemento activo en la lista
            document.querySelectorAll('.tour-item').forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Limpiar el visor actual si existe
            if (viewer) {
                panoramaViewer.remove(viewer);
            }
            
            // Crear el nuevo panorama
            viewer = new PANOLENS.ImagePanorama(tour.panorama);
            
            // Añadir hotspots
            tour.hotspots.forEach(hotspot => {
                const tooltipDiv = document.createElement('div');
                tooltipDiv.className = 'hotspot-tooltip';
                tooltipDiv.textContent = hotspot.text;
                
                const position = new THREE.Vector3();
                position.setFromSphericalCoords(
                    10, // Radio
                    THREE.MathUtils.degToRad(90 - hotspot.pitch), // Phi (latitud)
                    THREE.MathUtils.degToRad(hotspot.yaw) // Theta (longitud)
                );
                
                viewer.addHotspot(position, {
                    tooltip: tooltipDiv
                });
            });
            
            // Manejar eventos
            viewer.addEventListener('load', function() {
                console.log("Panorama cargado correctamente");
                // Ocultar el indicador de carga
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
            });
            
            viewer.addEventListener('error', function(e) {
                console.error('Error al cargar la imagen panorámica:', e);
                panoContainer.innerHTML = 
                    '<div style="color: white; text-align: center; padding: 20px; background-color: rgba(0,0,0,0.7);">' +
                    'Error al cargar la imagen panorámica. Verifica que el archivo "' + tour.panorama + '" existe y es accesible.' +
                    '</div>';
            });
            
            // Añadir el panorama al visor
            panoramaViewer.add(viewer);
            
        } catch (error) {
            console.error("Error al cargar el tour:", error);
        }
    }
    
    // Inicializar el visor
    initViewer();
    
    // Añadir eventos a los botones de tour
    document.querySelectorAll('.tour-button').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            loadTour(index);
        });
    });
}

// Formulario de contacto mejorado
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Mejorar la estructura del formulario
    if (contactForm.children.length <= 4) { // Si tiene la estructura básica
        const formContent = contactForm.innerHTML;
        contactForm.innerHTML = '';
        
        // Crear grupos de formulario con etiquetas
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        nameGroup.innerHTML = `
            <label for="name">Nombre</label>
            <input type="text" id="name" name="name" placeholder="Tu nombre" required>
        `;
        
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        emailGroup.innerHTML = `
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Tu email" required>
        `;
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'form-group';
        messageGroup.innerHTML = `
            <label for="message">Mensaje</label>
            <textarea id="message" name="message" placeholder="Tu mensaje" required></textarea>
        `;
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Enviar Mensaje';
        
        contactForm.appendChild(nameGroup);
        contactForm.appendChild(emailGroup);
        contactForm.appendChild(messageGroup);
        contactForm.appendChild(submitButton);
    }
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aquí iría la lógica para enviar el formulario a un servidor
        // Por ahora, solo mostraremos una notificación de éxito
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Ocultar notificación después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
        
        // Cerrar notificación al hacer clic en el botón de cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        });
        
        // Resetear formulario
        contactForm.reset();
    });