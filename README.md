# Element Inspector Pro

A powerful Chrome extension for web developers to inspect and outline elements with customizable styles and detailed element information.

## Features

- 🔍 Customizable element outlines with color, width, and style options
- ℹ️ Detailed element information on hover
- 🎯 Target specific elements using CSS selectors
- 🎨 Modern, tech-focused interface
- 💾 Settings persistence across sessions

## Installation

### From Chrome Web Store

1. Visit the Chrome Web Store
2. Search for "Element Inspector Pro"
3. Click "Add to Chrome"
4. Confirm the installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Configure your outline settings:
   - Choose outline color
   - Set outline width
   - Select outline style
   - Enable/disable element info
3. Enter a CSS selector to target specific elements
4. Click "Enable Outlines" to start inspecting

## Target Elements Examples

- `.footer` - outlines all elements with class "footer"
- `[data-testid]` - outlines all elements with data-testid attribute
- `#header` - outlines element with id "header"
- `div > p` - outlines all paragraph elements that are direct children of divs

## Development

### Project Structure

- `manifest.json` - Extension configuration
- `popup.html` - Popup interface
- `popup.js` - Popup functionality
- `content.js` - Content script for page interaction
- `background.js` - Background script
- `icons/` - Extension icons

### Building

No build step required. The extension can be loaded directly in Chrome.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the developer.
