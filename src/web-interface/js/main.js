

document.addEventListener("DOMContentLoaded", () => {
    loadTemplates();

    setTimeout(() => {
        listenInputs();
    }, 1000);
});


function listenInputs() {

    Array.from(document.getElementsByClassName("arguments")).forEach(
        function (elem) {

            elem.addEventListener('input',
                function (event) {
                    event.stopPropagation();

                    let imageData = editor.execute(elem.id);

                    if (imageData === undefined) return;
                    editor.displayResult(imageData);

                }

            )
        }
    )

    document.getElementById('options').addEventListener('change',
        function (event) {
            event.stopPropagation();
            const directExecutedActions = ['grayscale', 'invert', 'crop'];
            if (directExecutedActions.includes(event.target.value)) {
                let imageData = editor.execute(event.target.value);
                if (imageData === undefined) return;
                const canvas = window.layers.getLayer(layers.selected).getCanvas();
                editor.displayImage(imageData, canvas);
            }

        }
    )

}



function uploadImage(event) {

    const file = event.target.files[0];
    if (!file) return;


    const reader = new FileReader();


    reader.onload = function (e) {
        canvasBefore = document.getElementById('imageCanvasBefore');
        Canvas = document.getElementById('imageCanvas');
        contextBefore = canvasBefore.getContext('2d', { willReadFrequently: true });




        contextBefore.clearRect(0, 0, canvasBefore.width, canvasBefore.height);

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

            let imageData = contextBefore.getImageData(0, 0, canvasBefore.width, canvasBefore.height);



            document.getElementById("histogram").style.display = "flex";
            document.getElementById('imageInfo.Size').textContent = `Width: ${img.width} Height: ${img.height}`
            editor.histogram(
                {
                    'imageData': imageData,
                    'newWidth': imageData.width,
                    'newHeight': imageData.height
                },
                "red", "green", "blue"
            );

            window.layers.addImageData(imageData);
        };









    };
    reader.onerror = function () {
        console.error("Dosya okunurken bir hata oluştu.");
    };


    reader.readAsDataURL(file);
}

document.getElementById('imageUploader').addEventListener('change', function (event) {

});


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})