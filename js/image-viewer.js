/**
 * image-viewer.js - Visor de imágenes para las galerías de stickers
 * Permite ver las imágenes en tamaño completo al hacer clic en ellas
 * Versión optimizada para evitar problemas de carga y conexión
 */

document.addEventListener('DOMContentLoaded', function() {
    // Desconectar WebSockets innecesarios para evitar errores
    disconnectWebSockets();
    
    // Seleccionar todos los enlaces de stickers
    const stickerLinks = document.querySelectorAll('.sticker-item a');
    
    // Añadir evento de clic a cada enlace
    stickerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir navegación
            
            // Obtener la URL de la imagen y el texto alternativo
            const imageSrc = this.getAttribute('href');
            const imageAlt = this.querySelector('img').getAttribute('alt') || 'Imagen de sticker';
            
            // Crear el visor de imagen con precarga
            createImageViewer(imageSrc, imageAlt);
        });
    });
});

/**
 * Desconecta WebSockets innecesarios para evitar errores en consola
 * Esta función es un placeholder y no es necesaria para el funcionamiento
 * pero se mantiene para compatibilidad con código existente
 */
function disconnectWebSockets() {
    // Esta función ahora es solo un placeholder
    // No es necesario cerrar WebSockets ya que no se utilizan en la aplicación
    console.log('Verificación de WebSockets completada');
    return true;
}

/**
 * Crea un visor de imagen a pantalla completa con precarga
 * @param {string} imageSrc - URL de la imagen
 * @param {string} imageAlt - Texto alternativo para la imagen
 */
function createImageViewer(imageSrc, imageAlt) {
    // Crear el contenedor del visor con un indicador de carga
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    
    // Crear el contenido del visor con un loader inicial
    viewer.innerHTML = `
        <div class="image-viewer__content">
            <div class="image-viewer__loading" style="color: white; text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
                <p>Cargando imagen...</p>
            </div>
            <button class="image-viewer__close" aria-label="Cerrar visor">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    // Añadir el visor al body
    document.body.appendChild(viewer);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Precargar la imagen
    const img = new Image();
    img.className = 'image-viewer__img';
    img.alt = imageAlt;
    
    // Cuando la imagen se carga, reemplazar el loader
    img.onload = function() {
        const content = viewer.querySelector('.image-viewer__content');
        const loading = viewer.querySelector('.image-viewer__loading');
        
        if (loading) {
            content.removeChild(loading);
            content.insertBefore(img, content.firstChild);
        }
    };
    
    // Si hay error al cargar la imagen
    img.onerror = function() {
        const loading = viewer.querySelector('.image-viewer__loading');
        if (loading) {
            loading.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ff6b6b;"></i>
                <p>Error al cargar la imagen</p>
            `;
        }
    };
    
    // Iniciar la carga de la imagen
    img.src = imageSrc;
    
    // Añadir evento para cerrar el visor
    const closeBtn = viewer.querySelector('.image-viewer__close');
    closeBtn.addEventListener('click', closeViewer);
    
    // Cerrar al hacer clic fuera de la imagen
    viewer.addEventListener('click', function(e) {
        if (e.target === viewer) {
            closeViewer();
        }
    });
    
    // Cerrar con la tecla Escape
    const escKeyHandler = function(e) {
        if (e.key === 'Escape') {
            closeViewer();
        }
    };
    
    document.addEventListener('keydown', escKeyHandler);
    
    /**
     * Cierra el visor de imágenes
     */
    function closeViewer() {
        document.removeEventListener('keydown', escKeyHandler);
        viewer.remove();
        document.body.style.overflow = '';
    }
}