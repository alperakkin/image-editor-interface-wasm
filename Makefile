all: clean compile

compile:
	emcc -I./src/include src/editor.c src/image.c src/helpers.c src/utils.c -o src/web-interface/editor.wasm -s EXPORTED_FUNCTIONS="['_grayscale']" -s STANDALONE_WASM -s ALLOW_TABLE_GROWTH -Iinclude -s USE_LIBPNG=1 -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' --no-entry


.PHONY: clean

clean:
	rm -rf web-interface/*.wasm

