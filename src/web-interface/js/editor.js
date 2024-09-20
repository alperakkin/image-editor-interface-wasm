


export default class Editor {
    constructor() {
        this.stack = [];
    }
    actions = {
        "contrast": (...args) => {
            return;
        },
        "grayscale": (...args) => {
            this.execute(...args);
        },

        "brightness": (...args) => {
            return;

        },
        "gaussian": (...args) => {
            return;
        },
        "resize": (...args) => {
            return;
        }

    }

    execute(canvasBefore, canvasAfter, contextBefore, contextAfter) {
        let method = document.getElementById("options").value;
        let imageData;
        const imgAfter = new Image();
        if (this.stack.length == 0) {
            imageData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);
        }
        else {
            imageData = this.stack[this.stack.length - 1];
        }


        let info = {
            'imageData': imageData,
            'newWidth': imageData.width,
            'newHeight': imageData.height
        }

        let newImgData = editor[method](info);
        imgAfter.src = canvasAfter.toDataURL();

        imgAfter.width = canvasBefore.width;
        imgAfter.height = canvasBefore.height;
        canvasAfter.width = newImgData.width;
        canvasAfter.height = newImgData.height;

        contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        contextAfter.putImageData(newImgData, 0, 0);

    }

    displayItems(...itemIDs) {
        let options = document.getElementsByClassName('arguments');

        Array.from(options).forEach(el => {
            el.style.display = "none";

        });

        Array.from(itemIDs).forEach(itemID => {
            let element = document.getElementById(itemID);
            if (element) element.style.display = "block";
        })

    }
    grayscale(info) {
        return wrapper.grayscale(info);

    }
    contrast(info) {
        let factor = parseFloat(document.getElementById('factor').value / 100);
        return wrapper.contrast(info, factor);

    }
    brightness(info) {
        let ratio = parseFloat(document.getElementById('ratio').value / 100);

        return wrapper.brightness(info, ratio);

    }
    gaussian(info) {
        let kernel_size = parseInt(document.getElementById('kernel_size').value);
        let sigma = parseFloat(document.getElementById('sigma').value / 100);

        return wrapper.gaussian(info, kernel_size, sigma);
    }

    resize(info) {
        let aspect = document.getElementById('aspect_ratio').checked;

        info.newWidth = parseInt(document.getElementById('width').value);
        info.newHeight = parseInt(document.getElementById('height').value);

        let ratio = info.imageData.height / info.imageData.width;

        info.newWidth = info.newWidth ? info.newWidth : info.imageData.width;
        info.newHeight = info.newHeight ? info.newHeight : info.imageData.height;

        if (aspect) {
            info.newHeight = info.newWidth * ratio;
            document.getElementById('height').value = info.newHeight;
        }

        return wrapper.resize(info, info.newWidth, info.newHeight);
    }
}