class Layers {
    constructor() {
        this.canvasStack = [];
        this.selectedCanvas = undefined;
    }

    addLayer(name) {
        const newLayer = new LayerCanvas(name);
        newLayer.fetchHtml(name);
        this.canvasStack.push(newLayer);
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

    fetchHtml(name) {

        fetch('components/utils/layer.html')
            .then(response => response.text())
            .then(html => {
                const layers = document.getElementById('layers');
                html = html.replace("name", `name="${name}"`)
                html = html.replace("{LayerName}", name)
                layers.innerHTML += html;

            })
    }
}

let layers = new Layers();
let test = ["layer1", "layer2", "layer3"]
for (let i of test) {
    layers.addLayer(i);
}

layers = document.querySelectorAll('.layer');
let draggedElement = null;

layers.forEach(layer => {

    layer.addEventListener('dragstart', (event) => {
        draggedElement = layer;
        event.dataTransfer.effectAllowed = "move";
    });

    layer.addEventListener('dragover', (event) => {
        event.preventDefault();
        layer.classList.add("drag-over");
    });

    layer.addEventListener('dragleave', () => {
        layer.classList.remove("drag-over");
    });

    layer.addEventListener('drop', (event) => {
        event.preventDefault();
        layer.classList.remove("drag-over");


        if (draggedElement !== layer) {
            const container = document.querySelector('.layers');
            container.insertBefore(draggedElement, layer.nextSibling);
        }
    });
});