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
        })

        this.main.addEventListener('mouseup', () => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.mode == drawingMode) {
                this.stopDrawing(layer);
            }
        })

        this.main.addEventListener('mousemove', (e) => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.mode == drawingMode && this.isDrawing == true) {
                this.pen(e, layer);
            }

        })

        this.main.addEventListener('keydown', (event) => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.mode == writingMode && this.isWriting) {
                if (event.key == 'Enter') {
                    this.stopWriting(layer);
                    return;
                } else {
                    this.text += event.key;
                    this.drawText(layer);
                }

            } else {
                this.text = "";
            }
        })


        this.main.addEventListener('mousedown',
            function (event) {
                const layer = window.layers.getLayer(window.layers.selected);
                if (layer.mode == dragMode) {
                    this.layerStartPos = { x: event.clientX, y: event.clientY };
                    this.layerIsDragging = true;
                }

            }
        )
        this.main.addEventListener('mousemove',
            function (event) {
                const dragFactor = 0.15;
                const layer = window.layers.getLayer(window.layers.selected);

                if (this.layerIsDragging && isLayerInBounds(event, layer, this.layerStartPos)) {
                    event.target.style.cursor = 'pointer';
                    let xDiff = (event.clientX - this.layerStartPos.x) * dragFactor;
                    let yDiff = (event.clientY - this.layerStartPos.y) * dragFactor;
                    layer.pos = { x: layer.pos.x + xDiff, y: layer.pos.y + yDiff };
                    window.editor.actions.updateMainCanvas();
                }

            }
        )
        this.main.addEventListener('mouseup',
            function (event) {
                this.layerIsDragging = false;
                event.target.style.cursor = 'default';

            }
        )
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
        this.mode = null;
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

    }

    startWriting(e) {
        this.text = "";
        this.main.focus();
        this.textPosition = this.getMousePos(e);
        this.isWriting = true;

    }

    stopWriting(layer) {
        this.isWriting = false;
        this.mode = null;
        this.text = "";
        this.ctx.drawImage(this.drawingCanvas, 0, 0);
        layer.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        editor.actions.updateMainCanvas();

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

    drawText(layer) {
        setTimeout(() => {
            this.drawingCtx.globalAlpha = 1;
            this.drawingCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawingCtx.font = '20px Arial';
            this.drawingCtx.fillStyle = 'black';
            this.drawingCtx.fillText(this.text, this.textPosition.x, this.textPosition.y);

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
