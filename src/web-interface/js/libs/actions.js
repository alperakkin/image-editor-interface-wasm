export default class Actions {
    constructor() {
        this.history = []
        this.actions = {
            "contrast": (...args) => {
                return;
            },
            "grayscale": (...args) => {
                let imageData = editor.execute('grayscale');
                return imageData;

            },
            "brightness": (...args) => {
                return;
            },
            "gaussian": (...args) => {
                return;
            },
            "resize": (...args) => {
                return;
            },
            "filter": (...args) => {
                return;
            },
            "opacity": (...args) => {
                return;
            },
            "crop": (...args) => {
                displayCropCanvas().then(resp => {
                    editor.crop(...args);
                })

            },
            "rotate": (...args) => {
                return;
            },
            "invert": (...args) => {
                let imageData = editor.execute('invert');

            },
            "add_border": (...args) => {
                return;
            },
            "mask": (...args) => {
                return;
            }
            ,
            "check_color": (...args) => {
                return;
            },
            "vignette": (...args) => {
                return;
            },
            "edge": (...args) => {
                return;
            }
        }
    }

    addAction(action, data) {
        let layer = window.layers.getLayer(window.layers.selected);
        let imageData = this.actions[action](data);
        let actionObj = { [`${layer.name}->${action}`]: layer.imageData };
        this.history.push(actionObj);
        layer.imageData = imageData;


    }
    undoAction() {
        // TODO: remove last action from layer
    }

    removeLayerActions(layer) {
        // TODO: remove all action related to the layer
    }

}

