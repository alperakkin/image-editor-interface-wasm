CC = gcc
CFLAGS = -I./src/include

SRC = src/main.c
OBJ = $(SRC:src/%.c=build/%.o)


TARGET = bin/main.exe

all: clean build compile

build:
	powershell -Command "New-Item -ItemType Directory -Path 'build'"
	powershell -Command "New-Item -ItemType Directory -Path 'bin'"
	
compile: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) -o $@ $^ $(EXTERNAL)

build/%.o: src/%.c
	$(CC) $(CFLAGS) -c -o $@ $<


.PHONY: clean

clean:
	powershell -Command "Remove-Item -Path 'bin' -Recurse -ErrorAction SilentlyContinue; exit 0"
	powershell -Command "Remove-Item -Path 'build' -Recurse -ErrorAction SilentlyContinue; exit 0"

