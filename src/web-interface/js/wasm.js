

const importObject = {
    env: {
        memory: new WebAssembly.Memory({ initial: 1024, maximum: 65536 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        console_log_int: console.log,
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
    );

