import ImageWrapper from './wrapper.js';
import Editor from './editor.js';

const consoleLog = (messagePtr, messageLen) => {
    const message = new TextDecoder("utf-8").decode(new Uint8Array(Module.memory.buffer, messagePtr, messageLen));
    console.log(message);
};

const importObject = {
    env: {
        memory: new WebAssembly.Memory({ initial: 1024, maximum: 65536 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        segfault: consoleLog,
        alignfault: consoleLog,
        console_log: consoleLog

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

