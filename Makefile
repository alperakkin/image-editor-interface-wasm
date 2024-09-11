
# emcc src/main.c -o bin/main.wasm -s EXPORTED_FUNCTIONS="['_add']" -s STANDALONE_WASM --no-entry

all: clean build compile

build:
	mkdir -p build
	mkdir -p bin


compile:
	emcc -I./src/include src/editor.c src/image.c src/helpers.c src/utils.c -o src/web-interface/editor.wasm -s EXPORTED_FUNCTIONS="['_grayscale','_malloc','_free', '_result']" -s STANDALONE_WASM -s ALLOW_TABLE_GROWTH -Iinclude -s USE_LIBPNG=1 --no-entry


.PHONY: clean

clean:
	rm -rf web-interface/*.wasm

