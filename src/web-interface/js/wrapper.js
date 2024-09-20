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


    }


}



