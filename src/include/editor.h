#include <math.h>
#include <float.h>
#include <stdlib.h>

#include "helpers.h"

#define min(a, b) ((a) < (b) ? (a) : (b))
#define max(a, b) ((a) > (b) ? (a) : (b))

void grayscale(int* pixels, int width, int height);
Image  contrast(Image image, float f);
Image brightness(Image image, float ratio);
Image gaussian(Image image, int kernel_size, float sigma);
Image resize(Image image, int width, int height);
void histogram(Image image);
Image filter(Image image, char* color, float strength);
Image opacity(Image image, float factor);
Image add_layer(Image image, Image patch, int pos_x, int pos_y, int alpha);
Image crop(Image image, int left, int right, int top, int bottom);
Image rotate_image(Image image, double angle);
Image invert(Image image);
Image add_border(Image image, char* color, int size);
Image mask(Image image, char* color, float threshold);
Image edge(Image image, int high_threshold, int low_threshold);
void match_template(Image image, Image template, float threshold);
void check_color(Image image, char *color, float threshold);
Image vignette(Image image, float ratio);