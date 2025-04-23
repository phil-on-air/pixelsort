# #iiooio_stripes_gen

A web-based pixel sorting tool that creates glitch art effects by sorting pixels in dark areas of images. This tool allows you to create unique, abstract patterns by manipulating pixel brightness values.

![Demo](demo.gif)

## Features

- 🖼️ Drag & drop image upload
- 🎨 Dark theme interface
- 🔄 Multiple sorting directions (horizontal/vertical)
- 🌓 Configurable brightness threshold
- ⬆️⬇️ Sort from dark to light or light to dark
- 🔄 Process image multiple times from current state
- 💾 Download processed images
- 🔙 Reset to original image

## Usage

1. Upload an image by dragging and dropping or clicking the upload area
2. Adjust the settings:
   - **Sort Direction**: Choose between horizontal or vertical sorting
   - **Sort Order**: Select dark to light or light to dark sorting
   - **Brightness Threshold**: Set the threshold for pixel sorting (0-255)
3. Click "Process Image" to apply the effect
4. You can:
   - Process the image again with different settings
   - Reset to the original image
   - Download the result

## How It Works

The tool identifies dark areas in the image (pixels below the brightness threshold) and sorts them based on their brightness values. This creates distinctive glitch art effects where:

- Dark areas are sorted while bright areas remain untouched
- Each dark interval is sorted independently
- The sorting can be applied multiple times to create layered effects

## Technical Details

- Built with vanilla JavaScript
- Uses HTML5 Canvas for image processing
- No external dependencies
- Responsive design
- Dark theme optimized for visual comfort

## License

MIT License - feel free to use and modify for your own projects.

## Author

Created by [@phil-on-air](https://github.com/phil-on-air) 