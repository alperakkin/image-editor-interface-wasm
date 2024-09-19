

const canvasBefore = document.getElementById('imageCanvasBefore');
const canvasAfter = document.getElementById('imageCanvasAfter');
const contextBefore = canvasBefore.getContext('2d', { willReadFrequently: true });
const contextAfter = canvasAfter.getContext('2d', { willReadFrequently: true });



Array.from(document.getElementsByClassName("arguments")).forEach(
    function (elem) {
        elem.addEventListener('input',
            function (event) {
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

        if (wrapper.stack.length == 0) {
            const beforeData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);
            wrapper.stack.push(beforeData);
        }

        const imageData = contextAfter.getImageData(0, 0, canvasAfter.width, canvasAfter.height);
        contextBefore.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        contextBefore.putImageData(imageData, 0, 0);

        if (wrapper.stack.length <= 5) {
            wrapper.stack.push(imageData);
        }



    }
)

document.getElementById("undo").addEventListener('click',
    function (event) {
        if (wrapper.stack.length == 0) return;

        contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
        contextBefore.putImageData(wrapper.stack.pop(), 0, 0);


    }
)

document.getElementById("reset").addEventListener('click',
    function (event) {
        if (wrapper.stack.length == 0) return;

        contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
        contextBefore.putImageData(wrapper.stack[0], 0, 0);

        wrapper.stack = [];


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
