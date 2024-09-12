#include <string.h>
#include <png.h>

#include "utils.h"


#define HISTOGRAM_LENGTH 25


typedef struct {
  char* name;
  int width;
  int height;
  png_byte color_type;
  png_byte bit_depth;
  png_bytep *pixels;
} Image;


typedef struct {
    unsigned char R, G, B, A;
} Color;

typedef struct {
    char* name;
    char* value;
    int histogram[HISTOGRAM_LENGTH];
    int max;
    int min;
} ColorMode;

Image open_image(char* FILENAME);
void save_image(char* FILENAME, Image image);



void free_image(Image image);

Color hex_to_rgb(char* hex_code);