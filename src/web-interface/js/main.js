import Editor from './editor.js';

const canvasBefore = document.getElementById('imageCanvasBefore');
const canvasAfter = document.getElementById('imageCanvasAfter');
const contextBefore = canvasBefore.getContext('2d');
const contextAfter = canvasAfter.getContext('2d');


const editor = new Editor();


document.getElementById("options").addEventListener('change',

    function (event) {
        let option = event.target.value;
        if (option === "contrast") {
            let factorElement = document.getElementById("factor");
            factorElement.style.display = "block";

        }

    }
)

document.getElementById("apply").addEventListener('click',
    function (event) {

        let method = document.getElementById("options").value;

        const imgAfter = new Image();
        const imageData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);
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
)


document.getElementById('imageUploader').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();


    reader.onload = function (e) {
        contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);

        const img = new Image();

        let width;
        let height;
        img.src = e.target.result;


        img.onload = function () {
            width = img.width;
            height = img.height;

            canvasBefore.width = img.width;
            canvasBefore.height = img.height;

            contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
            contextBefore.drawImage(img, 0, 0, canvasBefore.width, canvasBefore.height);

        };



    };


    reader.readAsDataURL(file);
});
