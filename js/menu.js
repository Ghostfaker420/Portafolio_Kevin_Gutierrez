// Manejo del menú móvil
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navbar__nav');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', 
            menuBtn.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
});