function applyFilter(fn) {
    return function (...args) {
        let pixels = args[0];
        let width = args[1];
        let height = args[2];
        let Heap = new Uint8Array(Module.memory.buffer, 0, width * height * 4);
        Heap.set(pixels);
        fn(...args);
        let result = new Uint8Array(Module.memory.buffer, 0, width * height * 4);
        return result;
    };
}

export default class ImageWrapper {
    constructor() {

        this.contrast = applyFilter(Module.contrast_wrapper);
        this.grayscale = applyFilter(Module.grayscale_wrapper);
        this.stack = [];

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



        let pixels = imageData.data;

        let result = editor[method](pixels, canvasBefore.width,
            canvasBefore.height);
        imgAfter.src = canvasAfter.toDataURL();

        let pixelArray = new Uint8ClampedArray(result.length);
        pixelArray.set(result, 0);
        imgAfter.width = canvasBefore.width;
        imgAfter.height = canvasBefore.height;
        canvasAfter.width = imgAfter.width;
        canvasAfter.height = imgAfter.height;



        let newImgData = new ImageData(pixelArray, imgAfter.width, imgAfter.height);


        contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        contextAfter.putImageData(newImgData, 0, 0);

    }


}



