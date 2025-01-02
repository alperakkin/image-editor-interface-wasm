import ImageWrapper from './../wrapper.js';
import Editor from './../editor.js';
import Layers from '../components/layers.js';


function UTF8ToString(ptr) {
    let maxLength = 100
    let u8Array = new Uint8Array(Module.memory.buffer, ptr, maxLength);
    var str = '';
    let i = 0;

    while (i < maxLength) {
        let byte1 = u8Array[i++];

        if (byte1 === 0) break;

        if (byte1 <= 0x7F) {
            str += String.fromCharCode(byte1);
        } else if (byte1 <= 0xDF) {
            let byte2 = u8Array[i++];
            str += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
        } else if (byte1 <= 0xEF) {
            let byte2 = u8Array[i++];
            let byte3 = u8Array[i++];
            str += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
        } else {
            let byte2 = u8Array[i++];
            let byte3 = u8Array[i++];
            let byte4 = u8Array[i++];
            let codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
            if (codePoint >= 0x10000) {
                codePoint -= 0x10000;
                str += String.fromCharCode(0xD800 + (codePoint >> 10), 0xDC00 + (codePoint & 0x3FF));
            } else {
                str += String.fromCharCode(codePoint);
            }
        }
    }
    return str;
}


function consoleLog(msgPtr) {
    const message = UTF8ToString(msgPtr);
    console.log(message);
}

const importObject = {
    env: {
        memory: new WebAssembly.Memory({ initial: 1024, maximum: 65536 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        segfault: consoleLog,
        alignfault: consoleLog,
        consoleLog: consoleLog

    }
};




WebAssembly.instantiateStreaming(fetch("../wasm/editor.wasm"), importObject)
    .then(
        (obj) => {
            console.log(obj);
            window.Module = obj.instance.exports;

        }
    )
    .then(wasmInstance => {
        window.wrapper = new ImageWrapper();
        window.editor = new Editor();
        window.layers = new Layers();
    }
    );

