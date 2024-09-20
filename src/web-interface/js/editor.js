


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
}