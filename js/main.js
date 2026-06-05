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
            title: 'Identidad de Marca',
            desc: 'Desarrollo completo de branding para una startup tecnológica, incluyendo logotipo, paleta cromática y aplicaciones.',
            tags: ['Branding', 'Illustrator', 'Figma'],
            color: '#E85D04',
            img: null
        },
        {
            title: 'Diseño Editorial',
            desc: 'Maquetación y diseño de una revista cultural con enfoque en tipografía, jerarquía visual y narrativa gráfica.',
            tags: ['InDesign', 'Editorial', 'Tipografía'],
            color: '#9D0208',
            img: null
        },
        {
            title: 'UX/UI Aplicación',
            desc: 'Diseño de interfaz y experiencia de usuario para una app de productividad, desde wireframes hasta prototipo interactivo.',
            tags: ['UX/UI', 'Figma', 'Prototipado'],
            color: '#E85D04',
            img: null
        },
        {
            title: 'Modelado 3D',
            desc: 'Modelado y renderizado de producto para catálogo comercial, con texturizado realista e iluminación profesional.',
            tags: ['Blender', '3D', 'Render'],
            color: '#FFBA08',
            img: null
        },
        {
            title: 'Muralismo / Arte Urbano',
            desc: 'Dirección de arte y diseño de murales de gran formato con técnicas digitales y modelado 3D escultórico.',
            tags: ['Arte Urbano', 'Muralismo', 'Escultura Digital'],
            color: '#E85D04',
            img: null
        },
        {
            title: 'Iconografía Vectorial',
            desc: 'Creación de sistemas de iconografía vectorial para plataformas digitales, con enfoque en consistencia visual y escalabilidad.',
            tags: ['Vectorial', 'Iconografía', 'Sistemas de Diseño'],
            color: '#9D0208',
            img: null
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
                <div class="project-card-img" style="background: linear-gradient(135deg, ${p.color}, ${p.color}55);">
                    <span class="project-card-index">${String(i + 1).padStart(2, '0')}</span>
                </div>
                <div class="project-card-body">
                    <h3 class="project-card-title">${p.title}</h3>
                    <p class="project-card-desc">${p.desc}</p>
                    <div class="project-card-tags">
                        ${p.tags.map(t => `<span class="project-card-tag">${t}</span>`).join('')}
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

        modalImg.style.background = `linear-gradient(135deg, ${project.color}, ${project.color}66)`;
        modalImg.innerHTML = '';
        const letter = document.createElement('span');
        letter.style.cssText = 'display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:4rem; font-weight:600; color:rgba(255,255,255,0.2);';
        letter.textContent = project.title.charAt(0);
        modalImg.appendChild(letter);
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

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    const formFields = contactForm.querySelectorAll('input, textarea');

    function clearErrors() {
        formFields.forEach(f => {
            f.removeAttribute('aria-invalid');
            const err = f.parentNode.querySelector('.form-error');
            if (err) err.remove();
        });
    }

    function showError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        const err = document.createElement('span');
        err.className = 'form-error';
        err.textContent = message;
        err.role = 'alert';
        field.parentNode.appendChild(err);
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let hasError = false;

        formFields.forEach(f => {
            if (f.hasAttribute('required') && !f.value.trim()) {
                const label = contactForm.querySelector(`label[for="${f.id}"]`);
                showError(f, `El campo «${label ? label.textContent : f.name}» es obligatorio.`);
                hasError = true;
            } else if (f.type === 'email' && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim())) {
                showError(f, 'Introduce una dirección de correo válida (ej. nombre@dominio.com).');
                hasError = true;
            }
        });

        if (hasError) {
            const firstErr = contactForm.querySelector('[aria-invalid="true"]');
            if (firstErr) firstErr.focus();
            return;
        }

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '¡Mensaje enviado!';
        btn.style.pointerEvents = 'none';
        contactForm.reset();

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.pointerEvents = '';
        }, 3000);
    });

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
});
