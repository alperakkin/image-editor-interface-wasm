export default class Layers {
    constructor() {
        this.canvasStack = [];
        this.selected = undefined;
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
            if (this.canvasStack.length == 0) {
                this.canvasStack.push(newLayer);
            } else {

                this.canvasStack = this.canvasStack.slice(0, 0).concat(newLayer, this.canvasStack.slice(0));
            }



        }, timeout);

    }

    getLayer(name) {
        let layers = this.canvasStack.filter(item => item.name == name);
        if (layers.length > 0) return layers[0];
    }

    deleteLayer() {
        let name = this.selected;
        if (name == "main" || name == undefined) {
            let info = document.getElementById("layerAlert");

            document.getElementById("alertHeader").textContent = "Layer Error";
            document.getElementById("layerMessage").textContent = "Deleting main layer is not allowed";
            info.style.display = "block";
            fadeOut(info, 2000);
            return;

        }
        let layer = this.getLayer(name);
        document.getElementById(layer.id).remove();
        this.canvasStack = Array.from(this.canvasStack).filter(item => item.name != name);
        window.editor.actions.removeLayerActions(layer);

    }

    moveLayer(name, toIndex) {
        const fromIndex = Array.from(this.canvasStack).findIndex(item => item.name === name);
        const [movedItem] = Array.from(this.canvasStack).splice(fromIndex, 1);
        this.canvasStack = Array.from(this.canvasStack).splice(toIndex, 0, movedItem);

    }

    addImageData(imageData) {
        const layer = this.getLayer(this.selected || 'main');
        const element = document.getElementById(layer.id);

        const canvas = element.childNodes[0];
        window.editor.displayImage(imageData, canvas, false);
        layer.imageData = imageData;

    }






}

class LayerCanvas {
    constructor(name) {
        this.name = name;
        this.isActive = true;
        this.id = undefined;
        this.imageData = undefined;


    }


    createLayerElement(name, index) {
        this.id = `layer_${index}`;

        const layerContainer = document.getElementById('layer-container');


        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer d-flex flex-row justify-content-between';
        layerDiv.setAttribute('id', this.id);
        layerDiv.setAttribute('name', name);
        layerDiv.setAttribute('draggable', 'true');
        layerDiv.setAttribute('data-index', index);
        layerDiv.style.color = 'aliceblue';
        layerDiv.style.background = '#5c5c5c';
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
        canvas.style.alignSelf = "center";

        const nameDiv = document.createElement('div');
        nameDiv.className = 'd-flex flex-column col-6 text-center';
        nameDiv.textContent = name;
        nameDiv.style.alignSelf = "center";

        const icon = document.createElement('i');
        icon.className = "d-flex flex-column col-2 bi bi-eye-fill";
        icon.style.alignSelf = "center";
        icon.onclick = function () {
            swapEye(icon, name);
        };



        layerDiv.appendChild(canvas);
        layerDiv.appendChild(nameDiv);
        layerDiv.appendChild(icon);


        if (layerContainer.children.length > 0) {
            layerContainer.insertBefore(layerDiv, layerContainer.children[0]);
        } else {

            layerContainer.appendChild(layerDiv);
        }
        layerDiv.addEventListener("dragstart", dragStart);
        layerDiv.addEventListener("dragover", dragOver);
        layerDiv.addEventListener("drop", drop);
        layerDiv.addEventListener('click', selectLayer);
        layerDiv.click();
    }
}


function fadeOut(element, duration = 1000) {
    let opacity = 1;
    const interval = 50;
    const decrement = interval / duration;
    setTimeout(() => {
        const fadeEffect = setInterval(() => {
            opacity -= decrement;
            if (opacity <= 0) {
                element.style.display = "none";
                clearInterval(fadeEffect);
            }
            element.style.opacity = opacity;
        }, interval);

    }, 1000);



}



function swapEye(icon, name) {
    let layer = window.layers.getLayer(name);
    let cnv = document.getElementById(layer.id).children[0];

    if (icon.className.includes('bi-eye-fill')) {
        icon.className = 'd-flex flex-column col-2 bi-eye-slash';
        cnv.style.background = "#ffffff00";
        layer.isActive = true;



    } else {
        icon.className = 'd-flex flex-column col-2 bi-eye-fill';
        cnv.style.background = "#ffffffff";
        layer.isActive = false;

    }

    if (layer.isActive && layer.imageData) {
        window.editor.clearImage(cnv);
    } else if (!layer.isActive && layer.imageData) {
        window.editor.displayImage(layer.imageData, cnv, false);
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

function selectLayer(event) {
    const layerElements = document.querySelectorAll('[class^="layer"]');


    layerElements.forEach(element => {
        element.className = element.className.replace(" border border-3 border-warning", "");
    });

    let selected = event.target.closest('[class^="layer"]')
    window.layers.selected = selected.getAttribute('name');
    selected.className += " border border-3 border-warning";


}