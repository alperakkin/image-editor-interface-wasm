import ImageWrapper from './wrapper.js';

const wrapper = new ImageWrapper();





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


            let result = wrapper.grayscale(pixels, img.width, img.height);

            imgAfter.width = width;
            imgAfter.height = height;
            canvasAfter.width = imgAfter.width;
            canvasAfter.height = imgAfter.height;




            imgAfter.src = canvasAfter.toDataURL();

            let pixelArray = new Uint8ClampedArray(result.length);
            pixelArray.set(result, 0);



            let newImgData = new ImageData(pixelArray, imgAfter.width, imgAfter.height);


            contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
            contextAfter.putImageData(newImgData, 0, 0);



        };






    };


    reader.readAsDataURL(file);
});
