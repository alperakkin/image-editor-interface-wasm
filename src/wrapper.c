#include <emscripten.h>
#include <stdint.h>
#include "editor.h"


void flatten_pixels(Image image, uint8_t *pixels)
{
  int index = 0;


  for (int y = 0; y < image.height; y++)
  {
        png_bytep row = image.pixels[y];
        for(int x = 0; x < image.width; x++)
        {
          png_bytep px = &(row[x * 4]);
          pixels[index] = px[0];
          pixels[index+1] = px[1];
          pixels[index+2] = px[2];
          pixels[index+3] = px[3];
          index += 4;
        }
    }

}


Image create_image(uint8_t* pixels, int width, int height)
{

    Image image = alloc_image(width, height);

    for (int y = 0; y < height; y++)
     {
        for (int x = 0; x < width; x++)
        {
            int index = (y * width + x) * 4;
            image.pixels[y][x * 4] = pixels[index];     // R
            image.pixels[y][x * 4 + 1] = pixels[index + 1]; // G
            image.pixels[y][x * 4 + 2] = pixels[index + 2]; // B
            image.pixels[y][x * 4 + 3] = pixels[index + 3]; // A
        }
    }
return image;

}


EMSCRIPTEN_KEEPALIVE
void grayscale_wrapper(uint8_t* pixels, int width, int height)
{

  Image img = create_image(pixels, width, height);
  img = grayscale(img);
  flatten_pixels(img, pixels);
}


void contrast_wrapper(uint8_t* pixels, int width, int height, float f)
{

  Image img = create_image(pixels, width, height);
  img = contrast(img, f);
  flatten_pixels(img, pixels);
}

void brightness_wrapper(uint8_t* pixels, int width, int height, float ratio)
{
  Image img = create_image(pixels, width, height);
  img = brightness(img, ratio);
  flatten_pixels(img, pixels);

}

void gaussian_wrapper(uint8_t* pixels, int width, int height, int kernel_size, float sigma)
{
    Image img = create_image(pixels, width, height);
    img = gaussian(img, kernel_size, sigma);
    flatten_pixels(img, pixels);
}

void resize_wrapper(uint8_t* pixels, int width, int height, int new_width, int new_height)
{
    Image img = create_image(pixels, width, height);
    img = resize(img, new_width, new_height);
    flatten_pixels(img, pixels);
}

void histogram_wrapper(uint8_t* pixels, int width, int height, uint16_t* red, uint16_t* green, uint16_t* blue)
{
      ColorMode red_mode = {
        .name = "red",
        .value = "31",
        .min = 1000000,
        .max = 0,
        .histogram = {0}
    };
    ColorMode green_mode = {
        .name = "green",
        .value = "32",
        .min = 1000000,
        .max = 0,
        .histogram = {0}
    };
    ColorMode blue_mode = {
        .name = "blue",
        .value = "34",
        .min = 1000000,
        .max = 0,
        .histogram = {0}

    };
    Image img = create_image(pixels, width, height);
    histogram(img, &red_mode, &green_mode, &blue_mode);

    for (int i=0; i<255; i++)
    {
      red[i] = red_mode.histogram[i];
      green[i] = green_mode.histogram[i];
      blue[i] = blue_mode.histogram[i];

    }



}