import ImageWrapper from './wrapper.js';
import Editor from './editor.js';

const importObject = {
    env: {
        memory: new WebAssembly.Memory({ initial: 1024, maximum: 65536 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        segfault: console.log,
        alignfault: console.log

    }
};




WebAssembly.instantiateStreaming(fetch("editor.wasm"), importObject)
    .then(
        (obj) => {
            console.log(obj);
            window.Module = obj.instance.exports;

        }
    )
    .then(wasmInstance => {
        window.wrapper = new ImageWrapper();
        window.editor = new Editor();
    }
    );

