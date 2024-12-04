export default class Actions {
    constructor() {
        this.history = []

    }

    addAction(action, imgData, layer) {


        let actionObj = { [`${layer.name}->${action}`]: layer.imageData };
        this.history.push(actionObj);
        if (this.history.length > 10) {
            let diff = this.history.length - 10;
            this.history = Array.from(this.history).splice(diff, this.history.length);
        }

        layer.imageData = imgData;

        editor.actions.updateMainCanvas();






    }
    undoAction() {
        // TODO: remove last action from layer
        console.log(this.history);
    }

    removeLayerActions(layer) {
        // TODO: remove all action related to the layer
    }

    updateMainCanvas() {
        const mainCanvas = document.getElementById("mainCanvas");
        const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        window.layers.emptyBackground(mainCanvas);

        window.layers.layerStack.slice().reverse().forEach(layer => {
            if (layer.isActive && layer.name != 'main')
                mainCtx.putImageData(layer.imageData, layer.pos.x, layer.pos.y);
        });

    }

}

