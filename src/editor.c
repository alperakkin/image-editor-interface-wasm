#include <emscripten.h>
#include "editor.h"

EMSCRIPTEN_KEEPALIVE

Image result;

Image grayscale(Image image)
{
    for (int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
          png_bytep px = &(row[x * 4]);
          int avg = (int)(px[0] + px[1] + px[2]) / 3;
          px[0] = avg;
          px[1] = avg;
          px[2] = avg;
        }
    }
 result = image;
 return image;
}



Image  contrast(Image image, float f)
{
    Statistics statistics = intensity(image);

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);


            int red = ((int) (statistics.avg_red + (int) ((px[0] - statistics.avg_red) * f)));
            int green = ((int) (statistics.avg_green + (int) ((px[1] - statistics.avg_green) * f)));
            int blue = ((int) (statistics.avg_blue + (int) ((px[2] - statistics.avg_blue) * f)));

            red = (int) max(0,  min(255, red));
            green = (int) max(0, min(255, green));
            blue = (int) max(0,  min(255, blue));

            px[0] = red;
            px[1] = green;
            px[2] = blue;




        }
    }

    return image;


}

Image brightness(Image image, float ratio)
{

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);


            int red = (int) px[0] * ratio;
            int green = (int) px[1] * ratio;
            int blue = (int) px[2] * ratio;



            if (red > 255) red = 255;
            if (red < 0) red = 0;
            if (green > 255) green = 255;
            if (green < 0) green = 0;
            if (blue > 255) blue = 255;
            if (blue < 0) blue = 0;


            px[0] = red;
            px[1] = green;
            px[2] = blue;


        }
    }



    return image;

}




Image gaussian(Image image, int kernel_size, float sigma)
{
    double **kernel = kernel_filter(kernel_size, sigma);
    apply_kernel(kernel, kernel_size, image);

    return image;
}

Image resize(Image image, int width, int height)
{

    Image new_image = alloc_image(width, height);

    double x_scale = (double)image.width/width;
    double y_scale = (double) image.height/height;

    for (int i=0; i<height; i++){

        for (int j=0; j<width; j++){

            int row_val = (int) (i * y_scale);
            int col_val = (int) (j * x_scale);


            png_bytep px = &(image.pixels[row_val][col_val * 4]);

            png_bytep px_n = &(new_image.pixels[i][j * 4]);


            px_n[0] = px[0];  // R
            px_n[1] = px[1];  // G
            px_n[2] = px[2];  // B
            px_n[3] = px[3];  // Alpha




        }

    }


    free_image(image);
    return new_image;

}


void histogram(Image image)
{
    ColorMode red = {
        .name = "red",
        .value = "31",
        .min = 1000000,
        .max = 0,
        .histogram = {
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0
        }
    };
    ColorMode green = {
        .name = "green",
        .value = "32",
        .min = 1000000,
        .max = 0,
        .histogram = {
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0
        }
    };
    ColorMode blue = {
        .name = "blue",
        .value = "34",
        .min = 1000000,
        .max = 0,
        .histogram = {
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,0,0,0
        }
    };

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            int block = (int) 25*px[0]/255;
            red.histogram[block]++;
            block = (int) 25*px[1]/255;
            green.histogram[block]++;
            block = (int) 25*px[2]/255;
            blue.histogram[block]++;


            if (red.max < px[0]) red.max=px[0];
            if (blue.max < px[1]) blue.max=px[1];
            if (green.max < px[2]) green.max=px[2];

            if (red.min > px[0]) red.min=px[0];
            if (blue.min > px[1]) blue.min=px[1];
            if (green.min > px[2]) green.min=px[2];

        }
    }


    print_table(red, green, blue);
    free_image(image);


}

Image filter(Image image, char* color, float strength)
{



    char* hex_code = color;

    Color RGB_color = hex_to_rgb(hex_code);

    if (strength > 1.0) strength = 1.0;

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            px[0] = (int) (strength * RGB_color.R + (1-strength) * px[0]);
            px[1] = (int) (strength * RGB_color.G + (1-strength) * px[1]);
            px[2] = (int) (strength * RGB_color.B + (1-strength) * px[2]);

        }
    }

    return image;
}

Image opacity(Image image, float factor)
{
    if (factor > 1) factor = 1;

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            px[3] = (int) (factor * 255);


        }
    }

    return image;

}

