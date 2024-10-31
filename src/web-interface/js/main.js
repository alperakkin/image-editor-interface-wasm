

function listenInputs() {
    Array.from(document.getElementsByClassName("arguments")).forEach(
        function (elem) {
            elem.addEventListener('input',
                function (event) {

                    let imageData = editor.execute(elem.id);

                    if (imageData === undefined) return;
                    editor.displayResult(imageData);


                }

            )
        }
    )

}



function uploadImage(event) {

    listenInputs();
    const file = event.target.files[0];
    if (!file) return;


    const reader = new FileReader();


    reader.onload = function (e) {
        canvasBefore = document.getElementById('imageCanvasBefore');
        canvasAfter = document.getElementById('imageCanvasAfter');
        contextBefore = canvasBefore.getContext('2d', { willReadFrequently: true });
        contextAfter = canvasAfter.getContext('2d', { willReadFrequently: true });



        contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
        contextAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
        editor.stack = [];
        const img = new Image();

        img.src = e.target.result;

        img.onload = function () {
            contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
            contextBefore.drawImage(img, 0, 0, canvasBefore.width, canvasBefore.height);
            contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);
            contextBefore.drawImage(img,
                0, 0,
                canvasBefore.width, canvasBefore.height);

            let imageData = editor.getLatestImageData(contextBefore, canvasBefore);

            document.getElementById("histogram").style.display = "flex";
            document.getElementById('imageInfo.Size').textContent = `Width: ${img.width} Height: ${img.height}`
            editor.histogram(
                {
                    'imageData': imageData,
                    'newWidth': imageData.width,
                    'newHeight': imageData.height
                },
                "red", "green", "blue"
            )
        };









    };
    reader.onerror = function () {
        console.error("Dosya okunurken bir hata oluştu.");
    };


    reader.readAsDataURL(file);
}

document.getElementById('imageUploader').addEventListener('change', function (event) {

});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startDrag, 1000);
})
function startDrag() {

    let draggedItem = null;

    Array.from(document.getElementsByName('layer')).forEach(item => {

        item.addEventListener('dragstart', () => {
            draggedItem = item;
            item.style.opacity = '0.5';

        });


        item.addEventListener('dragend', () => {
            draggedItem.style.opacity = '1';
        });

        item.addEventListener('dragover', (event) => {
            event.preventDefault();
            item.classList.add('drag-over');
        });

        item.addEventListener('dragleave', () => {
            item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (event) => {
            event.preventDefault();

            const stack = document.getElementById('layers');
            item.classList.remove('drag-over');


            if (draggedItem !== item) {
                const allItems = Array.from(stack.children);
                const draggedIndex = allItems.indexOf(draggedItem);
                const targetIndex = allItems.indexOf(item);

                if (draggedIndex < targetIndex) {
                    stack.insertBefore(draggedItem, item.nextSibling);
                } else {
                    stack.insertBefore(draggedItem, item);
                }
            }
        });
    });
}