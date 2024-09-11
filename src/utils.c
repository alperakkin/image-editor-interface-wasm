#include "utils.h"


void split_args(char* expression, char** factors, char separator)
{
    char *token;
    int ind = 0;

    token = strtok(expression, &separator);

    while (token != NULL)
    {
        factors[ind++] = token;
        token = strtok(NULL, &separator);
    }
}




void raise_error(char* message)
{
    printf("\033[31mError: %s\n\033[0m", message);
    exit(1);
}





int** alloc_matrix(int width, int height)
{
    int** rows = malloc(height * sizeof(int*));
    for (int i = 0; i < height; i++)
    {
        rows[i] = malloc(width * sizeof(int));

        for(int j = 0; j < width; j++)
        {
            rows[i][j] = 0;
        }
    }
    return rows;
}
