# Outliner - HTML Element Inspector

A professional Chrome extension for web developers and designers to inspect and highlight HTML elements with custom outlines. Perfect for visualizing page structure and debugging layouts.

## ✨ Features

- **Element Outlining**: Highlight all HTML elements with customizable outlines
- **Customizable Styles**: Choose from solid, dashed, dotted, or double outline styles
- **Color & Width Control**: Adjust outline color and thickness to your preference
- **Element Information**: Hover over elements to see detailed information (tag, ID, classes, dimensions)
- **Targeted Selection**: Use CSS selectors to highlight specific elements only
- **Local File Support**: Works on local HTML files and all web pages
- **Real-time Updates**: Changes apply immediately without page refresh

## 🚀 Installation

### From Chrome Web Store (Recommended)

1. Visit the Chrome Web Store
2. Search for "Outliner - HTML Element Inspector"
3. Click "Add to Chrome"

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder

## 📖 How to Use

1. **Enable Outlines**: Click the extension icon and press "ENABLE OUTLINES"
2. **Customize Appearance**:
   - Change outline color using the color picker
   - Adjust outline width with the slider (1-10px)
   - Select outline style (solid, dashed, dotted, double)
3. **Element Information**: Enable "Show Element Info" and hover over elements
4. **Target Specific Elements**: Use CSS selectors in the "Target Elements" field (e.g., `.button`, `#header`, `[data-testid]`)

## 🎨 Customization Options

### Outline Styles

- **Solid**: Standard continuous line
- **Dashed**: Broken line pattern
- **Dotted**: Dotted line pattern
- **Double**: Two parallel lines

### Color Options

- Choose any color using the color picker
- Enter hex color codes manually
- Default color: #00ff9d (neon green)

### Width Range

- Adjustable from 1px to 10px
- Real-time preview of changes

## 🔧 Technical Details

- **Manifest Version**: 3 (Latest Chrome extension standard)
- **Permissions**: Minimal permissions required (activeTab, storage)
- **Compatibility**: Chrome 88+ and Chromium-based browsers
- **Performance**: Lightweight and fast, no impact on page performance
- **Security**: No data collection or external requests

## 🛠️ Development

### Project Structure

```
Outliner/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for page interaction
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Building for Production

1. Ensure all files are properly organized
2. Test thoroughly on various websites
3. Create a ZIP file of the extension folder
4. Submit to Chrome Web Store Developer Dashboard

## 🐛 Troubleshooting

### Common Issues

- **Extension not working**: Reload the extension in `chrome://extensions/`
- **No outlines visible**: Check if outlines are enabled in the popup
- **Settings not saving**: Ensure storage permission is granted
- **Local files not working**: Make sure you're using `file://` URLs

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Opera (Chromium-based)

## 📝 Privacy & Security

- **No Data Collection**: This extension does not collect or transmit any user data
- **Local Storage Only**: Settings are stored locally in your browser
- **No External Requests**: The extension doesn't make any network requests
- **Open Source**: Full source code available for transparency

## 🤝 Contributing

We welcome contributions! Please feel free to:

- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern Chrome Extension APIs
- Designed for web developers and designers
- Inspired by browser developer tools

## 📞 Support

For support, questions, or feature requests:

- Create an issue on GitHub
- Contact: <mohamed.devmaster@gmail.com>

---

**Made with ❤️ for the web development community**
