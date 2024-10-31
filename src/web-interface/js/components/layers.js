class Layers {
    constructor() {
        this.canvasStack = [];
        this.selectedCanvas = undefined;
    }

    addLayer(name, index) {
        const newLayer = new LayerCanvas(name);
        newLayer.fetchHtml(name, index);
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

    fetchHtml(name, index) {

        fetch('components/utils/layer.html')
            .then(response => response.text())
            .then(html => {
                const layers = document.getElementById('layers');
                html = html.replace("data-index", `data-index=${index}`)
                html = html.replace("{LayerName}", name)
                layers.innerHTML += html;

            })
    }
}

let layers = new Layers();
let test = ["layer1", "layer2", "layer3"]
for (let i in test) {
    layers.addLayer(test[i], i);

}

