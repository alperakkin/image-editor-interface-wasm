function setColorPointer(colorId, imageData) {
    let imageSize = imageData.width * imageData.height * 4;
    let colorHex = document.getElementById(colorId).value;
    let colorAscii = []

    Array.from(colorHex).forEach(item => {
        colorAscii.push(item.charCodeAt(0))
    });

    colorAscii.push(0); // char* termination
    let colorPtr = imageSize;
    let color = new Uint8Array(
        Module.memory.buffer,
        colorPtr,
        colorAscii.length
    );

    color.set(colorAscii);
    return colorPtr;
}

export { setColorPointer }