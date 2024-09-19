


export default class Editor {


    grayscale(pixels, width, height) {
        return wrapper.grayscale(pixels, width, height);

    }
    contrast(pixels, width, height) {
        let factor = parseFloat(document.getElementById('factor').value / 100);

        return wrapper.contrast(pixels, width, height, factor);

    }
}