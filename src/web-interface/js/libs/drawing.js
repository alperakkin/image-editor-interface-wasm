export default class Draw {
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
                this.stopDrawing();
            }
        })

        main.addEventListener('mousemove', (e) => {

        })

    }

    startDrawing(main) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.canvas.width = main.width;
        this.canvas.height = main.height;
        this.isDrawing = true;

    }

    stopDrawing() {
        this.canvas = undefined;
        this.ctx = undefined;
        this.isDrawing = false;
    }



}