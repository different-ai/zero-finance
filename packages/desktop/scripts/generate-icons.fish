#!/usr/bin/env fish

# Create necessary directories
mkdir -p build/icons

# Save the source image to PNG format
set SOURCE_IMAGE "Frame 31.png"

# Generate Linux PNG icons
for size in 16 32 48 64 128 256 512
    magick $SOURCE_IMAGE -resize {$size}x{$size} build/icons/{$size}x{$size}.png
end

# Generate Windows ICO
magick $SOURCE_IMAGE -define icon:auto-resize=256,128,64,48,32,16 build/icons/icon.ico

echo "Icon generation complete!" 