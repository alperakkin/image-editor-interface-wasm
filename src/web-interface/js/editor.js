


export default class Editor {
    actions = {
        "contrast": (...args) => {
            this.displayItems("factor");
        },
        "grayscale": (...args) => {
            wrapper.execute(...args);
        },

        "brightness": (...args) => {
            this.displayItems("ratio");

        },
        "gaussian": (...args) => {
            this.displayItems("kernel_size", "sigma");
        }

    }

    displayItems(...itemIDs) {
        Array.from(itemIDs).forEach(itemID => {
            let element = document.getElementById(itemID);
            element.style.display = "block";
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