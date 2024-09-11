#include "image.h"


Image open_image(char* FILENAME) {
  if (FILENAME == NULL) {
        fprintf(stderr, "Error: NULL pointer passed to print_file_content.\n");
        exit(1);
    }

  FILE *fp = fopen(FILENAME, "rb");

  if (!fp) raise_error("Given path is not valid!");
  Image image;

  png_structp png = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
  if(!png) abort();

  png_infop info = png_create_info_struct(png);
  if(!info) abort();

  if(setjmp(png_jmpbuf(png))) abort();

  png_init_io(png, fp);

  png_read_info(png, info);

  image.width      = png_get_image_width(png, info);
  image.height     = png_get_image_height(png, info);
  image.color_type = png_get_color_type(png, info);
  image.bit_depth  = png_get_bit_depth(png, info);
  image.name = FILENAME;


  if(image.bit_depth == 16)
    png_set_strip_16(png);

  if(image.color_type == PNG_COLOR_TYPE_PALETTE)
    png_set_palette_to_rgb(png);

  if(image.color_type == PNG_COLOR_TYPE_GRAY && image.bit_depth < 8)
    png_set_expand_gray_1_2_4_to_8(png);

  if(png_get_valid(png, info, PNG_INFO_tRNS))
    png_set_tRNS_to_alpha(png);



  if(image.color_type == PNG_COLOR_TYPE_RGB ||
     image.color_type == PNG_COLOR_TYPE_GRAY ||
     image.color_type == PNG_COLOR_TYPE_PALETTE)
    png_set_filler(png, 0xFF, PNG_FILLER_AFTER);

  if(image.color_type == PNG_COLOR_TYPE_GRAY ||
     image.color_type == PNG_COLOR_TYPE_GRAY_ALPHA)
    png_set_gray_to_rgb(png);

  png_read_update_info(png, info);

  image.pixels = (png_bytep*)malloc(sizeof(png_bytep) * image.height);
  for(int y = 0; y < image.height; y++) {
    image.pixels[y] = (png_byte*)malloc(png_get_rowbytes(png,info));
  }

  png_read_image(png, image.pixels);

  fclose(fp);

  png_destroy_read_struct(&png, &info, NULL);

  return image;
}


Image alloc_image(int image_width, int image_height){
  Image image;
  image.width = image_width;
  image.height = image_height;
  image.pixels = (png_bytep*) malloc(sizeof(png_bytep) * image_height);
  for(int y = 0; y < image_height; y++) {
        image.pixels[y] = (png_byte*) malloc(sizeof(png_byte) * image_width * 4 );
        for (int x = 0; x < image.width; x++)
        {
            png_bytep px = &(image.pixels[y][x * 4]);
            px[0] = 0;
            px[1] = 0;
            px[2] = 0;
            px[3] = 0;
        }
  }


  return image;
}

void free_image(Image image)
{
  for(int y = 0; y < image.height; y++) {
    free(image.pixels[y]);
  }
  free(image.pixels);


}

void save_image(char *FILENAME, Image image)
{
  int y;

  FILE *fp = fopen(FILENAME, "wb");
  if(!fp) abort();

  png_structp png = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
  if (!png) abort();


  png_infop info = png_create_info_struct(png);
  if (!info) abort();


  if (setjmp(png_jmpbuf(png))) abort();


  png_init_io(png, fp);

  png_set_IHDR(
    png,
    info,
    image.width, image.height,
    8,
    PNG_COLOR_TYPE_RGBA,
    PNG_INTERLACE_NONE,
    PNG_COMPRESSION_TYPE_DEFAULT,
    PNG_FILTER_TYPE_DEFAULT
  );
  png_write_info(png, info);

  if (!image.pixels) abort();


  png_write_image(png, image.pixels);
  png_write_end(png, NULL);

  free_image(image);

  fclose(fp);

  png_destroy_write_struct(&png, &info);
}

Color hex_to_rgb(char* hex_code)
{
    Color color = {
        .R=0,
        .G=0,
        .B=0,
        .A=0
    };

    if (hex_code == NULL || strlen(hex_code) < 7) raise_error("Invalid hex code.");

    if (hex_code[0] == '#') hex_code++;

    if (strlen(hex_code)==6)
    {
        if (sscanf(hex_code, "%02hhx%02hhx%02hhx", &color.R, &color.G, &color.B) != 3) raise_error("Failed to parse hex code.\n");
    }
    if (strlen(hex_code)==8)
    {
        if (sscanf(hex_code, "%02hhx%02hhx%02hhx%02hhx", &color.R, &color.G, &color.B, &color.A) != 4) raise_error("Failed to parse hex code.\n");
    }


    return color;
}
