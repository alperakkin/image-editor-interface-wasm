
CC = emcc

INCLUDES = ./external/image-editor/include

MAIN = src/wrapper.c

IMAGE_EDITOR =\
 external/image-editor/src/editor.c \
 external/image-editor/src/image.c \
 external/image-editor/src/helpers.c \
 external/image-editor/src/utils.c

OUTPUT = src/web-interface/editor.wasm

EXPORTED_FUNCTIONS = [\
	'_grayscale_wrapper',\
	'_contrast_wrapper',\
	'_gaussian_wrapper',\
	'_brightness_wrapper',\
	'_resize_wrapper',\
	'_histogram_wrapper',\
	'_filter_wrapper',\
	'_malloc'\
	]

MEM_FLAGS = \
-s STACK_SIZE=10MB \
-s INITIAL_MEMORY=11534336 \
-s MAXIMUM_MEMORY=16777216 \


LIBRARIES = -s USE_LIBPNG=1

RUNTIME_METHODS = -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]'

FLAGS = \
-O3 \
-sASSERTIONS=2 \
-s WASM_ASYNC_COMPILATION=1 \
-sSTACK_OVERFLOW_CHECK \
-s ALLOW_TABLE_GROWTH \
-g \
-s NO_FILESYSTEM=1 \
-s ENVIRONMENT=web \
--no-entry \
-DWASM



all: clean compile

compile:
	$(CC) -I$(INCLUDES) $(MAIN) $(IMAGE_EDITOR) -o $(OUTPUT)\
	 -s EXPORTED_FUNCTIONS="$(EXPORTED_FUNCTIONS)" $(MEM_FLAGS)\
	 $(RUNTIME_METHODS) $(LIBRARIES) $(FLAGS)

.PHONY: clean

clean:
	rm -rf web-interface/*.wasm