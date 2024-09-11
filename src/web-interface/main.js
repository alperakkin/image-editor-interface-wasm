let Module;
let grayscale;
let malloc;
let free;
let HEAPU8;
let HEAP32;
let result;

const importObject = {
    editor: { grayscale: (arg) => console.log(arg) },
};

WebAssembly.instantiateStreaming(fetch("editor.wasm")).then(
    (obj) => {
        console.log(obj);
        Module = obj.instance.exports;
        grayscale = Module.grayscale;
        malloc = Module.malloc;
        free = Module.free;
        result = Module.result;
        const memory = Module.memory;
        HEAPU8 = new Uint8Array(memory.buffer);
        HEAP32 = new Int32Array(memory.buffer);
        process_image()
        console.log(result);

    }
);

document.getElementById("addButton").addEventListener("click", () => {
    if (grayscale) {
        process_image();
    } else {
        console.error("WebAssembly module not loaded yet or malloc/free not available");
    }
});

function process_image() {
    let width = 1;
    let height = 1;
    let numPixels = width * height * 4;


    let pixelPtr = malloc(numPixels);


    let pixelData = new Uint8Array(numPixels);
    pixelData[0] = 255;
    pixelData[1] = 128;
    pixelData[2] = 0;


    HEAPU8.set(pixelData, pixelPtr);
    console.log(HEAPU8);
    console.log(pixelPtr);

    let imagePtr = malloc(12);

    HEAP32[imagePtr >> 2] = width;
    HEAP32[(imagePtr + 4) >> 2] = height;
    HEAP32[(imagePtr + 8) >> 2] = pixelPtr;


    let resultPtr = grayscale(imagePtr);
    console.log(resultPtr);

    let resultWidth = HEAP32[resultPtr >> 2];
    let resultHeight = HEAP32[(resultPtr + 4) >> 2];
    let resultPixelPtr = HEAP32[(resultPtr + 8) >> 2];


    let grayscaleData = HEAP32.subarray(result.value, result.value + numPixels);
    console.log(HEAP32);
    console.log(result.value);

    free(pixelPtr);
    free(imagePtr);

}
