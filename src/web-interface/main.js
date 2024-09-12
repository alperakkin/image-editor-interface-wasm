let Module;
let grayscale;
let result;

const importObject = {
    editor: { grayscale: (arg) => console.log(arg), alloc_image: (arg) => console.log(arg) },
};

WebAssembly.instantiateStreaming(fetch("editor.wasm")).then(
    (obj) => {
        console.log(obj);
        Module = obj.instance.exports;
        grayscale = Module.grayscale;




    }
);


function to_grayscale(pixels, width, height) {

    let buffer = new Uint8Array(Module.memory.buffer, 0, width * height * 4);
    buffer.set(pixels);

    grayscale(buffer.byteOffset, width, height);

    let result = new Uint8Array(Module.memory.buffer, 0, width * height * 4);

    return result;
}

document.getElementById('imageUploader').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();


    reader.onload = function (e) {
        const canvasBefore = document.getElementById('imageCanvasBefore');
        const canvasAfter = document.getElementById('imageCanvasAfter');
        const contextBefore = canvasBefore.getContext('2d');
        const contextAfter = canvasAfter.getContext('2d');
        const img = new Image();
        const imgAfter = new Image();
        let width;
        let height;
        img.src = e.target.result;


        img.onload = function () {
            width = img.width;
            height = img.height;
            canvasBefore.width = img.width;
            canvasBefore.height = img.height;


            imgAfter.width = width;
            imgAfter.height = height;

            contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
            contextBefore.drawImage(img, 0, 0, canvasBefore.width, canvasBefore.height);

            const imageData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);

            let pixels = imageData.data;

            console.log("before", pixels);


            result = to_grayscale(pixels, img.width, img.height);





            imgAfter.width = width;
            imgAfter.height = height;
            canvasAfter.width = imgAfter.width;
            canvasAfter.height = imgAfter.height;




            imgAfter.src = canvasAfter.toDataURL();

            let pixelArray = new Uint8ClampedArray(result.length);
            pixelArray.set(result, 0);



            newImgData = new ImageData(pixelArray, imgAfter.width, imgAfter.height);
            newImgData.data = pixelArray;

            contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
            contextAfter.putImageData(newImgData, 0, 0);
            console.log("after", newImgData.data);


        };






    };


    reader.readAsDataURL(file);
});
