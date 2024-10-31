
function getRotatedSize(data) {
    let angle = Number(document.getElementById('rotateAngle').value / 2);
    data.angle = angle;
    let radians = angle * Math.PI / 180

    data.newWidth = parseInt(data.newWidth * Math.abs(Math.cos(radians)) + data.newHeight * Math.abs(Math.sin(radians)));
    data.newHeight = parseInt(data.newWidth * Math.abs(Math.sin(radians)) + data.newHeight * Math.abs(Math.cos(radians)));

    data.newWidth = parseInt(data.newWidth / 4) * 4;
    data.newHeight = parseInt(data.newHeight / 4) * 4;



    return data;

}


export { getRotatedSize }