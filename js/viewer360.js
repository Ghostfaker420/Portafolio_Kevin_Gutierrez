class Viewer360 {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.stage = document.getElementById('viewerStage');
        this.canvas = document.getElementById('viewerCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.placeholder = document.getElementById('viewerPlaceholder');
        this.angleDisplay = document.getElementById('viewerAngle');
        this.slider = document.getElementById('viewerSlider');

        this.spriteSrc = options.spriteSrc || null;
        this.totalFrames = options.totalFrames || 36;
        this.framesPerRow = options.framesPerRow || 36;
        this.frameFiles = options.frameFiles || null;

        this.currentFrame = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startFrame = 0;
        this.autoRotate = false;
        this.autoRotateId = null;
        this.wasAutoRotating = false;
        this.spriteImage = null;
        this.spriteLoaded = false;
        this.frameImages = [];
        this._boundOnMove = null;
        this._boundOnUp = null;
        this._boundOnResize = null;
        this._boundOnKeydown = null;
        this._boundOnSlider = null;

        this.demoMode = !this.spriteSrc && !this.frameFiles;
        this.resize();
        this.init();
    }

    init() {
        if (this.frameFiles) {
            this.placeholder.style.display = 'none';
            this.loadFrames();
        } else if (this.demoMode) {
            this.placeholder.style.display = 'none';
            this.generateDemoSprite();
        } else {
            this.loadSprite();
        }

        if (this.slider) {
            this.slider.max = this.totalFrames - 1;
        }
        this.setupEvents();
        this.render();
    }

    resize() {
        const rect = this.stage.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        this.canvas.width = w * 2;
        this.canvas.height = h * 2;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(2, 0, 0, 2, 0, 0);
    }

    loadSprite() {
        this.spriteImage = new Image();
        this.spriteImage.onload = () => {
            this.spriteLoaded = true;
            this.placeholder.style.display = 'none';
            this.render();
        };
        this.spriteImage.onerror = () => {
            this.placeholder.textContent = 'Error al cargar spritesheet. Usando demo.';
            this.demoMode = true;
            this.generateDemoSprite();
            this.render();
        };
        this.spriteImage.src = this.spriteSrc;
    }

    loadFrames() {
        let loaded = 0;

        for (let i = 0; i < this.totalFrames; i++) {
            const img = new Image();
            img.onload = () => {
                if (this.demoMode) return;
                loaded++;
                if (loaded === this.totalFrames) {
                    this.spriteLoaded = true;
                    this.render();
                }
            };
            img.onerror = () => {
                if (this.demoMode) return;
                this.placeholder.textContent = 'Error al cargar frames. Mostrando demo.';
                this.demoMode = true;
                this.generateDemoSprite();
                this.render();
            };
            img.src = this.frameFiles[i];
            this.frameImages[i] = img;
        }
    }

    generateDemoSprite() {
        const frameW = 200;
        const frameH = 200;
        const totalW = frameW * this.totalFrames;
        const demoCanvas = document.createElement('canvas');
        demoCanvas.width = totalW;
        demoCanvas.height = frameH;
        const dCtx = demoCanvas.getContext('2d');

        for (let i = 0; i < this.totalFrames; i++) {
            const angle = (i / this.totalFrames) * Math.PI * 2;
            const x = i * frameW;
            const y = frameH / 2;

            dCtx.clearRect(x, 0, frameW, frameH);

            const cx = x + frameW / 2;
            const cy = frameH / 2;

            dCtx.save();
            dCtx.translate(cx, cy);

            const grad = dCtx.createRadialGradient(0, 0, 5, 0, 0, 70);
            grad.addColorStop(0, '#D4D9FF');
            grad.addColorStop(0.4, '#8b90e0');
            grad.addColorStop(1, '#03071E');
            dCtx.fillStyle = grad;
            dCtx.strokeStyle = 'rgba(212, 217, 255, 0.4)';
            dCtx.lineWidth = 2;

            dCtx.beginPath();

            const rings = 12;
            const ringRadius = 55;
            for (let r = 0; r < rings; r++) {
                const ringAngle = (r / rings) * Math.PI * 2 + angle;
                const ringX = Math.cos(ringAngle) * ringRadius;
                const ringZ = Math.sin(ringAngle) * ringRadius;
                const scale = 0.5 + (ringZ + ringRadius) / (ringRadius * 2) * 0.5;
                const sphereR = 12 * scale;
                const sphereX = ringX;
                const sphereY = Math.sin(ringAngle * 2 + angle) * 20 * scale;

                const sg = dCtx.createRadialGradient(
                    sphereX - sphereR * 0.3, sphereY - sphereR * 0.3, 1,
                    sphereX, sphereY, sphereR
                );
                sg.addColorStop(0, '#ffffff');
                sg.addColorStop(0.3, '#D4D9FF');
                sg.addColorStop(0.7, '#6a6fc0');
                sg.addColorStop(1, '#2a2f60');

                dCtx.beginPath();
                dCtx.arc(sphereX, sphereY, sphereR, 0, Math.PI * 2);
                dCtx.fillStyle = sg;
                dCtx.fill();
                dCtx.stroke();
            }

            const coreGrad = dCtx.createRadialGradient(0, 0, 1, 0, 0, 25);
            coreGrad.addColorStop(0, 'rgba(212, 217, 255, 0.6)');
            coreGrad.addColorStop(1, 'rgba(212, 217, 255, 0)');
            dCtx.fillStyle = coreGrad;
            dCtx.beginPath();
            dCtx.arc(0, 0, 25, 0, Math.PI * 2);
            dCtx.fill();

            dCtx.restore();
        }

        this.spriteImage = new Image();
        this.spriteImage.onload = () => {
            this.spriteLoaded = true;
            this.render();
        };
        this.spriteImage.src = demoCanvas.toDataURL();
    }

    setupEvents() {
        const onDown = (e) => {
            this.isDragging = true;
            this.startX = e.clientX || (e.touches && e.touches[0].clientX);
            this.startFrame = this.currentFrame;
            this.wasAutoRotating = this.autoRotate;
            if (this.autoRotate) {
                this.autoRotate = false;
                this.stopAutoRotate();
                document.getElementById('viewerAutoRotate').classList.remove('active');
            }
        };

        this._boundOnMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const diff = x - this.startX;
            const frameDelta = (diff / this.stage.offsetWidth) * this.totalFrames;
            this.currentFrame = (this.startFrame - Math.round(frameDelta)) % this.totalFrames;
            if (this.currentFrame < 0) this.currentFrame += this.totalFrames;
            this.render();
        };

        this._boundOnUp = () => {
            if (this.isDragging) {
                this.isDragging = false;
                if (this.wasAutoRotating) {
                    this.wasAutoRotating = false;
                    this.autoRotate = true;
                    document.getElementById('viewerAutoRotate').classList.add('active');
                    this.startAutoRotate();
                }
            }
        };

        this._boundOnResize = () => { this.resize(); };
        this._boundOnKeydown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.currentFrame = (this.currentFrame - 1 + this.totalFrames) % this.totalFrames;
                this.render();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.render();
            }
        };

        this.stage.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', this._boundOnMove);
        window.addEventListener('mouseup', this._boundOnUp);

        this.stage.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('touchmove', this._boundOnMove, { passive: false });
        window.addEventListener('touchend', this._boundOnUp);

        document.getElementById('viewerAutoRotate').addEventListener('click', () => this.toggleAutoRotate());
        document.getElementById('viewerReset').addEventListener('click', () => this.reset());

        this.stage.addEventListener('keydown', this._boundOnKeydown);

        this._boundOnSlider = () => {
            this.currentFrame = parseInt(this.slider.value);
            if (this.autoRotate) {
                this.autoRotate = false;
                this.stopAutoRotate();
                document.getElementById('viewerAutoRotate').classList.remove('active');
            }
            this.render();
        };
        if (this.slider) {
            this.slider.addEventListener('input', this._boundOnSlider);
        }

        window.addEventListener('resize', this._boundOnResize);
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        document.getElementById('viewerAutoRotate').classList.toggle('active');
        if (this.autoRotate) {
            this.startAutoRotate();
        } else {
            this.stopAutoRotate();
        }
    }

    startAutoRotate() {
        this.stopAutoRotate();
        const fps = 30;
        const frameDelay = 1000 / fps;
        let lastTime = 0;

        const step = (timestamp) => {
            if (!this.autoRotate) return;
            if (timestamp - lastTime >= frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.render();
                lastTime = timestamp;
            }
            this.autoRotateId = requestAnimationFrame(step);
        };
        this.autoRotateId = requestAnimationFrame(step);
    }

    stopAutoRotate() {
        if (this.autoRotateId) {
            cancelAnimationFrame(this.autoRotateId);
            this.autoRotateId = null;
        }
    }

    reset() {
        this.currentFrame = 0;
        this.render();
    }

    render() {
        if (!this.spriteLoaded && !this.demoMode) return;

        const w = this.canvas.width / 2;
        const h = this.canvas.height / 2;
        if (w <= 0 || h <= 0) return;
        this.ctx.clearRect(0, 0, w, h);

        if (this.frameImages.length > 0) {
            const img = this.frameImages[this.currentFrame];
            if (img && img.complete && img.naturalWidth > 0) {
                const imgW = img.naturalWidth;
                const imgH = img.naturalHeight;
                const scale = Math.max(w / imgW, h / imgH);
                const drawW = imgW * scale;
                const drawH = imgH * scale;
                const dx = (w - drawW) / 2;
                const dy = (h - drawH) / 2;
                this.ctx.drawImage(img, dx, dy, drawW, drawH);
            }
        } else if (this.spriteImage) {
            const frameW = this.spriteImage.width / this.framesPerRow;
            const frameH = this.spriteImage.height / Math.ceil(this.totalFrames / this.framesPerRow);
            const row = Math.floor(this.currentFrame / this.framesPerRow);
            const col = this.currentFrame % this.framesPerRow;
            this.ctx.drawImage(this.spriteImage, col * frameW, row * frameH, frameW, frameH, 0, 0, w, h);
        }

        this.updateSlider();

        const angle = Math.round((this.currentFrame / this.totalFrames) * 360);
        if (this.angleDisplay) {
            this.angleDisplay.textContent = angle + '°';
        }
    }

    updateSlider() {
        if (this.slider) {
            this.slider.value = this.currentFrame;
        }
    }

    destroy() {
        this.stopAutoRotate();
        window.removeEventListener('mousemove', this._boundOnMove);
        window.removeEventListener('mouseup', this._boundOnUp);
        window.removeEventListener('touchmove', this._boundOnMove);
        window.removeEventListener('touchend', this._boundOnUp);
        window.removeEventListener('resize', this._boundOnResize);
        this.stage.removeEventListener('keydown', this._boundOnKeydown);
        if (this.slider) {
            this.slider.removeEventListener('input', this._boundOnSlider);
        }
    }
}
