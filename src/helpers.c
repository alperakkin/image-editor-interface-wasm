#include "helpers.h"


Statistics intensity(Image image)
{
    Statistics intensity_data = {255, 0, 0};
    int total = 0;
    int total_red = 0;
    int total_green = 0;
    int total_blue = 0;
    int total_px = image.width * image.height;

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);
            int avg = (int)(px[0] + px[1] + px[2]) / 3;
            total += avg;
            total_red += px[0];
            total_green += px[1];
            total_blue += px[2];

            if (avg<= intensity_data.min) intensity_data.min = avg;
            if (avg>= intensity_data.max) intensity_data.max = avg;
        }

        intensity_data.avg = (int) total / total_px;
        intensity_data.avg_red = (int) total_red / total_px;
        intensity_data.avg_green = (int) total_green / total_px;
        intensity_data.avg_blue = (int) total_blue / total_px;

     }
    return intensity_data;
}


double** kernel_filter(int kernel_size, float sigma)
{
    double **kernel = (double **) malloc(kernel_size * sizeof(double));

    for(int row=0; row<kernel_size; row++)
    {
        kernel[row] = (double *) malloc(kernel_size * sizeof(double));
        for(int col=0; col<kernel_size; col++)
        {
            int dist_row =  abs(row - (int) (kernel_size / 2));
            int dist_col =  abs(col - (int) (kernel_size / 2));

            double sigma_squared = sigma * sigma;
            double exponent = -((dist_row * dist_row + dist_col * dist_col) / (2.0 * sigma_squared));
            double gauss_value = exp(exponent) / (2.0 * M_PI * sigma_squared);

            kernel[row][col] =  gauss_value;

        }

    }

    return kernel;

}

void apply_kernel(double**kernel, int KERNEL_SIZE, Image image)
{
    int KERNEL_RADIUS = (KERNEL_SIZE / 2) -1;
    png_bytep* output = (png_bytep*)malloc(image.height * sizeof(png_bytep));


    for (int i = 0; i < image.height; ++i) {
        output[i] = (png_bytep)malloc(image.width * 4 * sizeof(png_byte));
    }


    for (int y = 0; y < image.height; ++y) {
        for (int x = 0; x < image.width; ++x) {
            double r_sum = 0, g_sum = 0, b_sum = 0;
            double kernel_sum = 0;
            for (int ky = -KERNEL_RADIUS; ky <= KERNEL_RADIUS; ++ky) {
                for (int kx = -KERNEL_RADIUS; kx <= KERNEL_RADIUS; ++kx) {
                    int ix = x + kx;
                    int iy = y + ky;

                    if (ix >= 0 && ix < image.width && iy >= 0 && iy < image.height) {
                        png_bytep px = image.pixels[iy] + ix * 4;

                        double kernel_value = kernel[KERNEL_RADIUS + ky][KERNEL_RADIUS + kx];

                        r_sum += px[0] * kernel_value;
                        g_sum += px[1] * kernel_value;
                        b_sum += px[2] * kernel_value;

                        kernel_sum += kernel_value;
                    }
                }
            }
            png_bytep out_px = output[y] + x * 4;

            out_px[0] = (png_byte)(r_sum / kernel_sum) % 255;
            out_px[1] = (png_byte)(g_sum / kernel_sum) % 255;
            out_px[2] = (png_byte)(b_sum / kernel_sum) % 255;

            int avg = (int) ((int) out_px[0] + out_px[1] + out_px[2])/3;
            if (avg > 0) out_px[3] = 255;
        }
    }


    for (int i = 0; i < image.height; ++i) {
        memcpy(image.pixels[i], output[i], image.width * 4 * sizeof(png_byte));
        free(output[i]);
    }
    free(output);


}

Image bilinear_interpolation(Image image)
{
    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);


            int red = 0;
            int green = 0;
            int blue = 0;
            int alpha = 0;
            int count = 0;
            int kernel = 1;


            if (px[3] == 0)
            {
                for(int i=y-kernel; i<=y+kernel; i++)
                {
                    for(int j=x-kernel; j<=x+kernel; j++)
                    {
                       if (i < 0 || i >= image.height || j < 0 || j >= image.width) continue;

                            png_bytep neighbor_row = image.pixels[i];
                            png_bytep neighbor_px = &(neighbor_row[j * 4]);


                            if (neighbor_px[3] == 0) continue;


                            red += neighbor_px[0];
                            green += neighbor_px[1];
                            blue += neighbor_px[2];
                            alpha += neighbor_px[3];
                            count++;

                    }
                }


                if (count < kernel * 8) continue;

                red = (int) red / count;
                green = (int) green / count;
                blue = (int) blue / count;
                alpha = (int) alpha / count;

                px[0] = red;
                px[1] = green;
                px[2] = blue;
                px[3] = alpha;


            }

        }

    }
    return image;
}


