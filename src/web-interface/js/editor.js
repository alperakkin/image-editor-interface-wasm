import { displayHistogram } from './graph.js';
import { displayCropCanvas } from './components/features/crop.js';

export default class Editor {
    constructor() {
        this.stack = [];
    }
    actions = {
        "contrast": (...args) => {
            return;
        },
        "grayscale": (...args) => {
            this.displayGrayScale();
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



        }
    }

    getLatestImageData(contextBefore, canvasBefore) {
        let imageData;


        if (this.stack.length == 0) {
            imageData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);
        }
        else {
            imageData = this.stack[this.stack.length - 1];
        }
        return imageData;

    }

    execute(method, canvasBefore, contextBefore) {

        let imageData = this.getLatestImageData(contextBefore, canvasBefore);

        let info = {
            'imageData': imageData,
            'newWidth': imageData.width,
            'newHeight': imageData.height
        }
        let newImgData = editor[method](info);
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

    displayGrayScale() {

        let newImgData = this.execute('grayscale', canvasBefore, contextBefore);
        this.displayResult(newImgData);


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

    histogram(info, ...colors) {
        let imageSize = info.imageData.width * info.imageData.height * 4;
        let red_ptr = imageSize;
        let green_ptr = red_ptr + (255 * 2);
        let blue_ptr = green_ptr + (255 * 2);
        let red = new Uint16Array(Module.memory.buffer, red_ptr, 255);
        let green = new Uint16Array(Module.memory.buffer, green_ptr, 255);
        let blue = new Uint16Array(Module.memory.buffer, blue_ptr, 255);


        wrapper.histogram(info, red_ptr, green_ptr, blue_ptr);

        const data = {
            red: { 'values': red, 'css': '#be002d' },
            green: { 'values': green, 'css': '#008825' },
            blue: { 'values': blue, 'css': '#007be6' }
        };
        localStorage.setItem('histogram', JSON.stringify(data));
        displayHistogram(data, ...colors);
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

    filter(info) {
        let imageSize = info.imageData.width * info.imageData.height * 4;


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

        return wrapper.filter(info, color_ptr, strength);

    }

    opacity(info) {
        let factor = parseFloat(document.getElementById('opacityFactor').value / 100);
        return wrapper.opacity(info, factor);
    }

    crop(canvasBefore, canvasAfter, contextBefore, contextAfter) {
        let cropRegion = document.getElementById('cropRegion').value

        cropRegion = JSON.parse(cropRegion);
        let imageData = this.getLatestImageData(contextBefore, canvasBefore);

        let left = cropRegion.left;
        let right = imageData.width - cropRegion.right;
        let top = cropRegion.top;
        let bottom = imageData.height - cropRegion.bottom;


        let info = {
            'imageData': imageData,
            'newWidth': cropRegion.right - cropRegion.left,
            'newHeight': cropRegion.bottom - cropRegion.top
        }

        let newImageData = wrapper.crop(info, left, right, top, bottom);

        this.displayResult(newImageData);

    }
}