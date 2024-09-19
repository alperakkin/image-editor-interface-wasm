

const canvasBefore = document.getElementById('imageCanvasBefore');
const canvasAfter = document.getElementById('imageCanvasAfter');
const contextBefore = canvasBefore.getContext('2d');
const contextAfter = canvasAfter.getContext('2d');


Array.from(document.getElementsByClassName("arguments")).forEach(
    function (elem) {
        elem.addEventListener('input',
            function (event) {
                console.log("hello");
                wrapper.execute(canvasBefore, canvasAfter,
                    contextBefore, contextAfter);

            }

        )
    }
)





document.getElementById("options").addEventListener('change',

    function (event) {
        let options = document.getElementsByClassName('arguments');
        Array.from(options).forEach(el => {
            el.style.display = "none";

        });
        let option = event.target.value;
        if (option === "contrast") {
            let factorElement = document.getElementById("factor");
            factorElement.style.display = "block";

        }
        if (option === "grayscale") wrapper.execute(canvasBefore, canvasAfter,
            contextBefore, contextAfter);

    }

)

document.getElementById("apply").addEventListener('click',
    function (event) {

        const imageData = contextAfter.getImageData(0, 0, canvasAfter.width, canvasAfter.height);
        contextBefore.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        contextBefore.putImageData(imageData, 0, 0);


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