int** sobel_filter(Image image, char direction)
{

    int sobel_matrix[3][3];

    if (direction == 'x') {
        int sobel_x[3][3] = {
            {-1, 0, 1},
            {-2, 0, 2},
            {-1, 0, 1}
        };
        memcpy(sobel_matrix, sobel_x, 9 * sizeof(int));
    } else if (direction == 'y') {
        int sobel_y[3][3] = {
            {-1, -2, -1},
            {0, 0, 0},
            {1, 2, 1}
        };
        memcpy(sobel_matrix, sobel_y, 9 * sizeof(int));
    }





   int** sobel_filter_matrix = alloc_matrix(image.width, image.height);

    for (int y=0; y < image.height; y++)
    {

        int* sobel_row = sobel_filter_matrix[y];


        for (int x=0; x < image.width; x++)
        {

            sobel_filter_matrix[y][x] = 0;

            for(int sy = -1; sy <= 1; sy++)
            {
                for(int sx = -1; sx <= 1; sx++)
                {
                    int posy = sy + y;
                    int posx = sx + x;
                    if (posy < 0 || posy >= image.height || posx < 0 || posx >= image.width) continue;
                    png_bytep row = image.pixels[posy];
                    png_bytep px = &(row[posx * 4]);

                    sobel_filter_matrix[y][x] = sobel_filter_matrix[y][x] +(px[0] * sobel_matrix[sy+1][sx+1]);

                }

            }




        }

    }





    return sobel_filter_matrix;
}

int** gradient_direction(int** sobel_x, int** sobel_y, int width, int height)
{
    int** gradient_matrix = alloc_matrix(width, height);

    for (int y=0; y < height; y++)
    {

        for (int x=0; x < width; x++)
        {
            gradient_matrix[y][x] = atan2(sobel_y[y][x], sobel_x[y][x]);
        }

    }

    return gradient_matrix;
}


int** gradient_magnitude(int** sobel_x, int** sobel_y, int width, int height)
{
    int** gradient_matrix = alloc_matrix(width, height);

    for (int y=0; y < height; y++)
    {

        for (int x=0; x < width; x++)
        {

            double sq = (sobel_x[y][x] * sobel_x[y][x]) + (sobel_y[y][x] * sobel_y[y][x]);
            gradient_matrix[y][x] = sqrt(sq);

        }

    }
    return gradient_matrix;
}

int** non_maximum_suppression(int** gradient_mag, int** gradient_dir, int width, int height)
{
    int** suppr_matrix = alloc_matrix(width, height);
    for (int y=0; y < height; y++)
    {

        for (int x=0; x < width; x++)
        {


            double angle = gradient_dir[y][x];

            if (angle > M_PI) angle -= M_PI;
            if (angle >=0 && angle < M_PI/8) angle = 0;
            if (angle >=M_PI/8 && angle < M_PI/4) angle = (int) M_PI/4;
            if (angle >=M_PI/4 && angle < M_PI/2) angle = (int) M_PI/2;
            if (angle >=M_PI/2 && angle < 3 * M_PI / 4) angle = (int) 3 * M_PI /4;
            if (angle >=3 * M_PI / 4 && angle < M_PI) angle = (int) M_PI;

            if (angle == 0 || angle == M_PI)
            {

                int left = 0;
                int right = 0;
                if (x-1 >= 0)
                {
                    left = gradient_mag[y][x-1];
                }
                if (x+1 < width)
                {
                    right = gradient_mag[y][x+1];
                }

                if (gradient_mag[y][x] > left && gradient_mag[y][x] > right)
                {
                    suppr_matrix[y][x]= gradient_mag[y][x];

                }
                else
                {
                    suppr_matrix[y][x] = 0;

                }
            }

            if (angle == (int) M_PI/4)
            {
                int bottom_left = 0;
                int top_right = 0;
                if (y-1 >= 0 && x-1 >= 0)
                {

                    bottom_left = gradient_mag[y-1][x-1];

                }
                if (y+1 < height && x+1 < width)
                {
                    top_right = gradient_mag[y+1][x+1];

                }

                if (gradient_mag[y][x] > bottom_left && gradient_mag[y][x] > top_right)
                {
                    suppr_matrix[y][x] = gradient_mag[y][x];

                }
                else
                {
                    suppr_matrix[y][x] = 0;

                }
            }

            if (angle == (int) 3* M_PI/4)
            {
                int bottom_right = 0;
                int top_left = 0;
                if (y-1 >= 0 && x+1 < width)
                {
                    bottom_right = gradient_mag[y-1][x+1];
                }
                if (y+1 < height && x-1 >= 0)
                {
                    top_left = gradient_mag[y+1][x-1];
                }

                if (gradient_mag[y][x] > bottom_right && gradient_mag[y][x] > top_left)
                {
                    suppr_matrix[y][x] = gradient_mag[y][x];

                }
                else
                {
                    suppr_matrix[y][x] = 0;
                }

            }

            if (angle == (int) M_PI/2)
            {
                int top = 0;
                int bottom = 0;
                if (y-1 >= 0)
                {

                    bottom = gradient_mag[y-1][x];
                }
                if (y+1 < height)
                {

                    top = gradient_mag[y+1][x];
                }

                if (gradient_mag[y][x] > bottom && gradient_mag[y][x]> top)
                {
                    suppr_matrix[y][x] = gradient_mag[y][x];

                }
                else
                {
                    suppr_matrix[y][x] = 0;

                }

            }


        }

    }

    return suppr_matrix;

}

