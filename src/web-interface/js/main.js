

const canvasBefore = document.getElementById('imageCanvasBefore');
const canvasAfter = document.getElementById('imageCanvasAfter');
const contextBefore = canvasBefore.getContext('2d', { willReadFrequently: true });
const contextAfter = canvasAfter.getContext('2d', { willReadFrequently: true });



Array.from(document.getElementsByClassName("arguments")).forEach(
    function (elem) {
        elem.addEventListener('input',
            function (event) {
                editor.displayResult(canvasBefore, canvasAfter,
                    contextBefore, contextAfter);

            }

        )
    }
)

document.getElementById("options").addEventListener('change',

    function (event) {
        let option = event.target.value;
        editor.displayItems(option);
        editor.actions[option](canvasBefore, canvasAfter,
            contextBefore, contextAfter);

    }

)

Array.from(document.getElementsByClassName("histogramColor")).forEach(
    function (elem) {
        elem.addEventListener('click',
            function (event) {
                editor.selectHistogramColors();

            }

        )
    }
)

document.getElementById("apply").addEventListener('click',
    function (event) {

        if (editor.stack.length == 0) {
            const beforeData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);
            editor.stack.push(beforeData);
        }

        const imageData = contextAfter.getImageData(0, 0, canvasAfter.width, canvasAfter.height);
        contextBefore.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        contextBefore.putImageData(imageData, 0, 0);

        if (editor.stack.length <= 5) {
            editor.stack.push(imageData);
        }



    }
)

document.getElementById("undo").addEventListener('click',
    function (event) {
        if (editor.stack.length == 0) return;

        contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
        contextBefore.putImageData(editor.stack.pop(), 0, 0);


    }
)

document.getElementById("reset").addEventListener('click',
    function (event) {
        if (editor.stack.length == 0) return;

        contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
        contextBefore.putImageData(editor.stack[0], 0, 0);

        editor.stack = [];


    }
)


document.getElementById('imageUploader').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();


    reader.onload = function (e) {
        contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        editor.stack = [];
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

            let imageData = editor.getLatestImageData(contextBefore, canvasBefore);
            editor.histogram(
                {
                    'imageData': imageData,
                    'newWidth': imageData.width,
                    'newHeight': imageData.height
                },
                "red", "green", "blue"
            )


        }






    };


    reader.readAsDataURL(file);
});
