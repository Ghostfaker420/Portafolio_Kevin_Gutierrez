class Carousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.viewport = document.getElementById('carouselViewport');
        this.track = document.getElementById('carouselTrack');
        this.dots = document.getElementById('carouselDots');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');

        this.slides = options.slides || [];
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = null;

        if (this.slides.length > 0) {
            this.buildSlides();
            this.buildDots();
            this.setupEvents();
            this.goTo(0);
        }
    }

    buildSlides() {
        this.track.innerHTML = '';
        this.slides.forEach((slide, i) => {
            const el = document.createElement('div');
            el.className = 'carousel-slide' + (slide.img ? ' has-img' : '');
            el.innerHTML = slide.img
                ? `<img class="carousel-slide-img" src="${slide.img}" alt="${slide.title}" width="600" height="750" loading="${i === 0 ? 'eager' : 'lazy'}">
                   ${slide.title ? `<h3 class="carousel-slide-title">${slide.title}</h3>` : ''}
                   ${slide.desc ? `<p class="carousel-slide-desc">${slide.desc}</p>` : ''}`
                : `<div class="carousel-slide-icon">${slide.icon || '🖼️'}</div>
                   ${slide.title ? `<h3 class="carousel-slide-title">${slide.title}</h3>` : ''}
                   ${slide.desc ? `<p class="carousel-slide-desc">${slide.desc}</p>` : ''}`;
            if (slide.color && !slide.img) {
                el.style.background = `linear-gradient(135deg, ${slide.color}, ${slide.color}55)`;
            }
            this.track.appendChild(el);
        });
    }

    buildDots() {
        this.dots.innerHTML = '';
        this.slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Diapositiva ${i + 1}`);
            dot.addEventListener('click', () => this.goTo(i));
            this.dots.appendChild(dot);
        });
    }

    setupEvents() {
        const onDown = (e) => {
            this.isDragging = true;
            this.startX = e.clientX || (e.touches && e.touches[0].clientX);
            this.prevTranslate = this.currentTranslate;
            this.track.style.transition = 'none';
            this.viewport.style.cursor = 'grabbing';
        };

        const onMove = (e) => {
            if (!this.isDragging) return;
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const diff = x - this.startX;
            this.currentTranslate = this.prevTranslate + diff;
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        };

        const onUp = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.viewport.style.cursor = 'grab';
            const slideW = this.track.children[0]?.offsetWidth || 1;
            const movedBy = this.currentTranslate - this.prevTranslate;
            if (Math.abs(movedBy) > slideW * 0.18) {
                this.goTo(movedBy < 0 ? this.currentIndex + 1 : this.currentIndex - 1);
            } else {
                this.goTo(this.currentIndex);
            }
        };

        this.viewport.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        this.viewport.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onUp);

        this.prevBtn.addEventListener('click', () => this.goTo(this.currentIndex - 1));
        this.nextBtn.addEventListener('click', () => this.goTo(this.currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!this.container.contains(document.activeElement)) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.goTo(this.currentIndex - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); this.goTo(this.currentIndex + 1); }
        });

        this.viewport.addEventListener('dragstart', (e) => e.preventDefault());

        this._boundOnResize = () => {
            const slideW = this.track.children[0]?.offsetWidth || 1;
            this.currentTranslate = -this.currentIndex * slideW;
            this.track.style.transition = 'none';
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        };
        window.addEventListener('resize', this._boundOnResize);
    }

    goTo(index) {
        if (index < 0) index = 0;
        if (index >= this.slides.length) index = this.slides.length - 1;
        this.currentIndex = index;
        const slideW = this.track.children[0]?.offsetWidth || 1;
        this.currentTranslate = -index * slideW;
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        this.updateDots();
    }

    updateDots() {
        const dots = this.dots.querySelectorAll('.carousel-dot');
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === this.currentIndex);
            d.setAttribute('aria-selected', i === this.currentIndex);
        });
    }
}
