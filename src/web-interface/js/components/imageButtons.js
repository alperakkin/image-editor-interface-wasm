document.getElementById("apply").addEventListener('click',
    function (event) {

        if (editor.stack.length == 0) {
            const beforeData = originalCtx.getImageData(0, 0, originalCnv.width, originalCnv.height);
            editor.stack.push(beforeData);
        }

        const imageData = contextAfter.getImageData(0, 0, Canvas.width, Canvas.height);
        originalCtx.clearRect(0, 0, Canvas.width, Canvas.height);
        originalCtx.putImageData(imageData, 0, 0);

        if (editor.stack.length <= 5) {
            editor.stack.push(imageData);
        }



    }
)

document.getElementById("undo").addEventListener('click',
    function (event) {
        if (editor.stack.length == 0) return;

        originalCtx.clearRect(0, 0, originalCnv.width, originalCnv.height);
        originalCtx.putImageData(editor.stack.pop(), 0, 0);


    }
)

document.getElementById("reset").addEventListener('click',
    function (event) {
        if (editor.stack.length == 0) return;

        originalCtx.clearRect(0, 0, originalCnv.width, originalCnv.height);
        originalCtx.putImageData(editor.stack[0], 0, 0);

        editor.stack = [];


    }
)