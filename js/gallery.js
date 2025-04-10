/**
 * Gallery.js - Manejo de galerías de proyectos y stickers
 * Este archivo complementa la funcionalidad de interactive.js
 * para la gestión de galerías de proyectos
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la galería de proyectos si existe el contenedor
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        initProjectsGallery();
    }
});

/**
 * Inicializa la galería de proyectos con datos dinámicos
 */
function initProjectsGallery() {
    // Obtener el contenedor de proyectos
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Limpiar el contenedor
    projectsGrid.innerHTML = '';
    
    // Cargar proyectos desde main.js (asegurarse de que esté definido)
    if (typeof projects !== 'undefined') {
        // Crear elementos de proyecto
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item cascade-item hover-lift';
            
            projectElement.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-info">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <a href="${project.link}" class="project-link">Ver Detalles</a>
                        </div>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectElement);
        });
    } else {
        console.error('Error: Variable projects no definida. Asegúrate de que main.js se carga antes que gallery.js');
        // Mostrar mensaje de error en la interfaz
        projectsGrid.innerHTML = `
            <div class="error-message">
                <p>No se pudieron cargar los proyectos. Por favor, recarga la página.</p>
            </div>
        `;
    }
    
    // Inicializar efectos de animación para los proyectos
    initProjectAnimations();
}

/**
 * Inicializa animaciones para los elementos de proyecto
 */
function initProjectAnimations() {
    // Usar Intersection Observer para animar los proyectos al entrar en viewport
    const projectItems = document.querySelectorAll('.project-item');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    projectItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Maneja la visualización de imágenes en tamaño completo
 */
function openFullImage(imageSrc, altText) {
    // Crear el contenedor de imagen completa
    const fullImageView = document.createElement('div');
    fullImageView.className = 'full-image-view';
    
    fullImageView.innerHTML = `
        <div class="full-image-container">
            <img src="${imageSrc}" alt="${altText || 'Imagen de proyecto'}">
            <button class="close-full-image">&times;</button>
        </div>
    `;
    
    // Añadir al body
    document.body.appendChild(fullImageView);
    document.body.style.overflow = 'hidden'; // Prevenir scroll
    
    // Añadir evento para cerrar
    fullImageView.addEventListener('click', (e) => {
        if (e.target === fullImageView || e.target.classList.contains('close-full-image')) {
            closeFullImage(fullImageView);
        }
    });
    
    // Añadir evento de teclado para cerrar con ESC
    document.addEventListener('keydown', function escKeyHandler(e) {
        if (e.key === 'Escape') {
            closeFullImage(fullImageView);
            document.removeEventListener('keydown', escKeyHandler);
        }
    });
}

/**
 * Cierra la vista de imagen completa
 */
function closeFullImage(element) {
    element.classList.add('closing');
    setTimeout(() => {
        document.body.removeChild(element);
        document.body.style.overflow = ''; // Restaurar scroll
    }, 300);
}