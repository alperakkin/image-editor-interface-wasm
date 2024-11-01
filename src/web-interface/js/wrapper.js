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

        let response = fn(pixels, imageData.width, imageData.height, ...args);

        if (response !== undefined) return response;
        let result = new Uint8Array(Module.memory.buffer, 0, outputSize * 4);
        let pixelArray = new Uint8ClampedArray(result.length);
        pixelArray.set(result, 0);

        return new ImageData(pixelArray, imageInfo.newWidth, imageInfo.newHeight);
    };
}

export default class ImageWrapper {
    constructor() {
        Object.getOwnPropertyNames(Module).forEach(item => {
            if (item.includes('_wrapper'))
                this[item.slice(0, -8)] = applyFilter(Module[item]);
        })

        setTimeout(() => {
            Object.getOwnPropertyNames(this).forEach(
                item => {
                    const opt = document.getElementById('options')
                    const choice = document.createElement("option");
                    choice.setAttribute("value", item);
                    choice.textContent = item.split("_")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");
                    opt.appendChild(choice);

                })
        }, 100);

    }
}






