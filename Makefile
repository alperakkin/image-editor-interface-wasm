
CC = emcc

INCLUDES = ./external/image-editor/include

MAIN = src/wrapper.c

IMAGE_EDITOR =\
 external/image-editor/src/editor.c \
 external/image-editor/src/image.c \
 external/image-editor/src/helpers.c \
 external/image-editor/src/utils.c

OUTPUT = src/web-interface/wasm/editor.wasm

EXPORTED_WRAPPERS = $(shell grep -E '^(void|float) ' src/wrapper.c | sed -n 's/.* \([a-zA-Z_]*_wrapper\).*/_\1/p')
FUNCTIONS = $(shell echo $(EXPORTED_WRAPPERS) | awk '{ for (i=1; i<=NF; i++) { printf "\"" $$i "\", " }}' | sed 's/, $$//')
EXPORTED_FUNCTIONS = [${FUNCTIONS}]
MEM_FLAGS = \
-sSTACK_SIZE=50MB \
-sINITIAL_MEMORY=200MB \
-sSTACK_OVERFLOW_CHECK \


LIBRARIES = -sUSE_LIBPNG=1

RUNTIME_METHODS = -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall", "UTF8ToString"]'

FLAGS = \
-O0 \
-sASSERTIONS=2 \
-sWASM_ASYNC_COMPILATION=1 \
-g \
-sNO_FILESYSTEM=1 \
-sENVIRONMENT=web \
--no-entry \
-DWASM \
-sSTANDALONE_WASM



all: clean compile

compile:
	$(CC) -I$(INCLUDES) $(MAIN) $(IMAGE_EDITOR) -o $(OUTPUT)\
	 -s EXPORTED_FUNCTIONS="$(EXPORTED_FUNCTIONS)" $(MEM_FLAGS)\
	 $(RUNTIME_METHODS) $(LIBRARIES) $(FLAGS)

.PHONY: clean

clean:
	rm -rf web-interface/*.wasm