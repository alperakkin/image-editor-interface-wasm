#include <emscripten.h>
#include <stdint.h>
#include "editor.h"

EMSCRIPTEN_KEEPALIVE
void grayscale(uint8_t* pixels, int width, int height)
{
    for (int y = 0; y < height; y++)
    {
        for(int x = 0; x < width*4; x+=4)
        {
          int cursor = y * width * 4 + x;

          int avg = (int)(pixels[cursor] + pixels[cursor+1] + pixels[cursor+2]) / 3;
          pixels[cursor] = avg;
          pixels[cursor+1] = avg;
          pixels[cursor+2] = avg;
        }
    }

}