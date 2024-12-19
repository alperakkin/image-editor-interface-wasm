export class Draw {
    constructor() {
        this.isDrawing = false;
        this.canvas = null;
        this.ctx = null;
        this.drawingMode = null;
        this.opacity = 1;
        this.size = 5;
        this.color = "#000000";

        const main = document.getElementById('mainCanvas');

        main.addEventListener('mousedown', () => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true) {
                this.startDrawing(main);
            }
        })

        main.addEventListener('mouseup', () => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true) {
                this.stopDrawing(layer);
            }
        })

        main.addEventListener('mousemove', (e) => {
            const layer = window.layers.getLayer('<selected>');
            if (layer.drawingMode == true && this.isDrawing == true) {
                this.pen(e, layer);
            }

        })

    }

    startDrawing(main) {
        this.canvas = document.createElement('canvas');
        const rect = main.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${rect.left}px`;
        this.canvas.style.top = `${rect.top}px`;
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.background = 'transparent';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.isDrawing = true;

    }

    stopDrawing(layer) {

        this.canvas.remove();
        this.canvas = null;
        this.ctx = null;
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

        let drawingImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        layer.imageData = this.blendImageData(layer.imageData, drawingImageData);
        editor.actions.updateMainCanvas();
    }


    blendImageData(layerImageData, drawingImageData) {
        if (!layerImageData || !layerImageData.data) {
            return new ImageData(
                new Uint8ClampedArray(drawingImageData.data),
                drawingImageData.width,
                drawingImageData.height
            );
        }

        const width = layerImageData.width;
        const height = layerImageData.height;

        const blendedImage = new ImageData(width, height);


        const data1 = layerImageData.data;
        const data2 = drawingImageData.data;

        for (let i = 0; i < blendedImage.data.length; i += 4) {
            const r1 = data1[i];
            const g1 = data1[i + 1];
            const b1 = data1[i + 2];
            const a1 = data1[i + 3];

            const r2 = data2[i];
            const g2 = data2[i + 1];
            const b2 = data2[i + 2];
            const a2 = data2[i + 3];

            if (a2 > 0) {
                blendedImage.data[i] = r2;
                blendedImage.data[i + 1] = g2;
                blendedImage.data[i + 2] = b2;
                blendedImage.data[i + 3] = a2;
            } else {

                blendedImage.data[i] = r1;
                blendedImage.data[i + 1] = g1;
                blendedImage.data[i + 2] = b1;
                blendedImage.data[i + 3] = a1;
            }
        }

        return blendedImage;
    }



    drawCircle(e) {
        const { x, y } = this.getMousePos(e);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }

}