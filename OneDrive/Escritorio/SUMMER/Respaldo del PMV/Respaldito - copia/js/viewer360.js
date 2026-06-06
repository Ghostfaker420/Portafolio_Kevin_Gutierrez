class Viewer360 {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.stage = document.getElementById('viewerStage');
        this.canvas = document.getElementById('viewerCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.placeholder = document.getElementById('viewerPlaceholder');

        this.slider = document.getElementById('viewerSlider');
        if (this.slider) this.slider.max = this.totalFrames - 1;
        this.spriteSrc = options.spriteSrc || null;
        this.framesPath = options.framesPath || null;
        this.totalFrames = options.totalFrames || 36;
        this.framesPerRow = options.framesPerRow || 36;

        this.currentFrame = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startFrame = 0;
        this.autoRotate = false;
        this.autoRotateId = null;
        this.spriteImage = null;
        this.frames = [];
        this.framesLoaded = 0;
        this.spriteLoaded = false;
        this._boundOnMove = null;
        this._boundOnUp = null;
        this._boundOnResize = null;
        this._boundOnKeydown = null;

        this.demoMode = !this.spriteSrc && !this.framesPath;
        this.resize();
        this.init();
    }

    init() {
        if (this.framesPath) {
            this.loadFrames();
        } else if (this.spriteSrc) {
            this.loadSprite();
        } else {
            this.placeholder.style.display = 'none';
            this.generateDemoSprite();
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

    pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    loadFrames() {
        let loaded = 0;
        let valid = 0;
        for (let i = 1; i <= this.totalFrames; i++) {
            const idx = i - 1;
            const img = new Image();
            const padded = this.pad(i);
            img.src = this.framesPath + '100' + padded + '.png';
            img.onload = () => {
                loaded++;
                valid++;
                if (loaded === 1) {
                    this.placeholder.style.display = 'none';
                }
                if (loaded === this.totalFrames) {
                    if (this.slider) this.slider.max = valid - 1;
                    this.spriteLoaded = true;
                    this.render();
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded === this.totalFrames) {
                    if (this.slider) this.slider.max = valid - 1;
                    this.spriteLoaded = true;
                    this.render();
                }
            };
            this.frames[idx] = img;
        }
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
            if (this.autoRotate) this.toggleAutoRotate();
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
                if (this.autoRotate) this.startAutoRotate();
            }
        };

        this._boundOnResize = () => { this.resize(); };
        this._boundOnKeydown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.currentFrame = (this.currentFrame - 1 + this.totalFrames) % this.totalFrames;
                this.render();
                if (this.autoRotate) this.toggleAutoRotate();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.render();
                if (this.autoRotate) this.toggleAutoRotate();
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

        if (this.slider) {
            this.slider.addEventListener('input', (e) => {
                this.currentFrame = parseInt(e.target.value);
                if (this.autoRotate) this.toggleAutoRotate();
                this.render();
            });
        }

        this.stage.addEventListener('keydown', this._boundOnKeydown);

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

        const cw = this.canvas.width / 2;
        const ch = this.canvas.height / 2;
        this.ctx.clearRect(0, 0, cw, ch);

        if (this.frames.length) {
            const img = this.frames[this.currentFrame];
            if (img && img.complete && img.naturalWidth && img.naturalHeight) {
                const iw = img.naturalWidth;
                const ih = img.naturalHeight;
                const zoom = 1.2;
                const drawAr = cw / ch;
                const imgAr = iw / ih;
                let sw, sh, sx, sy;
                if (imgAr > drawAr) {
                    sh = ch * zoom;
                    sw = sh * imgAr;
                    sx = (cw - sw) / 2;
                    sy = (ch - sh) / 2;
                } else {
                    sw = cw * zoom;
                    sh = sw / imgAr;
                    sx = (cw - sw) / 2;
                    sy = (ch - sh) / 2;
                }
                this.ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
            }
        } else if (this.spriteImage) {
            const frameW = this.spriteImage.width / this.framesPerRow;
            const frameH = this.spriteImage.height / Math.ceil(this.totalFrames / this.framesPerRow);
            const row = Math.floor(this.currentFrame / this.framesPerRow);
            const col = this.currentFrame % this.framesPerRow;

            const sx = col * frameW;
            const sy = row * frameH;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(cw / 2, ch / 2, Math.min(cw, ch) / 2 - 4, 0, Math.PI * 2);
            this.ctx.clip();
            this.ctx.drawImage(this.spriteImage, sx, sy, frameW, frameH, 0, 0, cw, ch);
            this.ctx.restore();
        }

        const angle = Math.round((this.currentFrame / this.totalFrames) * 360);
        if (this.angleDisplay) {
            this.angleDisplay.textContent = angle + '°';
        }

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
    }
}
