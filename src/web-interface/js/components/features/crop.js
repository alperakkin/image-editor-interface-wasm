let cropCanvas = document.getElementById('cropCanvas');

const overlayCtx = cropCanvas.getContext('2d');
overlayCtx.fillStyle = 'rgba(128, 128, 128, 0.5)';
overlayCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);

let isDragging = false;
let completed;
let startX, startY, currentX, currentY;
let mouseX, mouseY;

async function displayCropCanvas() {
    completed = false;
    cropCanvas.style.display = 'block';
    let pos = canvasBefore.getBoundingClientRect();
    cropCanvas.style.left = pos.left + 'px';
    cropCanvas.style.top = pos.top + 'px';
    cropCanvas.style.height = pos.height + 'px';
    cropCanvas.style.width = pos.width + 'px';
    cropCanvas.width = pos.width;
    cropCanvas.height = pos.height;


    await new Promise((resolve) => {
        const checkCompletion = () => {
            if (completed) {
                resolve();
            } else {
                requestAnimationFrame(checkCompletion);
            }
        };
        checkCompletion();
    });
}

cropCanvas.addEventListener('mousedown', function (e) {
    const rect = cropCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;
});



document.addEventListener('mousemove', function (e) {
    const rect = cropCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    drawCropIndicator();
    if (!isDragging) {
        drawCropIndicator();
    } else {
        drawGrayedArea();
    }
});

document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    console.log(mouseX, mouseY);
    currentX = Math.max(0, Math.min(mouseX, cropCanvas.width));
    currentY = Math.max(0, Math.min(mouseY, cropCanvas.height));
    document.getElementById('cropRegion').value = `${startX}:${startY}:${currentX}:${currentY}`;
    isDragging = false;
    completed = true;
    cropCanvas.style.display = "none";
});

function drawGrayedArea() {
    overlayCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);

    const x = Math.min(startX, mouseX);
    const y = Math.min(startY, mouseY);
    const width = Math.abs(mouseX - startX);
    const height = Math.abs(mouseY - startY);


    overlayCtx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    overlayCtx.fillRect(0, 0, cropCanvas.width, y);
    overlayCtx.fillRect(0, y + height, cropCanvas.width, cropCanvas.height - (y + height));
    overlayCtx.fillRect(0, y, x, height);
    overlayCtx.fillRect(x + width, y, cropCanvas.width - (x + width), height);


    overlayCtx.strokeStyle = 'gray';
    overlayCtx.lineWidth = 1;
    overlayCtx.strokeRect(x, y, width, height);
}

function drawCropIndicator() {
    let cursorSize = 4;
    cropCanvas.style.cursor = 'none';

    overlayCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
    overlayCtx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    overlayCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);

    overlayCtx.strokeStyle = 'red';
    overlayCtx.lineWidth = 0.8;

    overlayCtx.beginPath();
    overlayCtx.moveTo(mouseX - cursorSize, mouseY);
    overlayCtx.lineTo(mouseX + cursorSize, mouseY);
    overlayCtx.stroke();

    overlayCtx.moveTo(mouseX, mouseY - cursorSize);
    overlayCtx.lineTo(mouseX, mouseY + cursorSize);
    overlayCtx.stroke();
    overlayCtx.closePath();
}

export { displayCropCanvas };
