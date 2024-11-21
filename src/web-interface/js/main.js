

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

        const mainCanvas = document.getElementById('mainCanvas');

        originalCtx.clearRect(0, 0, originalCnv.width, originalCnv.height);



        img.onload = function () {
            originalCtx.clearRect(0, 0, originalCnv.width, originalCnv.height);
            originalCtx.drawImage(img, 0, 0, originalCnv.width, originalCnv.height);

            let imageData = originalCtx.getImageData(0, 0, img.width, img.height);



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