Image add_layer(Image image, Image patch, int pos_x, int pos_y, int alpha)
{
    if (pos_x < 0 || pos_x > image.width || pos_y < 0 || pos_y > image.height)  raise_error("Invalid position!");

    for(int y = 0; y < patch.height; y++)
    {
        png_bytep row = patch.pixels[y];
        for(int x = 0; x < patch.width; x++)
        {
           png_bytep px = &(row[x * 4]);
           int org_x = x + pos_x;
           int org_y = y + pos_y;
           if (org_x <= image.width && org_y <= image.height)
           {
            png_bytep image_row = image.pixels[org_y];
            png_bytep org_px = &(image_row[org_x * 4]);

            if (px[3] <= alpha) continue;

            org_px[0] = px[0];
            org_px[1] = px[1];
            org_px[2] = px[2];



           }





        }
    }

    return image;
}

Image crop(Image image, int left, int right, int top, int bottom)
{
    if (left < 0 || left > image.width || top < 0 || top > image.height ||
        right < 0 || right > image.width || bottom < 0 || bottom > image.height)  raise_error("Invalid Crop Parameters!");

    int new_height = image.height - (top + bottom);
    int new_width = image.width - (left + right);

    Image cropped = alloc_image(new_width, new_height);


    for(int y = 0; y < cropped.height; y++)
    {
        png_bytep row = cropped.pixels[y];
        png_bytep org_row = image.pixels[y+top];
        for(int x = 0; x < cropped.width; x++)
        {

            png_bytep px = &(row[x * 4]);
            png_bytep org_px = &(org_row[(x + left) * 4]);

            px[0] = org_px[0];
            px[1] = org_px[1];
            px[2] = org_px[2];
            px[3] = org_px[3];
        }
    }


    free_image(image);
    return cropped;

}



Image rotate_image(Image image, double angle)
{

    double radians = angle * M_PI / 180;
    double cos_value =  cos(radians);
    double sin_value = sin(radians);
    int width = image.width;
    int height = image.height;
    const int SCALE = 4;

    image = resize(image, image.width * SCALE, image.height * SCALE);

    int new_width = (int)(fabs(image.width * cos_value) + fabs(image.height * sin_value));
    int new_height = (int)(fabs(image.width * sin_value) + fabs(image.height * cos_value));

    Image rotated = alloc_image(new_width, new_height);


    int x0 = (int) image.width / 2;
    int y0 = (int) image.height / 2;

    int new_x0 = new_width / 2;
    int new_y0 = new_height / 2;

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];

        for(int x = 0; x < image.width; x++)
        {
            int new_x = (int) (new_x0 + (x-x0) * cos_value + (y-y0) * sin_value);
            int new_y = (int) (new_y0 - (x-x0) * sin_value + (y-y0) * cos_value);


            if (new_x < 0 || new_x >= new_width || new_y < 0 || new_y >= new_height) continue;

            png_bytep rotated_row = rotated.pixels[new_y];
            png_bytep px = &(row[x * 4]);
            png_bytep rotated_px = &(rotated_row[new_x * 4]);




            rotated_px[0] = px[0];
            rotated_px[1] = px[1];
            rotated_px[2] = px[2];
            rotated_px[3] = px[3];

        }
    }


    rotated = bilinear_interpolation(rotated);
    int kernel_size = 6;
    float sigma = 1.8;
    rotated = gaussian(rotated, kernel_size, sigma);
    rotated = resize(rotated,width, height);





    return rotated;
}

Image invert(Image image)
{
    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            px[0] = 255 - px[0];
            px[1] = 255 - px[1];
            px[2] = 255 - px[2];



        }
    }

    return image;
}


Image add_border(Image image, char* color, int size)
{

    Color color_rgb = hex_to_rgb(color);

    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);


            if (x < size || x > (image.width - size) ||
                y < size || y > (image.height - size))
                {
                    px[0] = color_rgb.R;
                    px[1] = color_rgb.G;
                    px[2] = color_rgb.B;

                }

        }
    }

    return image;
}


Image mask(Image image, char* color, float threshold)
{


    Color color_rgb = hex_to_rgb(color);



    int r_min = (int) (color_rgb.R * threshold);
    int g_min = (int) (color_rgb.G * threshold);
    int b_min = (int) (color_rgb.B * threshold);

    int r_max = (int)(color_rgb.R + (255 - color_rgb.R) * (1 - threshold));
    int g_max = (int)(color_rgb.G + (255 - color_rgb.G) * (1 - threshold));
    int b_max = (int)(color_rgb.B + (255 - color_rgb.B) * (1 - threshold));


    for(int y = 0; y < image.height; y++)
    {
        png_bytep row = image.pixels[y];

        for(int x = 0; x < image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            if( px[0] >= r_min && px[0] <= r_max &&
                px[1] >= g_min && px[1] <= g_max &&
                px[2] >= b_min && px[2] <= b_max
            )
            {

                px[3] = 0;
            }

        }
    }
    return image;
}


