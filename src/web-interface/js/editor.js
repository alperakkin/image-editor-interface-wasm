import { displayHistogram } from './graph.js';
import { displayCropCanvas } from './components/features/crop.js';
import { getRotatedSize } from './components/features/rotate.js';
export default class Editor {
    constructor() {
        this.stack = [];
    }
    actions = {
        "contrast": (...args) => {
            return;
        },
        "grayscale": (...args) => {
            let imageData = editor.execute('grayscale');
            editor.displayResult(imageData);;
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
                this.crop(...args);
            })

        },
        "rotate": (...args) => {
            return;
        },
        "invert": (...args) => {
            let imageData = editor.execute('invert');
            editor.displayResult(imageData);;
        },
    }

    getLatestImageData() {
        let imageData;


        if (this.stack.length == 0) {
            imageData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);
        }
        else {
            imageData = this.stack[this.stack.length - 1];
        }
        return imageData;

    }

    execute(method) {

        let imageData = this.getLatestImageData(contextBefore, canvasBefore);

        let data = {
            'imageData': imageData,
            'newWidth': imageData.width,
            'newHeight': imageData.height
        }
        let newImgData = editor[method](data);
        return newImgData;

    }



    displayResult(newImageData) {

        const imgAfter = new Image();
        imgAfter.src = canvasAfter.toDataURL();

        imgAfter.width = newImageData.width;
        imgAfter.height = newImageData.height;
        canvasAfter.width = newImageData.width;
        canvasAfter.height = newImageData.height;

        contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        contextAfter.putImageData(newImageData, 0, 0);

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
    grayscale(data) {
        return wrapper.grayscale(data);

    }
    contrast(data) {
        let factor = parseFloat(document.getElementById('factor').value / 100);
        return wrapper.contrast(data, factor);

    }
    brightness(data) {
        let ratio = parseFloat(document.getElementById('ratio').value / 100);

        return wrapper.brightness(data, ratio);

    }
    gaussian(data) {
        let kernel_size = parseInt(document.getElementById('kernel_size').value);
        let sigma = parseFloat(document.getElementById('sigma').value / 100);

        return wrapper.gaussian(data, kernel_size, sigma);
    }

    resize(data) {
        let aspect = document.getElementById('aspect_ratio').checked;

        data.newWidth = parseInt(document.getElementById('width').value);
        data.newHeight = parseInt(document.getElementById('height').value);

        let ratio = data.imageData.height / data.imageData.width;

        data.newWidth = data.newWidth ? data.newWidth : data.imageData.width;
        data.newHeight = data.newHeight ? data.newHeight : data.imageData.height;

        if (aspect) {
            data.newHeight = data.newWidth * ratio;
            document.getElementById('height').value = data.newHeight;
        }

        return wrapper.resize(data, data.newWidth, data.newHeight);
    }

    histogram(data, ...colors) {
        let imageSize = data.imageData.width * data.imageData.height * 4;
        let red_ptr = imageSize;
        let green_ptr = red_ptr + (255 * 2);
        let blue_ptr = green_ptr + (255 * 2);
        let red = new Uint16Array(Module.memory.buffer, red_ptr, 255);
        let green = new Uint16Array(Module.memory.buffer, green_ptr, 255);
        let blue = new Uint16Array(Module.memory.buffer, blue_ptr, 255);


        wrapper.histogram(data, red_ptr, green_ptr, blue_ptr);

        const colorData = {
            red: { 'values': red, 'css': '#be002d' },
            green: { 'values': green, 'css': '#008825' },
            blue: { 'values': blue, 'css': '#007be6' }
        };
        localStorage.setItem('histogram', JSON.stringify(colorData));
        displayHistogram(colorData, ...colors);
    }

    selectHistogramColors() {
        let colors = [];
        Array.from(document.getElementsByClassName("histogramColor")).forEach(
            colorElement => {
                if (colorElement.checked) colors.push(colorElement.id);
            }
        )

        let data = localStorage.getItem('histogram');
        data = JSON.parse(data);
        Array.from(colors).forEach(
            color => data[color]["values"] = Object.values(data[color]["values"])
        )

        displayHistogram(data, ...colors);
    }

    filter(data) {
        let imageSize = data.imageData.width * data.imageData.height * 4;


        let colorHex = document.getElementById('color').value;
        let colorAscii = []

        Array.from(colorHex).forEach(item => {
            colorAscii.push(item.charCodeAt(0))
        });

        colorAscii.push(0); // char* termination
        let color_ptr = imageSize;
        let color = new Uint8Array(
            Module.memory.buffer,
            color_ptr,
            colorAscii.length
        );

        color.set(colorAscii);
        let strength = parseFloat(document.getElementById('strength').value / 100);

        return wrapper.filter(data, color_ptr, strength);

    }

    opacity(data) {
        let factor = parseFloat(document.getElementById('opacityFactor').value / 100);
        return wrapper.opacity(data, factor);
    }

    crop(canvasBefore, canvasAfter, contextBefore, contextAfter) {
        let cropRegion = document.getElementById('cropRegion').value

        cropRegion = JSON.parse(cropRegion);
        let imageData = this.getLatestImageData(contextBefore, canvasBefore);

        let left = cropRegion.left;
        let right = imageData.width - cropRegion.right;
        let top = cropRegion.top;
        let bottom = imageData.height - cropRegion.bottom;


        let data = {
            'imageData': imageData,
            'newWidth': cropRegion.right - cropRegion.left,
            'newHeight': cropRegion.bottom - cropRegion.top
        }

        let newImageData = wrapper.crop(data, left, right, top, bottom);

        this.displayResult(newImageData);

    }

    rotate(data) {

        let rotatedData = getRotatedSize(data);
        return wrapper.rotate(rotatedData, rotatedData.angle);
    }

    invert(data) {
        return wrapper.invert(data);

    }
}