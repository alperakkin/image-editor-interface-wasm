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

        this.main.addEventListener('mousedown', () => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true) {
                this.startDrawing();
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
    }


    setMode(mode) {
        layers.getLayer('<selected>').drawingMode = true;
        this.drawingMode = mode;
    }

    pen(e, layer) {
        if (this.drawingMode == 'circle') {
            this.drawCircle(e);
        }
        else if (this.drawingMode == 'square') {
            this.drawSquare(e);
        }

        this.ctx.drawImage(this.drawingCanvas, 0, 0);
        layer.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        editor.actions.updateMainCanvas();
    }





    drawCircle(e) {
        const { x, y } = this.getMousePos(e);
        this.drawingCtx.beginPath();
        this.drawingCtx.arc(x, y, this.size, 0, 2 * Math.PI);
        this.drawingCtx.fillStyle = this.color;
        this.drawingCtx.fill();
        this.drawingCtx.closePath();
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



}
