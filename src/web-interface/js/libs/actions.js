export default class Actions {
    constructor() {
        this.history = []
        this.actions = {
            "contrast": (...args) => {
                return args[0].imageData;
            },
            "grayscale": (...args) => {
                let imageData = editor.execute('grayscale');
                return imageData;

            },
            "brightness": (...args) => {
                return args[0].imageData;
            },
            "gaussian": (...args) => {
                return args[0].imageData;
            },
            "resize": (...args) => {
                return args[0].imageData;
            },
            "filter": (...args) => {
                return args[0].imageData;
            },
            "opacity": (...args) => {
                return args[0].imageData;
            },
            "crop": (...args) => {
                displayCropCanvas().then(resp => {
                    editor.crop(...args);
                })

            },
            "rotate": (...args) => {
                return args[0].imageData;
            },
            "invert": (...args) => {
                let imageData = editor.execute('invert');
                return imageData;

            },
            "add_border": (...args) => {
                return args[0].imageData;
            },
            "mask": (...args) => {
                return args[0].imageData;
            }
            ,
            "check_color": (...args) => {
                return args[0].imageData;
            },
            "vignette": (...args) => {
                return args[0].imageData;
            },
            "edge": (...args) => {
                return args[0].imageData;
            }
        }
    }

    addAction(action, data) {
        let layer = window.layers.getLayer(window.layers.selected);
        let imageData = this.actions[action](data);

        let actionObj = { [`${layer.name}->${action}`]: layer.imageData };
        this.history.push(actionObj);
        if (this.history.length > 10) {
            let diff = this.history.length - 10;
            this.history = Array.from(this.history).splice(diff, this.history.length);
        }


        layer.imageData = imageData;




    }
    undoAction() {
        // TODO: remove last action from layer
    }

    removeLayerActions(layer) {
        // TODO: remove all action related to the layer
    }

}

