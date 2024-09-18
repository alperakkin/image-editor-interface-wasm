function applyFilter(fn) {
    return function (...args) {
        let pixels = args[0];
        let width = args[1];
        let height = args[2];
        let Heap = new Uint8Array(window.Module.memory.buffer, 0, width * height * 4);
        Heap.set(pixels);
        fn(...args);
        let result = new Uint8Array(window.Module.memory.buffer, 0, width * height * 4);
        return result;
    };
}

export default class ImageWrapper {
    constructor() {
        this.grayscale = applyFilter(window.Module.grayscale_wrapper);
        this.contrast = applyFilter(window.Module.contrast_wrapper);

    }

}



