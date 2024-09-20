function applyFilter(fn) {
    return function (imageInfo, ...args) {
        let imageData = imageInfo.imageData;
        let inputSize = imageData.width * imageData.height;
        let outputSize = imageInfo.newWidth * imageInfo.newHeight;
        let extra = outputSize - inputSize;
        if (extra > 0) imageData.data.push(Array(extra * 4));
        let Heap = new Uint8Array(Module.memory.buffer, 0, inputSize * 4);
        Heap.set(imageData.data);

        fn(imageData.data, imageData.width, imageData.height, ...args);
        let result = new Uint8Array(Module.memory.buffer, 0, outputSize * 4);
        return result;
    };
}

export default class ImageWrapper {
    constructor() {

        this.contrast = applyFilter(Module.contrast_wrapper);
        this.grayscale = applyFilter(Module.grayscale_wrapper);
        this.brightness = applyFilter(Module.brightness_wrapper);
        this.gaussian = applyFilter(Module.gaussian_wrapper);
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


        let info = {
            'imageData': imageData,
            'newWidth': imageData.width,
            'newHeight': imageData.height
        }

        let result = editor[method](info);
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



