#include <stdbool.h>
#include <string.h>

#include "editor.h"

#define DEFAULT_VALUE "found";
int ARGC;
char** ARGV;

char* INPUT_PATH;
char* OUTPUT_PATH;

void help();
char* find_argument(char* arg, bool raise);
void parse_args(int argc, char *argv[]);