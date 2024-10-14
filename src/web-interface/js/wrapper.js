function applyFilter(fn) {
    return function (imageInfo, ...args) {
        let imageData = imageInfo.imageData;
        let pixels = imageData.data;
        let inputSize = imageData.width * imageData.height;
        let outputSize = imageInfo.newWidth * imageInfo.newHeight;
        let extra = outputSize - inputSize;
        if (extra > 0) {
            inputSize = outputSize;
            pixels = new Uint8ClampedArray(outputSize * 4)
            let index = 0;
            Array.from(imageData.data).forEach(pixel => {
                pixels[index] = imageData.data[index];
                index++;
            })



        }
        let Heap = new Uint8Array(Module.memory.buffer, 0, inputSize * 4);

        Heap.set(pixels);

        fn(pixels, imageData.width, imageData.height, ...args);
        let result = new Uint8Array(Module.memory.buffer, 0, outputSize * 4);
        let pixelArray = new Uint8ClampedArray(result.length);
        pixelArray.set(result, 0);

        return new ImageData(pixelArray, imageInfo.newWidth, imageInfo.newHeight);
    };
}

export default class ImageWrapper {
    constructor() {

        this.contrast = applyFilter(Module.contrast_wrapper);
        this.grayscale = applyFilter(Module.grayscale_wrapper);
        this.brightness = applyFilter(Module.brightness_wrapper);
        this.gaussian = applyFilter(Module.gaussian_wrapper);
        this.resize = applyFilter(Module.resize_wrapper);
        this.histogram = applyFilter(Module.histogram_wrapper);
        this.filter = applyFilter(Module.filter_wrapper);
        this.opacity = applyFilter(Module.opacity_wrapper);
        this.crop = applyFilter(Module.crop_wrapper);
        this.rotate = applyFilter(Module.rotate_wrapper);


    }


}



