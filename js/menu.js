/**
 * menu.js - Gestión del menú de navegación responsivo
 * Controla la funcionalidad del menú móvil y mejora la accesibilidad
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navbar__nav');
    
    // Verificar que los elementos existan antes de añadir eventos
    if (!menuBtn || !navMenu) {
        console.error('Elementos del menú no encontrados');
        return;
    }

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Mejorar accesibilidad al enfocar/desenfocar elementos
        if (!isExpanded) {
            // Prevenir scroll cuando el menú está abierto
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    // Añadir evento al botón del menú
    menuBtn.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});