import { displayHistogram } from './libs/graph.js';
import { displayCropCanvas } from './components/features/crop.js';
import { getRotatedSize } from './components/features/rotate.js';
import { setColorPointer } from './libs/utils.js';
import Actions from './libs/actions.js';
export default class Editor {
    constructor() {
        this.actions = new Actions();
    }



    execute(action) {
        let imageData = window.layers.getLayer(window.layers.selected).imageData;

        let data = {
            'imageData': imageData,
            'newWidth': imageData.width,
            'newHeight': imageData.height
        }
        let newImgData = this.actions.addAction(action, data);

        return newImgData;

    }



    displayImage(newImageData, canvas, fitImage = true) {

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const img = new Image();
        img.src = canvas.toDataURL();

        img.width = newImageData.width;
        img.height = newImageData.height;

        if (fitImage) {
            canvas.width = newImageData.width;
            canvas.height = newImageData.height;
        }


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(newImageData, 0, 0);

    }

    clearImage(canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        let colorPtr = setColorPointer('filterColor', data.imageData);
        let strength = parseFloat(document.getElementById('strength').value / 100);

        return wrapper.filter(data, colorPtr, strength);

    }

    opacity(data) {
        let factor = parseFloat(document.getElementById('opacityFactor').value / 100);
        return wrapper.opacity(data, factor);
    }

    crop(canvasBefore, Canvas, contextBefore, contextAfter) {
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
        let widthPtr = data.newHeight * data.newHeight * 4 * 2;
        let heightPtr = widthPtr + 1;
        let width = new Uint8Array(Module.memory.buffer, widthPtr, 1);
        let height = new Uint8Array(Module.memory.buffer, heightPtr, 1);
        wrapper.rotate(rotatedData, widthPtr, heightPtr, rotatedData.angle);

        let result = new Uint8Array(Module.memory.buffer, 0, width[0] * height[0] * 4);
        let pixelArray = new Uint8ClampedArray(result.length);
        pixelArray.set(result, 0);

        return new ImageData(pixelArray, width[0], height[0]);

    }

    invert(data) {
        return wrapper.invert(data);

    }
    add_border(data) {
        let colorPtr = setColorPointer('borderColor', data.imageData);
        let width = parseInt(document.getElementById('borderWidth').value);

        return wrapper.add_border(data, colorPtr, width);

    }
    mask(data) {
        let colorPtr = setColorPointer('maskColor', data.imageData);
        let threshold = 1 - parseFloat(document.getElementById('maskThreshold').value / 200);

        return wrapper.mask(data, colorPtr, threshold);

    }
    check_color(data) {
        let colorPtr = setColorPointer('checkColor', data.imageData);
        let threshold = 1 - parseFloat(document.getElementById('checkColorThreshold').value / 200);
        let ratio = wrapper.check_color(data, colorPtr, threshold);
        let element = document.getElementById('imageInfo.Color');
        element.textContent = ratio.toFixed(3) * 100 + "%";
    }

    vignette(data) {
        let ratio = 1 - parseFloat(document.getElementById('vignetteRatio').value / 200);

        return wrapper.vignette(data, ratio);
    }

    edge(data) {
        let highThreshold = parseInt(document.getElementById('highThreshold').value);
        let lowThreshold = parseInt(document.getElementById('lowThreshold').value);
        return wrapper.edge(data, highThreshold, lowThreshold);
    }
}