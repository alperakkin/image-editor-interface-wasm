export default class Layers {
    constructor() {
        this.canvasStack = [];
        this.selectedCanvasName = undefined;
        this.addLayer("main");
    }

    addLayer(name) {
        if (!name) {
            let nameElement = document.getElementById("layerNameInput")
            name = nameElement.value;
            nameElement.value = "";
        }
        const newLayer = new LayerCanvas(name);
        let index = this.canvasStack.length;
        let timeout = 0
        if (this.canvasStack.length == 0) {
            timeout = 200;
        }
        setTimeout(() => {
            newLayer.createLayerElement(name, index);
            this.canvasStack.push(newLayer);
        }, timeout);

    }

    deleteLayer(name) {
        this.canvasStack = Array.from(this.canvasStack).filter(item => item.name != name);
    }

    moveLayer(name, toIndex) {
        const fromIndex = Array.from(this.canvasStack).findIndex(item => item.name === name);
        const [movedItem] = Array.from(this.canvasStack).splice(fromIndex, 1);
        this.canvasStack = Array.from(this.canvasStack).splice(toIndex, 0, movedItem);

    }






}

class LayerCanvas {
    constructor(name) {
        this.name = name;
        this.imageData = undefined;
        this.isActive = true;


    }

    updateImageData(imageData) {
        this.imageData = imageData;
    }

    createLayerElement(name, index) {

        const layerContainer = document.getElementById('layer-container');


        const layerDiv = document.createElement('div');
        layerDiv.className = 'd-flex flex-row justify-content-between';
        layerDiv.setAttribute('id', `layer_${index}`);
        layerDiv.setAttribute('name', 'layer');
        layerDiv.setAttribute('draggable', 'true');
        layerDiv.setAttribute('data-index', index);
        layerDiv.style.color = 'aliceblue';
        layerDiv.style.minWidth = '100%';
        layerDiv.style.borderStyle = 'inset';
        layerDiv.style.borderRadius = '8px';
        layerDiv.style.display = 'flex';


        const canvas = document.createElement('canvas');
        canvas.className = 'd-flex flex-column';
        canvas.style.width = '25px';
        canvas.style.height = '25px';
        canvas.style.background = 'white';
        canvas.style.margin = '4px';


        const nameDiv = document.createElement('div');
        nameDiv.className = 'd-flex flex-column col-11 text-center';
        nameDiv.textContent = name;


        layerDiv.appendChild(canvas);
        layerDiv.appendChild(nameDiv);


        layerContainer.appendChild(layerDiv);
        layerDiv.addEventListener("dragstart", dragStart);
        layerDiv.addEventListener("dragover", dragOver);
        layerDiv.addEventListener("drop", drop);
    }
}


function dragStart(event) {

    event.dataTransfer.setData("text/plain", event.target.id);
}


function dragOver(event) {
    event.preventDefault();
}


function drop(event) {
    event.preventDefault();
    const draggedElementId = event.dataTransfer.getData("text/plain");

    const draggedElement = document.getElementById(draggedElementId);
    const dropTarget = event.target.closest('[draggable]');


    if (dropTarget && dropTarget !== draggedElement) {
        const layers = document.getElementById('layer-container');
        const allItems = Array.from(layers.children);
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(dropTarget);

        if (draggedIndex < targetIndex) {
            layers.insertBefore(draggedElement, dropTarget.nextSibling);
        } else {
            layers.insertBefore(draggedElement, dropTarget);
        }

    }
}