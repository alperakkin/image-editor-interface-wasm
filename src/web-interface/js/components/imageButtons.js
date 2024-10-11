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