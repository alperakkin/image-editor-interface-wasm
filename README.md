# image-editor-interface-wasm
Image Editor with Web Assembly


## DEFINITION

The image-editor application at https://github.com/alperakkin/image-editor is used through a web interface via WASM


## BUILD

Clone the image-editor repository

```bash
$ git clone https://github.com/alperakkin/image-editor.git
```

Clone the image-editor-interface-wasm repository

```bash
$ git clone https://github.com/alperakkin/image-editor-interface-wasm.git
```

Change directory to image-editor-interface-wasm and create symbolic links of required .c files from image-editor

```bash
$ cd image-editor-interface-wasm
$ ./scripts/link.sh
```
Make sure that external folder contains symbolic links.


Build the .wasm  file by running the Makefile.

```bash
$ make
```
"editor.wasm" will be created in web-interface/wasm  folder.




## QUICK START

Change directory to web-interface

```bash
$ cd image-editor-interface-wasm/web-interface
```

Start a static file server

```bash
$ python -m http.server
```

Open a browser and type localhost:8000/index.html to address bar


You can play with the implemented features as shown below:

![](https://github.com/alperakkin/image-editor-interface-wasm/blob/main/resources/example.png)



# References
https://github.com/alperakkin/image-editor  
https://emscripten.org/docs/compiling/WebAssembly.html  
https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API  
https://developer.mozilla.org/en-US/docs/Web/API/ImageData  
https://d3js.org/getting-started  
