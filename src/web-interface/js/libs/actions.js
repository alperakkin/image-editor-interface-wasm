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




    }
    undoAction() {
        // TODO: remove last action from layer
    }

    removeLayerActions(layer) {
        // TODO: remove all action related to the layer
    }

}

