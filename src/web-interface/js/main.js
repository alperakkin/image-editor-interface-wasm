

document.addEventListener("DOMContentLoaded", () => {
    loadTemplates();

    setTimeout(() => {
        activateEvents();
    }, 1000);
});


function activateEvents() {

    Array.from(document.querySelectorAll('.arguments input:not(.slider)')).forEach(
        function (elem) {
            const action = elem.parentElement.id
            elem.addEventListener('input',
                function (event) {
                    event.stopPropagation();

                    let imageData = editor.execute(action);

                    if (imageData === undefined) return;
                    const cnv = window.layers.getLayer(window.layers.selected).getCanvas();
                    editor.displayImage(imageData, cnv);

                }

            )
        }
    )

    Array.from(document.querySelectorAll('.arguments input.slider')).forEach(
        function (elem) {
            const action = elem.parentElement.id
            elem.addEventListener('mouseup',
                function (event) {
                    event.stopPropagation();

                    let imageData = editor.execute(action);

                    if (imageData === undefined) return;
                    const cnv = window.layers.getLayer(window.layers.selected).getCanvas();
                    editor.displayImage(imageData, cnv);

                }

            )
        }
    )







    $('#newProject').on('shown.bs.modal', function () {
        $('#projectName').trigger('focus');
    });

    $('#layerName').on('shown.bs.modal', function () {
        $('#layerNameInput').trigger('focus');
    });


}


function isLayerInBounds(event, layer, layerStartPos) {
    let domRect = event.target.getBoundingClientRect();

    const isXInBounds = layerStartPos.x + domRect.x >= layer.pos.x;
    const isYInBounds = layerStartPos.y + domRect.y >= layer.pos.y;

    return isXInBounds && isYInBounds;
}


function uploadImage(event) {

    const file = event.target.files[0];
    if (!file) return;


    const reader = new FileReader();


    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        const originalCnv = document.getElementById('originalCnv');
        const originalCtx = originalCnv.getContext('2d', { willReadFrequently: true });

        originalCtx.clearRect(0, 0, originalCnv.width, originalCnv.height);



        img.onload = function () {
            if (window.layers.layerStack.length == 1) return;
            const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);


            originalCtx.clearRect(0, 0, originalCnv.width, originalCnv.height);
            originalCtx.drawImage(img, 0, 0, originalCnv.width, originalCnv.height);





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
            editor.actions.updateMainCanvas();

        };




    };
    reader.onerror = function () {
        console.error("An error occured while reading image.");
    };


    reader.readAsDataURL(file);
}


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})