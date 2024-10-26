class Layers {
    constructor() {
        this.canvasStack = [];
        this.selectedCanvas = undefined;
    }

    addLayer(name) {
        this.canvasStack.push(new LayerCanvas(name));
    }
}

class LayerCanvas {
    constructor(name) {
        this.name = name;
        this.imageData = undefined;
        this.isActive = true;
    }

    updateImageData(imageData) {
        this.imageData = imageData;
    }
}