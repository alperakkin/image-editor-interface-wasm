const drawingMode = 'drawingMode';
const writingMode = 'writingMode';
const dragMode = 'dragMode';
export class canvasOperation {
    constructor(mainCanvas) {
        this.isDrawing = false;
        this.isWriting = false;
        this.mode = null;
        this.opacity = 1;
        this.size = 5;
        this.color = "#000000";

        this.main = mainCanvas
        this.main.setAttribute('tabindex', '0');
        this.canvas = new OffscreenCanvas(this.main.width, this.main.height);

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawingCanvas = new OffscreenCanvas(this.main.width, this.main.height);

        this.drawingCtx = this.drawingCanvas.getContext('2d', { willReadFrequently: true });
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        this.drawingCtx.globalCompositeOperation = "source-over";
        this.ctx.globalCompositeOperation = "source-over";
        this.drawingCtx.lineWidth = 0;
        this.text = "";
        this.textPosition = null;


        this.layerIsDragging = false;
        this.layerStartPos = false;

        this.main.addEventListener('mousedown', (e) => {
            const layer = window.layers.getLayer('<selected>');

            if (layer.mode == drawingMode) {
                this.startDrawing();
                this.pen(e, layer);
            }

            if (layer.mode == writingMode) {
                this.startWriting(e);
            }

            if (layer.mode == dragMode) {
                this.layerStartPos = { x: e.clientX, y: e.clientY };
                this.layerIsDragging = true;
            }
        })

        this.main.addEventListener('mouseup', (e) => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.mode == drawingMode) {
                this.stopDrawing(layer, e);
            }

            if (layer.mode == dragMode) {
                this.layerIsDragging = false;
                e.target.style.cursor = 'default';
            }
        })

        this.main.addEventListener('mousemove', (e) => {
            const dragFactor = 0.15;
            const layer = window.layers.getLayer('<selected>');
            if (layer.mode == drawingMode && this.isDrawing == true) {
                this.pen(e, layer);
            }


            if (this.layerIsDragging && isLayerInBounds(e, layer, this.layerStartPos)) {
                e.target.style.cursor = 'pointer';
                let xDiff = (e.clientX - this.layerStartPos.x) * dragFactor;
                let yDiff = (e.clientY - this.layerStartPos.y) * dragFactor;
                layer.pos = { x: layer.pos.x + xDiff, y: layer.pos.y + yDiff };
                window.editor.actions.updateMainCanvas();
            }

        })

        this.main.addEventListener('keydown', (event) => {
            const layer = window.layers.getLayer('<selected>');

            if (layer.mode == writingMode && this.isWriting) {
                if (event.key == 'Enter') {
                    this.stopWriting(event);
                    return;
                } else {
                    this.text += event.key;
                    this.drawText();
                }
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


    stopDrawing(layer, e) {
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
        this.mode = null;
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        e.target.style.cursor = 'default';
        this.text = ""

    }

    startWriting(e) {
        this.main.focus();
        this.textPosition = this.getMousePos(e);
        this.isWriting = true;
        e.target.style.cursor = 'text';
        this.text = "";







    }

    stopWriting(event) {
        this.isWriting = false;
        this.mode = null;
        event.target.style.cursor = 'default';
        const textLayer = layers.getLayer();
        textLayer.name = this.text;
        layers.selected = textLayer.name;
        this.text = "";
    }


    setMode(modeName) {
        const layer = layers.getLayer('<selected>');

        layer.mode = modeName;
        this.mode = modeName;

    }

    addAlpha(hex, alpha) {
        hex = hex.replace('#', '');
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return `#${hex}${alphaHex}`;
    }

    drawText() {

        setTimeout(() => {
            if (!this.textPosition || !this.text) {
                return;
            }

            const layer = layers.getLayer('<selected>');
            this.drawingCtx.globalAlpha = 1;
            this.drawingCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawingCtx.font = '20px Arial';
            this.drawingCtx.fillStyle = 'black';
            this.drawingCtx.fillText(this.text, this.textPosition.x, this.textPosition.y);
            this.ctx.drawImage(this.drawingCanvas, 0, 0);
            layer.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            editor.actions.updateMainCanvas();


        }, 16);
    }

    pen(e, layer) {
        setTimeout(() => {
            this.drawingCtx.globalAlpha = 0.5;
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
                        const colorWithAlpha = this.addAlpha(this.color, Math.max(alpha * this.opacity, 0));

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
