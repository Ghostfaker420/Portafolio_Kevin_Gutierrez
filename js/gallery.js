// Datos de proyectos - Colección de stickers
const stickersCollection = [
    {
        id: 1,
        title: "STICKERS TANDA 1",
        description: "Colección de stickers urbanos con diseños originales",
        mainImage: "images/Stickers Tanda 1/IMG_1724.PNG",
        images: [
            "images/Stickers Tanda 1/IMG_1724.PNG",
            "images/Stickers Tanda 1/IMG_1726.PNG",
            "images/Stickers Tanda 1/IMG_1727.PNG"
        ],
        category: "Urbano",
        artist: "Diseñador Urbano",
        year: "2024",
        tags: ["urbano", "callejero", "original"]
    },
    {
        id: 2,
        title: "STICKERS TANDA 2",
        description: "Segunda colección de stickers con estilo callejero",
        mainImage: "images/Sticker Tanda 2/IMG_1787.PNG",
        images: [
            "images/Sticker Tanda 2/IMG_1787.PNG",
            "images/Sticker Tanda 2/IMG_1788.PNG",
            "images/Sticker Tanda 2/IMG_1789.PNG"
        ],
        category: "Urbano",
        artist: "Diseñador Urbano",
        year: "2024",
        tags: ["callejero", "moderno"]
    }
];

// Inicialización de la galería
document.addEventListener('DOMContentLoaded', () => {
    loadStickers();
});

// Función para cargar stickers en la página
function loadStickers() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Limpiar el contenedor antes de agregar nuevos stickers
    projectsGrid.innerHTML = '';
    
    // Agregar cada sticker al grid
    stickersCollection.forEach(sticker => {
        const stickerElement = document.createElement('article');
        stickerElement.className = 'sticker-item cascade-item';
        stickerElement.setAttribute('role', 'listitem');
        stickerElement.setAttribute('aria-label', `Sticker: ${sticker.title}`);
        
        stickerElement.innerHTML = `
            <div class="sticker-image hover-lift">
                <img src="${sticker.mainImage}" alt="${sticker.title}" loading="lazy">
                <div class="sticker-overlay">
                    <div class="sticker-info">
                        <h3>${sticker.title}</h3>
                        <p class="sticker-description">${sticker.description}</p>
                        <p class="sticker-meta">${sticker.artist} | ${sticker.year}</p>
                        <div class="sticker-tags">
                            ${sticker.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="sticker-actions">
                <button class="btn-primary ver-mas-btn" onclick="openStickerDetail(${sticker.id})">Ver más</button>
            </div>
        `;
        
        projectsGrid.appendChild(stickerElement);
    });

    // Inicializar animaciones
    if (window.ScrollReveal) {
        ScrollReveal().reveal('.sticker-item', {
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            interval: 100
        });
    }
}

// Función para abrir la vista detallada de un sticker
function openStickerDetail(stickerId) {
    const sticker = stickersCollection.find(s => s.id === stickerId);
    if (!sticker) return;

    // Crear el contenedor modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'sticker-modal';
    modalContainer.setAttribute('role', 'dialog');
    modalContainer.setAttribute('aria-label', `Detalles de ${sticker.title}`);

    // Contenido del modal
    modalContainer.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" aria-label="Cerrar modal">&times;</button>
            <h2>${sticker.title}</h2>
            <p class="sticker-description">${sticker.description}</p>
            <div class="sticker-gallery">
                ${sticker.images.map(img => `
                    <div class="gallery-item">
                        <img src="${img}" alt="${sticker.title}" loading="lazy">
                    </div>
                `).join('')}
            </div>
            <div class="sticker-details">
                <p><strong>Artista:</strong> ${sticker.artist}</p>
                <p><strong>Año:</strong> ${sticker.year}</p>
                <p><strong>Categoría:</strong> ${sticker.category}</p>
                <div class="sticker-tags">
                    ${sticker.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    // Agregar el modal al documento
    document.body.appendChild(modalContainer);

    // Agregar evento para cerrar el modal
    const closeButton = modalContainer.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });

    // Cerrar modal al hacer clic fuera del contenido
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.remove();
        }
    });
}