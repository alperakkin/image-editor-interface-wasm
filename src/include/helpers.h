#include <math.h>

#include "image.h"

typedef struct {
    int min;
    int max;
    int avg;
    int avg_red;
    int avg_green;
    int avg_blue;

} Statistics;

Statistics intensity(Image image);

double** kernel_filter(int kernel_size, float sigma);

void apply_kernel(double**kernel, int KERNEL_SIZE, Image image);

Image bilinear_interpolation(Image image);
int** sobel_filter(Image image, char direction);
int** gradient_direction(int** sobel_x, int** sobel_y, int width, int height);
int** gradient_magnitude(int** sobel_x, int** sobel_y, int width, int height);
int** non_maximum_suppression(int** gradient_mag, int** gradient_dir, int width, int height);
Image double_threshold(Image image, int** supp_matrix, int high, int low);
Image edge_tracking(Image image);
void print_color(ColorMode color, char* text);
void print_color_block(int index, ColorMode color);
void print_x_axis(ColorMode red, ColorMode green, ColorMode blue);
void print_table(ColorMode red, ColorMode green, ColorMode blue);