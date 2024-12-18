export class Draw {
    constructor() {
        this.isDrawing = false;
        this.canvas = undefined;
        this.ctx = undefined;
        this.drawingMode = undefined;
        this.opacity = 1;
        this.size = 10;
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
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.canvas.width = main.width;
        this.canvas.height = main.height;
        this.isDrawing = true;

    }

    stopDrawing(layer) {

        this.canvas.remove();
        this.canvas = undefined;
        this.ctx = undefined;
        this.isDrawing = false;
        console.log("Drawing finished layer imageData will be updated layer->", layer);
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
        if (!layerImageData) return drawingImageData;

        const width = layerImageData.width;
        const height = layerImageData.height;


        const blendedImage = new ImageData(width, height);


        const data1 = layerImageData.data;
        const data2 = drawingImageData.data;
        const blendedData = blendedImage.data;

        for (let i = 0; i < blendedData.length; i += 4) {
            const r1 = data1[i];
            const g1 = data1[i + 1];
            const b1 = data1[i + 2];
            const a1 = data1[i + 3] / 255;

            const r2 = data2[i];
            const g2 = data2[i + 1];
            const b2 = data2[i + 2];
            const a2 = data2[i + 3] / 255;

            const alphaOut = a1 + a2 * (1 - a1);
            blendedData[i] = (r1 * a1 + r2 * a2 * (1 - a1)) / alphaOut || 0; // R
            blendedData[i + 1] = (g1 * a1 + g2 * a2 * (1 - a1)) / alphaOut || 0; // G
            blendedData[i + 2] = (b1 * a1 + b2 * a2 * (1 - a1)) / alphaOut || 0; // B
            blendedData[i + 3] = alphaOut * 255; // A
        }

        return blendedImage;
    }

    drawCircle(e) {
        this.ctx.beginPath();
        this.ctx.arc(e.screenX, e.screenY, this.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

}