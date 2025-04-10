/**
 * Performance.js - Optimizaciones de rendimiento y accesibilidad
 * Implementa buenas prácticas para mejorar el rendimiento y la accesibilidad del sitio
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las optimizaciones
    initLazyLoading();
    initAccessibility();
    optimizeEventListeners();
    optimizeAnimations();
    fixMobileMenu();
    optimizeFormValidation();
    handlePageLoader();
});

/**
 * Maneja la pantalla de carga inicial
 */
function handlePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    // Lista de recursos críticos a cargar
    const criticalResources = [
        ...Array.from(document.getElementsByTagName('img')),
        ...Array.from(document.getElementsByTagName('script')),
        ...Array.from(document.styleSheets)
    ];

    let loadedResources = 0;
    const totalResources = criticalResources.length;

    // Función para ocultar el loader
    const hideLoader = () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    };

    // Función para actualizar el progreso
    const updateProgress = () => {
        loadedResources++;
        if (loadedResources >= totalResources) {
            hideLoader();
        }
    };

    // Monitorear la carga de recursos
    criticalResources.forEach(resource => {
        if (resource instanceof HTMLImageElement) {
            if (resource.complete) {
                updateProgress();
            } else {
                resource.addEventListener('load', updateProgress);
                resource.addEventListener('error', updateProgress);
            }
        } else {
            updateProgress();
        }
    });

    // Fallback por si algo falla
    window.addEventListener('load', () => {
        setTimeout(hideLoader, 2000);
    });
}

/**
 * Implementa carga diferida para imágenes y recursos pesados
 */
function initLazyLoading() {
    // Comprobar si el navegador soporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        // Seleccionar todas las imágenes con atributo data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Configurar el observador
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Reemplazar src con data-src
                    img.src = img.dataset.src;
                    // Opcionalmente, hacer lo mismo con srcset
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    // Quitar la clase de placeholder si existe
                    img.classList.remove('lazy-placeholder');
                    // Dejar de observar la imagen una vez cargada
                    imageObserver.unobserve(img);
                }
            });
        }, {
            // Cargar imágenes cuando estén a 200px de entrar en viewport
            rootMargin: '200px 0px',
            threshold: 0.01
        });
        
        // Observar cada imagen
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        // Cargar todas las imágenes inmediatamente
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            img.classList.remove('lazy-placeholder');
        });
    }
}

/**
 * Mejora la accesibilidad del sitio
 */
function initAccessibility() {
    // Añadir atributos ARIA faltantes
    document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'nav-links');
    });
    
    // Mejorar navegación por teclado
    document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(el => {
        el.addEventListener('keydown', (e) => {
            // Activar elementos con Enter o Space
            if (e.key === 'Enter' || e.key === ' ') {
                if (el.tagName.toLowerCase() !== 'a' && el.tagName.toLowerCase() !== 'button') {
                    e.preventDefault();
                    el.click();
                }
            }
        });
    });
    
    // Añadir skip link para accesibilidad
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Asegurar que el main tenga un id para el skip link
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main';
    }
}

/**
 * Optimiza los event listeners para mejor rendimiento
 */
function optimizeEventListeners() {
    // Usar delegación de eventos para el menú móvil
    const header = document.querySelector('header');
    if (header) {
        header.addEventListener('click', (e) => {
            // Delegar evento de click del botón de menú
            if (e.target.closest('.mobile-menu-btn')) {
                const navLinks = document.querySelector('.nav-links');
                const menuBtn = document.querySelector('.mobile-menu-btn');
                
                if (navLinks && menuBtn) {
                    navLinks.classList.toggle('active');
                    const isExpanded = navLinks.classList.contains('active');
                    menuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                    
                    // Cambiar ícono si es necesario
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        if (isExpanded) {
                            icon.classList.remove('fa-bars');
                            icon.classList.add('fa-times');
                        } else {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
            
            // Delegar evento de click para enlaces de navegación en móvil
            if (e.target.closest('.nav-links a')) {
                const navLinks = document.querySelector('.nav-links');
                const menuBtn = document.querySelector('.mobile-menu-btn');
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuBtn) {
                        menuBtn.setAttribute('aria-expanded', 'false');
                        const icon = menuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    }
    
    // Optimizar eventos de scroll con throttling
    let lastScrollTime = 0;
    const scrollThreshold = 100; // ms
    
    function throttledScrollHandler() {
        const scrollElements = document.querySelectorAll('.reveal');
        const scrollPosition = window.scrollY + window.innerHeight * 0.8;
        
        scrollElements.forEach(el => {
            if (el.offsetTop < scrollPosition) {
                el.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > scrollThreshold) {
            lastScrollTime = now;
            window.requestAnimationFrame(throttledScrollHandler);
        }
    });
}

/**
 * Optimiza las animaciones para mejor rendimiento
 */
function optimizeAnimations() {
    // Comprobar si el usuario prefiere reducir el movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Desactivar todas las animaciones si el usuario lo prefiere
        document.documentElement.classList.add('reduce-motion');
    } else {
        // Usar IntersectionObserver para las animaciones de entrada
        const animatedElements = document.querySelectorAll('.reveal, .cascade-container');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Si es un contenedor en cascada, activar la animación
                    if (entry.target.classList.contains('cascade-container')) {
                        entry.target.classList.add('animate');
                    }
                    // Dejar de observar una vez activada
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }
}

/**
 * Corrige problemas comunes del menú móvil
 */
function fixMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.mobile-menu-btn')) {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Cerrar menú con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                menuBtn.focus(); // Devolver el foco al botón
            }
        });
    }
}

/**
 * Optimiza la validación de formularios
 */
function optimizeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Prevenir envío de formulario y mostrar validación personalizada
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar campos
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Validar nombre
            if (!name.value.trim()) {
                showError(name, 'Por favor, introduce tu nombre');
                isValid = false;
            } else {
                clearError(name);
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError(email, 'Por favor, introduce un email válido');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Validar mensaje
            if (!message.value.trim()) {
                showError(message, 'Por favor, introduce tu mensaje');
                isValid = false;
            } else {
                clearError(message);
            }
            
            // Si todo es válido, mostrar mensaje de éxito
            if (isValid) {
                // Aquí iría el código para enviar el formulario
                // Por ahora, solo mostramos un mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Mensaje enviado correctamente. ¡Gracias por contactar!';
                
                // Insertar mensaje después del formulario
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Resetear formulario
                contactForm.reset();
                
                // Eliminar mensaje después de 5 segundos
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
}

/**
 * Muestra un mensaje de error para un campo de formulario
 */
function showError(input, message) {
    // Eliminar mensaje de error existente
    clearError(input);
    
    // Crear nuevo mensaje de error
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    // Añadir clase de error al input
    input.classList.add('error');
    
    // Insertar mensaje después del input
    input.parentNode.appendChild(errorMessage);
}

/**
 * Elimina el mensaje de error de un campo de formulario
 */
function clearError(input) {
    // Eliminar clase de error
    input.classList.remove('error');
    
    // Eliminar mensaje de error si existe
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}