


export default class Editor {
    actions = {
        "contrast": (...args) => {
            return;
        },
        "grayscale": (...args) => {
            wrapper.execute(...args);
        },

        "brightness": (...args) => {
            return;

        },
        "gaussian": (...args) => {
            return;
        }

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
    grayscale(pixels, width, height) {
        return wrapper.grayscale(pixels, width, height);

    }
    contrast(pixels, width, height) {
        let factor = parseFloat(document.getElementById('factor').value / 100);

        return wrapper.contrast(pixels, width, height, factor);

    }
    brightness(pixels, width, height) {
        let ratio = parseFloat(document.getElementById('ratio').value / 100);

        return wrapper.brightness(pixels, width, height, ratio);

    }
    gaussian(pixels, width, height) {
        let kernel_size = parseInt(document.getElementById('kernel_size').value);
        let sigma = parseFloat(document.getElementById('sigma').value / 100);

        return wrapper.gaussian(pixels, width, height, kernel_size, sigma);

    }
}