# SAPUI5 QR Code Generator

A custom SAPUI5 control for generating QR code images from text input.

## Features

- **Custom SAPUI5 Control**: Reusable `QRGenerator` control that extends `sap.ui.core.Control`
- **Flexible Configuration**: Customizable width, height, colors, and error correction levels
- **Multiple Generation Methods**: 
  - Uses QRCode.js library if available
  - Falls back to online API (qrserver.com)
  - Simple pattern fallback for offline scenarios
- **Download Capability**: Export QR codes as PNG images
- **Event Handling**: Fires events on successful generation or errors
- **Responsive UI**: Works on desktop, tablet, and phone devices

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Quick Start

```bash
npm start
```

The application will automatically open at `http://localhost:8080/index.html`

## Usage

### Basic Usage in XML View

```xml
<mvc:View
    xmlns:qr="qrgen.control"
    xmlns:mvc="sap.ui.core.mvc">
    
    <qr:QRGenerator
        text="Hello World"
        width="256"
        height="256"
        errorCorrectionLevel="M"
        colorDark="#000000"
        colorLight="#ffffff"
        generated=".onQRGenerated"
        error=".onQRError"/>
</mvc:View>
```

### Programmatic Usage

```javascript
var oQRGenerator = new qrgen.control.QRGenerator({
    text: "Hello SAPUI5",
    width: 300,
    height: 300,
    errorCorrectionLevel: "H",
    generated: function(oEvent) {
        var sDataUrl = oEvent.getParameter("dataUrl");
        console.log("QR Code generated:", sDataUrl);
    }
});

oQRGenerator.placeAt("content");
```

### Download QR Code

```javascript
var oQRControl = this.byId("qrGenerator");
oQRControl.downloadQRCode("my-qr-code.png");
```

## Control Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | string | "" | The text to encode in the QR code |
| `width` | int | 256 | Width of the QR code in pixels |
| `height` | int | 256 | Height of the QR code in pixels |
| `errorCorrectionLevel` | string | "M" | Error correction level: L (7%), M (15%), Q (25%), H (30%) |
| `colorDark` | string | "#000000" | Color of the QR code modules |
| `colorLight` | string | "#ffffff" | Color of the QR code background |

## Control Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `generated` | dataUrl: string | Fired when QR code is successfully generated |
| `error` | message: string | Fired when an error occurs during generation |

## Control Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getDataUrl()` | - | string | Get the data URL of the generated QR code |
| `downloadQRCode(sFileName)` | sFileName: string | - | Download the QR code as an image file |

## Project Structure

```
webapp/
├── control/
│   └── QRGenerator.js          # Custom QR Generator control
├── controller/
│   └── App.controller.js       # Main controller
├── view/
│   └── App.view.xml            # Main view
├── css/
│   └── style.css               # Styles
├── i18n/
│   └── i18n.properties         # Internationalization
├── Component.js                # Component initialization
├── manifest.json               # App descriptor
└── index.html                  # Entry point
```

## QR Generation Methods

The control uses a fallback approach:

1. **QRCode.js Library** (Recommended): If the QRCode.js library is loaded in index.html, it will be used for local generation
2. **Online API**: Falls back to qrserver.com API for generation
3. **Pattern Fallback**: If both fail, displays a simple hash-based pattern

### Using QRCode.js Library

Uncomment this line in `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

## Browser Compatibility

- Modern browsers with Canvas API support
- IE11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome, Samsung Internet)

## License

Apache License 2.0 - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Demo Application

The included demo application provides:
- Text input for QR code content
- Configuration options for size, colors, and error correction
- Real-time QR code generation
- Download functionality
- Status messages and error handling

Open `webapp/index.html` to see the demo in action.
Or https://tabaothanh.github.io/SAPUI5-QRGenerator/webapp/index.html
