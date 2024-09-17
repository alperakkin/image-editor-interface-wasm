all: clean compile

compile:
	emcc -I./external/image-editor/include src/wrapper.c external/image-editor/src/editor.c external/image-editor/src/image.c external/image-editor/src/helpers.c external/image-editor/src/utils.c -o src/web-interface/editor.wasm -s EXPORTED_FUNCTIONS="['_grayscale_wrapper','_malloc']" -sSTACK_SIZE=5MB -s TOTAL_MEMORY=512MB -O0 -sASSERTIONS -sSTACK_OVERFLOW_CHECK -s STANDALONE_WASM -s ALLOW_TABLE_GROWTH -Iinclude -s USE_LIBPNG=1 -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' -g --no-entry

.PHONY: clean

clean:
	rm -rf web-interface/*.wasm

