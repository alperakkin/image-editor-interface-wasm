

export default class ImageWrapper {

    grayscale(pixels, width, height) {
        let Heap = new Uint8Array(window.Module.memory.buffer, 0, width * height * 4);
        Heap.set(pixels);

        window.Module.grayscale_wrapper(Heap.byteOffset, width, height);

        let result = new Uint8Array(window.Module.memory.buffer, 0, width * height * 4);

        return result;
    }

}



