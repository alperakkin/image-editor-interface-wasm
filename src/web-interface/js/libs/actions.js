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
        document.getElementById("options").value = "";






    }
    undoAction() {
        const lastAction = this.history[this.history.length - 1];
        if (lastAction) {
            const layerName = Object.keys(lastAction)[0].split('->')[0];
            const imageData = Object.values(lastAction)[0];
            const layer = window.layers.getLayer(layerName);
            layer.imageData = imageData;
            this.updateMainCanvas();
            this.history = this.history.splice(0, this.history.length - 1);

        }
    }

    removeLayerActions(layerName) {
        let newLayer = [];
        Array.from(this.history).forEach(item => {
            if (!Object.keys(item)[0].startsWith(layerName + '->'))
                newLayer.push(item);
        }
        )
        this.history = newLayer;
        this.updateMainCanvas();
    }

    updateMainCanvas() {
        const mainCanvas = document.getElementById("mainCanvas");
        const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        window.layers.emptyBackground(mainCanvas);

        window.layers.layerStack.slice().reverse().forEach(layer => {
            if (layer.isActive && layer.name != 'main' && layer.imageData) {

                mainCtx.putImageData(layer.imageData, layer.pos.x, layer.pos.y);
                const cnv = layer.getCanvas();
                const cnvCtx = cnv.getContext('2d', { willReadFrequently: true });
                cnvCtx.clearRect(0, 0, cnv.width, cnv.height);
                cnvCtx.putImageData(layer.imageData, layer.pos.x, layer.pos.y);

            }
        });

    }

}