Image edge(Image image, int high_threshold, int low_threshold)
{
    int KERNEL_SIZE = 5;
    float SIGMA = 1.5;
    Image blurred = gaussian(image, KERNEL_SIZE, SIGMA);
    Image gray_image = grayscale(blurred);
    int** sobel_x = sobel_filter(gray_image, 'x');
    int** sobel_y = sobel_filter(gray_image, 'y');
    int** gradient_dir = gradient_direction(sobel_x, sobel_y, image.width, image.height);
    int** gradient_mag = gradient_magnitude(sobel_x, sobel_y, image.width, image.height);
    int** suppr = non_maximum_suppression(gradient_mag, gradient_dir, image.width, image.height);
    Image dbl_thresh = double_threshold(gray_image, suppr, high_threshold, low_threshold);
    Image result = edge_tracking(dbl_thresh);

    return result;
}

void match_template(Image image, Image template, float threshold)
{

  int total_match = 0;

  for (int y=0; y<(image.height - template.height); y++)
  {

    for (int x=0; x<(image.width - template.width); x++)
    {

        for(int ty=0; ty<template.height; ty++)
        {
            png_bytep row = image.pixels[ty+y];
            png_bytep tmp_row = template.pixels[ty];
            for(int tx=0; tx<template.width; tx++)
            {
                png_bytep px = &(row[(tx+x) * 4]);
                png_bytep tmp_px = &(tmp_row[tx * 4]);



                if (
                    (px[0] >= (int) tmp_px[0]*threshold && px[0] <= tmp_px[0])  &&
                    (px[1] >= (int) tmp_px[1]*threshold && px[1] <= tmp_px[1])  &&
                    (px[2] >= (int) tmp_px[2]*threshold && px[2] <= tmp_px[2])  &&
                    (px[3] >= (int) tmp_px[3]*threshold && px[3] <= tmp_px[3])
                    ) {

                        total_match++;


                        if (total_match == (template.width*template.height))
                        {
                            printf("Found: [Top Left: (%d, %d) - Bottom Right: (%d, %d)]\n", x, y, x + template.width, y+template.height);
                            exit(0);
                        }

                    }
                else{
                    total_match = 0;
                }



            }

            if (total_match == 0) continue;

        }

    }

  }

}

void check_color(Image image, char *color, float threshold)
{

    Color color_rgb = hex_to_rgb(color);
    int total_matches = 0;
    char *state;

    if(strlen(color) < 9) color_rgb.A = 255;

    for (int y=0; y<image.height; y++)
    {
        png_bytep row = image.pixels[y];

        for (int x=0; x<image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            if (
                px[0] >= (int) color_rgb.R*threshold && px[0] <= color_rgb.R &&
                px[1] >= (int) color_rgb.B*threshold && px[0] <= color_rgb.B &&
                px[2] >= (int) color_rgb.G*threshold && px[0] <= color_rgb.G &&
                px[3] >= (int) color_rgb.A*threshold && px[0] <= color_rgb.A

            ) total_matches++;
        }
    }
    float ratio =   (float) total_matches / (float) (image.width * image.height);

    printf("[Color: %s Fill Ratio: %f %%]\n", color, ratio*10);
}

Image vignette(Image image, float ratio)
{
    int center_x = (int) image.width / 2;
    int center_y = (int) image.height / 2;

    double r_max = sqrt(
        ((image.width -1 - center_x) * (image.width -1 - center_x)) +
        ((image.height -1 - center_y) * (image.height -1 - center_y))
    ) * ratio;

    for (int y=0; y<image.height; y++)
    {
        png_bytep row = image.pixels[y];

        for (int x=0; x<image.width; x++)
        {
            png_bytep px = &(row[x * 4]);

            double distance =  sqrt(
                ((x-center_x)*(x-center_x)) + ((y-center_y)*(y-center_y))
            );

            double vignette_factor = 1 - ((distance / r_max) * (distance / r_max));

            px[0] = (int) px[0] * vignette_factor;
            px[1] = (int) px[1] * vignette_factor;
            px[2] = (int) px[2] * vignette_factor;

            if (px[0] > 255) px[0] = 255;
            if (px[1] > 255) px[1] = 255;
            if (px[2] > 255) px[2] = 255;
        }

    }
    return image;
}