export class Draw {
    constructor() {
        this.isDrawing = false;
        this.canvas = undefined;
        this.ctx = undefined;
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
                console.log(`Drawing x: ${e.clientX} y: ${e.clientY}`);
            }

        })

    }

    startDrawing(main) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.canvas.width = main.width;
        this.canvas.height = main.height;
        this.isDrawing = true;

    }

    stopDrawing(layer) {
        this.canvas = undefined;
        this.ctx = undefined;
        this.isDrawing = false;
        layer.drawingMode = false;
        console.log("Drawing finished layer imageData will be updated layer->", layer);
    }



}