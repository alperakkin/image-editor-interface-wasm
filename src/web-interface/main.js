let Module;
let grayscale;


const importObject = {
    editor: { grayscale: (arg) => console.log(arg), alloc_image: (arg) => console.log(arg) },
};

WebAssembly.instantiateStreaming(fetch("editor.wasm")).then(
    (obj) => {
        console.log(obj);
        Module = obj.instance.exports;
        grayscale = Module.grayscale;

        process_image();


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

    let array = new Int32Array([100, 200, 40, 255]);
    let buffer = new Int32Array(Module.memory.buffer, 0, width * height * 4);
    buffer.set(array);
    console.log('inp', buffer)
    grayscale(buffer.byteOffset, width, height);

    let result = new Int32Array(Module.memory.buffer, 0, width * height * 4);
    console.log('outp', result);








}
