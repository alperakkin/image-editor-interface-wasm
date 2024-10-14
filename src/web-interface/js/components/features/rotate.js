
function getRotatedSize(data) {
    let angle = Number(document.getElementById('rotateAngle').value / 2);
    data.angle = angle;
    return data;

}

export { getRotatedSize }