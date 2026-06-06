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
            color: '#E85D04'
        },
        {
            title: 'Diseño Editorial',
            desc: 'Maquetación y diseño de una revista cultural con enfoque en tipografía, jerarquía visual y narrativa gráfica.',
            tags: ['InDesign', 'Editorial', 'Tipografía'],
            color: '#E85D04'
        },
        {
            title: 'UX/UI Aplicación',
            desc: 'Diseño de interfaz y experiencia de usuario para una app de productividad, desde wireframes hasta prototipo interactivo.',
            tags: ['UX/UI', 'Figma', 'Prototipado'],
            color: '#E85D04'
        },
        {
            title: 'Modelado 3D',
            desc: 'Modelado y renderizado de producto para catálogo comercial, con texturizado realista e iluminación profesional.',
            tags: ['Blender', '3D', 'Render'],
            color: '#E85D04'
        },
        {
            title: 'Campaña Visual',
            desc: 'Dirección de arte y diseño gráfico para campaña publicitaria multicanal, incluyendo redes sociales y material impreso.',
            tags: ['Photoshop', 'Publicidad', 'Social Media'],
            color: '#E85D04'
        },
        {
            title: 'Página Web',
            desc: 'Diseño y desarrollo de sitio web corporativo con enfoque en experiencia de usuario, rendimiento y accesibilidad.',
            tags: ['HTML/CSS', 'JS', 'UX/UI'],
            color: '#E85D04'
        },
        {
            title: 'Arte Urbano',
            desc: 'Exploración visual del muralismo como expresión artística urbana, combinando técnicas tradicionales con narrativa gráfica contemporánea.',
            tags: ['Muralismo', 'Arte Urbano', 'Ilustración'],
            color: '#9D0208',
            img: 'assets/images/Muralismo/2.PNG',
            secondaryImg: 'assets/images/Muralismo/1.PNG'
        }
    ];

    const projectsGrid = document.getElementById('projectsGrid');

    function renderProjectCards() {
        projectsGrid.innerHTML = '';
        projects.forEach((p, i) => {
            const card = document.createElement('article');
            card.className = 'project-card reveal-up';
            card.style.transitionDelay = `${i * 0.08}s`;
            card.tabIndex = 0;
            card.role = 'button';
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(p);
                }
            });

            card.innerHTML = `
                <div class="project-card-inner">
                    <div class="project-card-img">
                        ${p.img ? `<img src="${p.img}" alt="${p.title}" loading="lazy">` : `<span style="background:linear-gradient(135deg,${p.color},${p.color}66);display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:rgba(255,255,255,0.3);font-size:2.5rem;font-weight:600;letter-spacing:2px">${p.title.charAt(0)}</span>`}
                    </div>
                    <div class="project-card-body">
                        <h3 class="project-card-title">${p.title}</h3>
                        <p class="project-card-desc">${p.desc}</p>
                        <div class="project-card-tags">
                            ${p.tags.map(t => `<span class="project-card-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openModal(p));
            projectsGrid.appendChild(card);
        });
    }

    renderProjectCards();

    // ==================== TILT 3D ====================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            const inner = card.querySelector('.project-card-inner');
            if (inner) {
                inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.project-card-inner');
            if (inner) {
                inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }
        });
    });

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

        modalImg.innerHTML = '';
        modalImg.style.display = 'flex';
        if (project.img) {
            const img = document.createElement('img');
            img.src = project.img;
            img.alt = project.title;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            modalImg.appendChild(img);
        } else {
            modalImg.style.background = `linear-gradient(135deg, ${project.color}, ${project.color}66)`;
            const letter = document.createElement('span');
            letter.style.cssText = 'display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:4rem; font-weight:600; color:rgba(255,255,255,0.2);';
            letter.textContent = project.title.charAt(0);
            modalImg.appendChild(letter);
        }

        const secondaryContainer = document.getElementById('modalSecondaryImg');
        if (secondaryContainer) {
            secondaryContainer.innerHTML = '';
            if (project.secondaryImg) {
                const inner = document.createElement('div');
                inner.className = 'modal-secondary-img-inner';
                const img = document.createElement('img');
                img.src = project.secondaryImg;
                img.alt = `${project.title} — apoyo visual`;
                img.loading = 'lazy';
                inner.appendChild(img);
                secondaryContainer.appendChild(inner);
                secondaryContainer.style.display = 'block';
            } else {
                secondaryContainer.style.display = 'none';
            }
        }

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
        const viewer = new Viewer360('viewerContainer', {
            totalFrames: 36,
            framesPath: 'assets/images/360/1/'
        });
    } catch (err) {
        console.warn('Viewer360 no disponible:', err.message);
    }

    // ==================== CARRUSEL ====================
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const counterEl = document.getElementById('carouselCounter');

    if (track && dotsContainer) {
        const slides = track.querySelectorAll('.carousel-slide');
        const total = slides.length;
        let current = 0;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        function pad(n) {
            return String(n).padStart(2, '0');
        }

        function updateCarousel() {
            track.style.transform = `translateX(-${current * 100}%)`;
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
            if (counterEl) counterEl.textContent = `${pad(current + 1)} / ${pad(total)}`;
        }

        function goTo(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            current = index;
            updateCarousel();
        }

        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

        // Keyboard
        const carousel = document.getElementById('carousel');
        if (carousel) {
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { goTo(current - 1); e.preventDefault(); }
                if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
            });
        }

        // Touch / drag support
        function dragStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            prevTranslate = 0;
            track.style.transition = 'none';
            track.style.cursor = 'grabbing';
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.5s var(--easing)';
            track.style.cursor = '';
            const movedBy = currentTranslate;
            if (movedBy < -60) goTo(current + 1);
            if (movedBy > 60) goTo(current - 1);
            currentTranslate = 0;
            prevTranslate = 0;
            // Snap if threshold not met
            if (Math.abs(movedBy) < 60 && movedBy !== 0) {
                goTo(current);
            }
        }

        function dragMove(e) {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const diff = currentX - startX;
            // Apply drag resistance: scale down as drag increases
            const maxDrag = track.offsetWidth * 0.45;
            const clamped = Math.max(-maxDrag, Math.min(maxDrag, diff));
            const resistance = 1 - Math.pow(Math.abs(clamped) / maxDrag, 2) * 0.35;
            const resisted = clamped * resistance;
            currentTranslate = resisted;
            const offset = -current * track.offsetWidth + resisted;
            track.style.transform = `translateX(${offset}px)`;
        }

        track.addEventListener('mousedown', dragStart);
        track.addEventListener('mousemove', dragMove);
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', dragEnd);
        track.addEventListener('touchstart', dragStart, { passive: true });
        track.addEventListener('touchmove', dragMove, { passive: true });
        track.addEventListener('touchend', dragEnd);
        track.setAttribute('tabindex', '0');
        track.setAttribute('role', 'region');
        track.setAttribute('aria-label', 'Carrusel de proyectos');
    }
});
