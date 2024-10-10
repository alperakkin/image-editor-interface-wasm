
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
-sSTACK_SIZE=5MB \
-sINITIAL_MEMORY=128MB \
-sSTACK_OVERFLOW_CHECK \


LIBRARIES = -sUSE_LIBPNG=1

RUNTIME_METHODS = -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]'

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