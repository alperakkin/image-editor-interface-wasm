export class Draw {
    constructor(mainCanvas) {
        this.isDrawing = false;

        this.drawingMode = null;
        this.opacity = 1;
        this.size = 5;
        this.color = "#000000";

        this.main = mainCanvas
        this.canvas = new OffscreenCanvas(this.main.width, this.main.height);

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawingCanvas = new OffscreenCanvas(this.main.width, this.main.height);

        this.drawingCtx = this.drawingCanvas.getContext('2d', { willReadFrequently: true });
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        this.drawingCtx.globalCompositeOperation = "source-over";
        this.ctx.globalCompositeOperation = "source-over";
        this.drawingCtx.lineWidth = 0;

        this.drawingCtx.globalAlpha = 0.5;

        this.main.addEventListener('mousedown', (e) => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true) {
                this.startDrawing();
                this.pen(e, layer);
            }
        })

        this.main.addEventListener('mouseup', () => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true) {
                this.stopDrawing(layer);
            }
        })

        this.main.addEventListener('mousemove', (e) => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true && this.isDrawing == true) {
                this.pen(e, layer);
            }

        })

    }

    startDrawing(e) {
        const layer = layers.getLayer('<selected>');
        if (layer.imageData) {
            this.ctx.putImageData(
                layer.imageData,
                Math.round(layer.pos.x),
                Math.round(layer.pos.y)
            );
        }
        this.isDrawing = true;
    }


    stopDrawing(layer) {
        if (this.isDrawing) {
            layer.imageData = this.ctx.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            editor.actions.updateMainCanvas();
        }
        this.isDrawing = false;
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
    }


    setMode(mode) {
        layers.getLayer('<selected>').drawingMode = true;
        this.drawingMode = mode;
    }

    addAlpha(hex, alpha) {
        hex = hex.replace('#', '');
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return `#${hex}${alphaHex}`;
    }

    pen(e, layer) {
        setTimeout(() => {
            const { x, y } = this.getMousePos(e);

            const centerX = x;
            const centerY = y;

            const radius = this.size;

            this.drawingCtx.beginPath();

            for (let i = -radius; i < radius; i++) {
                for (let j = -radius; j < radius; j++) {

                    const dx = centerX + i;
                    const dy = centerY + j;

                    const dist = Math.sqrt((dx - centerX) ** 2 + (dy - centerY) ** 2);

                    if (dist <= radius) {
                        const alpha = 1 - dist / radius;
                        const colorWithAlpha = this.addAlpha(this.color, Math.max(alpha * this.opacity, 0)); // Minimum 0 opaklık olmalı

                        this.drawingCtx.fillStyle = colorWithAlpha;
                        this.drawingCtx.fillRect(dx, dy, 1, 1);
                    }
                }
            }

            this.drawingCtx.fill();
            this.drawingCtx.closePath();

            this.ctx.drawImage(this.drawingCanvas, 0, 0);
            this.drawingCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            layer.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            editor.actions.updateMainCanvas();
        }, 16);
    }



    getMousePos(e) {
        const rect = this.main.getBoundingClientRect();

        const imageWidth = this.canvas.width;
        const imageHeight = this.canvas.height;

        const scaleX = imageWidth / rect.width;
        const scaleY = imageHeight / rect.height;


        const normalizedX = (e.clientX - rect.left) * scaleX;
        const normalizedY = (e.clientY - rect.top) * scaleY;

        return {
            x: normalizedX,
            y: normalizedY,
        };
    }

    updateSettings() {
        this.size = document.getElementById('brush-size').value;
        this.opacity = document.getElementById('brush-opacity').value;
        this.color = document.getElementById('brush-color-picker').value;
    }


}