Image double_threshold(Image image, int** supp_matrix, int high, int low)
{
    for (int y=0; y < image.height; y++)
    {

        png_bytep row = image.pixels[y];

        for (int x=0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);


            if (supp_matrix[y][x] >= high)
            {
                px[0] = 255;
                px[1] = 255;
                px[2] = 255;
                px[3]=255;
            }
            if (supp_matrix[y][x] >= low && px[0] < high)
            {
                px[0] = 128,
                px[1] = 128,
                px[2] = 128,
                px[3]=255;
            };
            if (supp_matrix[y][x] < low)
             {
                px[0] = 0;
                px[1] = 0;
                px[2] = 0;
                px[3]=255;
            }

        }
    }

    return image;
}

Image edge_tracking(Image image)
{
    for (int y=0; y < image.height; y++)
    {

        png_bytep row = image.pixels[y];

        for (int x=0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            if (px[0] == 128)
            {


                for(int sy = -1; sy != 1; sy++)
                {
                    for(int sx = -1; sx != 1; sx++)
                    {
                        int posy = sy + y;
                        int posx = sx + x;
                        if (posy < 0 || posy > image.height || posx < 0 || posx > image.width) continue;
                        png_bytep e_row = image.pixels[posy];
                        png_bytep e_px = &(e_row[posx * 4]);

                        if(e_px[0] ==255)
                        {
                            px[0] = 255;
                            px[1] = 255;
                            px[2] = 255;
                        }


                    }

                }
            }
        }

    }

    return image;
}

void print_color(ColorMode color, char* text)
{
    printf("\033[%sm%s\033[0m", color.value, text);
}

void print_color_block(int index, ColorMode color)
{
    char* block = "\xE2\x96\x89";
    int bin_width = (color.max - color.min + 10 - 1)/10;
    printf("|");
        for (int col=0; col<25; col++)
        {
            if (color.histogram[col] >= index * 50 * bin_width  && color.histogram[col] != 0)
            {
                print_color(color, block);
            }
            else
            {
                printf(" ");
            }
        }


}

void print_x_axis(ColorMode red, ColorMode green, ColorMode blue)
{
    printf("--------------------------->\t\t");
    printf("--------------------------->\t\t");
    printf("--------------------------->\t\t\n");
    // x axis
    printf("   50   100   150   200   ");
    printf("\t\t");
    printf("   50   100   150   200   ");
    printf("\t\t");
    printf("   50   100   150   200   \n");


    printf("\t   ");
    print_color(red, "Red");
    printf("\t\t\t\t\t   ");
    print_color(green, "Green");
    printf("\t\t\t\t   ");
    print_color(blue, "Blue");

}

void print_table(ColorMode red, ColorMode green, ColorMode blue)
{
    system("clear");


    printf("^\t\t\t\t\t^\t\t\t\t\t^\t\n");
    for (int i=10; i>=0;i--)
    {
        // RED

        print_color_block(i, red);

        // GREEN
        printf("\t\t");
        print_color_block(i, green);


        // BLUE
        printf("\t\t");
        print_color_block(i, blue);
        printf("\n");
    }


    print_x_axis(red, green, blue);
    printf("\n\n\n");
}
