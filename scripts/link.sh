rm -rf external/image-editor
mkdir external/image-editor

ln -s -f "$(PWD)/../image-editor/src/" external/image-editor/src
ln -s -f "$(PWD)/../image-editor/include/" external/image-editor/include