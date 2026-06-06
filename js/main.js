document.addEventListener('DOMContentLoaded', () => {

    // ==================== CUSTOM CURSOR ====================
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        document.querySelectorAll('a, button, .project-card, .viewer-btn, .skill-tag, .social-link').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => { ring.classList.add('hidden'); dot.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { ring.classList.remove('hidden'); dot.style.opacity = '1'; });
    }

    // ==================== PROJECT DATA ====================
    const projects = [
        {
            title: 'Arte Urbano',
            desc: 'Dirección de arte y diseño de murales de gran formato con técnicas digitales y modelado 3D escultórico.',
            tags: ['Arte Urbano', 'Muralismo', 'Escultura Digital'],
            software: ['Blender', 'Photoshop', 'Illustrator'],
            color: '#E85D04',
            img: 'assets/images/Arte urbano/kevin 1.PNG',
            secondaryImg: 'assets/images/Arte urbano/Kevin 2.PNG'
        },
        {
            title: 'Iconografia Vectoral',
            desc: 'Creación de sistemas de iconografía vectorial para plataformas digitales, con enfoque en consistencia visual y escalabilidad.',
            tags: ['Vectorial', 'Iconografía', 'Sistemas de Diseño'],
            software: ['Illustrator', 'Figma', 'Photoshop'],
            color: '#9D0208',
            img: 'assets/images/Iconografía/iconos.jpeg'
        },
        {
            title: 'Motion Graphics',
            desc: 'Animación y gráficos en movimiento para campañas digitales y contenido audiovisual.',
            tags: ['Motion Graphics', 'Animación', 'After Effects'],
            software: ['After Effects', 'Premiere', 'Illustrator'],
            color: '#9D0208',
            img: 'assets/images/Motion.gif',
            type: 'gif'
        }
    ];

    const projectsGrid = document.getElementById('projectsGrid');

    function renderProjectCards() {
        projectsGrid.innerHTML = '';
        projects.forEach((p, i) => {
            const card = document.createElement('article');
            card.className = 'project-card reveal-up';
            card.style.transitionDelay = `${i * 0.1}s`;
            card.tabIndex = 0;
            card.role = 'button';
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(p);
                }
            });

            card.innerHTML = `
                <div class="project-card-img${p.type === 'gif' ? ' project-card-img--gif' : ''}">
                    ${p.img ? `<img src="${p.img}" alt="${p.title}" ${p.type === 'gif' ? '' : 'loading="lazy"'}>` : `<span class="project-card-index">${String(i + 1).padStart(2, '0')}</span>`}
                </div>
                <div class="project-card-body">
                    <h3 class="project-card-title">${p.title}</h3>
                    <p class="project-card-desc">${p.desc}</p>
                    <div class="project-card-tags">
                        ${p.tags.map(t => `<span class="project-card-tag">${t}</span>`).join('')}
                    </div>
                    <div class="project-card-software">
                        ${p.software.map(s => `<span class="project-card-software-badge">${s}</span>`).join('')}
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openModal(p));
            projectsGrid.appendChild(card);
        });
    }

    renderProjectCards();

    // ==================== MODAL ====================
    const modal = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalClose = document.getElementById('modalClose');
    const pageWrapper = document.getElementById('page');

    function openModal(project) {
        modalTitle.textContent = project.title;
        modalDesc.textContent = project.desc;
        modalTags.innerHTML = project.tags.map(t => `<span class="project-card-tag">${t}</span>`).join('');
        if (project.software) {
            const swRow = document.createElement('div');
            swRow.className = 'modal-software';
            swRow.innerHTML = project.software.map(s => `<span class="project-card-software-badge">${s}</span>`).join('');
            modalTags.after(swRow);
        }

        if (project.img) {
            modalImg.style.background = 'none';
            if (project.type === 'gif') {
                modalImg.innerHTML = `
                    <div class="modal-gif-player">
                        <img src="${project.img}" alt="${project.title}">
                    </div>`;
            } else if (project.secondaryImg) {
                modalImg.innerHTML = `
                    <div class="modal-img-grid modal-img-grid--dual">
                        <div class="modal-img-primary"><img src="${project.img}" alt="${project.title}" width="800" height="500"></div>
                        <div class="modal-img-secondary"><img src="${project.secondaryImg}" alt="${project.title}" width="800" height="140"></div>
                    </div>`;
            } else {
                modalImg.innerHTML = `<img src="${project.img}" alt="${project.title}" width="800" height="600" style="width:100%;max-height:75vh;object-fit:contain;background:var(--bg-card);padding:20px;">`;
            }
        } else {
            modalImg.style.background = `linear-gradient(135deg, ${project.color}, ${project.color}66)`;
            modalImg.innerHTML = '';
            const letter = document.createElement('span');
            letter.style.cssText = 'display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:4rem; font-weight:600; color:rgba(255,255,255,0.2);';
            letter.textContent = project.title.charAt(0);
            modalImg.appendChild(letter);
        }
        modalImg.style.display = 'flex';

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (pageWrapper) pageWrapper.setAttribute('aria-hidden', 'true');
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (pageWrapper) pageWrapper.removeAttribute('aria-hidden');
        document.querySelector('.project-card')?.focus();
    }

    function trapFocus(e) {
        if (!modal.classList.contains('open')) return;
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        trapFocus(e);
    });

    // ==================== NAVBAR ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section[id]');
    const navLinkItems = document.querySelectorAll('.nav-link');

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < bottom) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    document.querySelectorAll('.social-link[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => e.preventDefault());
    });

    // ==================== SCROLL REVEAL ====================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-blur');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.style.transitionDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // ==================== VIEWER 360 INIT ====================
    try {
        const frameFiles = [];
        for (let i = 1; i <= 36; i++) {
            frameFiles.push(`assets/images/360/1/100${String(i).padStart(2, '0')}.png`);
        }
        const viewer = new Viewer360('viewerContainer', {
            totalFrames: 36,
            framesPerRow: 6,
            frameFiles: frameFiles
        });
    } catch (err) {
        console.warn('Viewer360 no disponible:', err.message);
    }

    // ==================== CAROUSEL INIT ====================
    try {
        const carouselSlides = [
            {
                img: 'assets/images/Carrusel/1.jpeg',
                icon: '🎨',
                title: 'Identidad de Marca',
                desc: 'Desarrollo completo de branding para startups y empresas consolidadas.',
                color: '#E85D04'
            },
            {
                img: 'assets/images/Carrusel/2.jpeg',
                icon: '📖',
                title: 'Diseño Editorial',
                desc: 'Maquetación de revistas, libros y catálogos con jerarquía visual cuidada.',
                color: '#9D0208'
            },
            {
                img: 'assets/images/Carrusel/3.jpeg',
                icon: '📱',
                title: 'UX/UI',
                desc: 'Interfaces funcionales y atractivas centradas en la experiencia de usuario.',
                color: '#0C0F38'
            },
            {
                img: 'assets/images/Carrusel/4.jpeg',
                icon: '🎲',
                title: 'Modelado 3D',
                desc: 'Renderizado de producto y visualización arquitectónica con Blender.',
                color: '#FFBA08'
            },
            {
                img: 'assets/images/Carrusel/5.jpeg',
                icon: '🧱',
                title: 'Arte Urbano',
                desc: 'Murales y escultura digital que transforman el espacio público.',
                color: '#E85D04'
            },
            {
                img: 'assets/images/Carrusel/6.jpeg',
                icon: '✏️',
                title: 'Ilustración Vectorial',
                desc: 'Sistemas de iconografía y gráficos vectoriales para plataformas digitales.',
                color: '#9D0208'
            }
        ];

        new Carousel('carouselContainer', { slides: carouselSlides });
    } catch (err) {
        console.warn('Carrusel no disponible:', err.message);
    }
});
