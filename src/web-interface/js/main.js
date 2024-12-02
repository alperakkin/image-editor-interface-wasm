

document.addEventListener("DOMContentLoaded", () => {
    loadTemplates();

    setTimeout(() => {
        activateEvents();
    }, 1000);
});


function activateEvents() {
    let layerIsDragging = false;
    let layerStartPos = false;

    Array.from(document.getElementsByClassName("arguments")).forEach(
        function (elem) {

            elem.addEventListener('input',
                function (event) {
                    event.stopPropagation();

                    let imageData = editor.execute(elem.id);

                    if (imageData === undefined) return;
                    const cnv = window.layers.getLayer(window.layers.selected).getCanvas();
                    editor.displayImage(imageData, cnv);

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

    document.getElementById('mainCanvas').addEventListener('mousedown',
        function (event) {
            layerStartPos = { x: event.clientX, y: event.clientY };
            layerIsDragging = true;

        }
    )
    document.getElementById('mainCanvas').addEventListener('mousemove',
        function (event) {
            const dragFactor = 0.15;
            const layer = window.layers.getLayer(window.layers.selected);

            if (layerIsDragging && isLayerInBounds(event, layer, layerStartPos)) {
                event.target.style.cursor = 'pointer';
                let xDiff = (event.clientX - layerStartPos.x) * dragFactor;
                let yDiff = (event.clientY - layerStartPos.y) * dragFactor;
                layer.pos = { x: layer.pos.x + xDiff, y: layer.pos.y + yDiff };
                window.editor.actions.updateMainCanvas();
            }

        }
    )
    document.getElementById('mainCanvas').addEventListener('mouseup',
        function (event) {
            layerIsDragging = false;
            event.target.style.cursor = 'default';

        }
    )

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