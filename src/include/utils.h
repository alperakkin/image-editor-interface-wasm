#include <ctype.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

void split_args(char* expression, char** factors, char separator);

void raise_error(char* message);

int** alloc_matrix(int width, int height);