sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	/**
	 * QRGenerator Control
	 * Generates QR code images from text input
	 * @extends sap.ui.core.Control
	 */
	return Control.extend("qrgen.control.QRGenerator", {
		metadata: {
			properties: {
				/**
				 * The text to encode in the QR code
				 */
				text: { type: "string", defaultValue: "" },
				
				/**
				 * Width of the QR code in pixels
				 */
				width: { type: "string", defaultValue: "256" },
				
				/**
				 * Height of the QR code in pixels
				 */
				height: { type: "string", defaultValue: "256" },
				
				/**
				 * Error correction level: L (7%), M (15%), Q (25%), H (30%)
				 */
				errorCorrectionLevel: { type: "string", defaultValue: "M" },
				
				/**
				 * Color of the QR code modules (dark)
				 */
				colorDark: { type: "string", defaultValue: "#000000" },
				
				/**
				 * Color of the QR code background (light)
				 */
				colorLight: { type: "string", defaultValue: "#ffffff" }
			},
			aggregations: {},
			events: {
				/**
				 * Fired when the QR code is successfully generated
				 */
				generated: {
					parameters: {
						/**
						 * The data URL of the generated QR code image
						 */
						dataUrl: { type: "string" }
					}
				},
				
				/**
				 * Fired when an error occurs during generation
				 */
				error: {
					parameters: {
						/**
						 * The error message
						 */
						message: { type: "string" }
					}
				},
				
				/**
				 * Fired when the QR code is clicked
				 */
				press: {
					parameters: {}
				}
			}
		},

		init: function () {
			// Initialize
		},

		onAfterRendering: function () {
			// Only generate QR code on first rendering
			this._generateQRCode();
			
			// Attach click handler
			this._attachClickHandler();
		},
		
		/**
		 * Attach click event handler to the QR code
		 * @private
		 */
		_attachClickHandler: function () {
			var oContainer = document.getElementById(this.getId());
			if (oContainer && !this._bClickHandlerAttached) {
				// Only add pointer cursor if press event has handlers attached
				if (this.hasListeners("press")) {
					oContainer.style.cursor = "pointer";
				}
				oContainer.onclick = function () {
					this.firePress();
				}.bind(this);
				this._bClickHandlerAttached = true;
			}
		},

		renderer: function (oRM, oControl) {
			oRM.openStart("div", oControl);
			oRM.class("sapUiQRGenerator");
			oRM.openEnd();
			
			oRM.close("div");
		},

		/**
		 * Generates the QR code using a simple algorithm
		 * @private
		 */
		_generateQRCode: function () {
			var sText = this.getText();
			
			if (!sText) {
				this.fireError({ message: "No text provided for QR code generation" });
				return;
			}

			var oQRDiv = document.getElementById(this.getId());
			if (!oQRDiv) {
				return;
			}
			
			// Use QRCode library
			if (typeof QRCode !== "undefined") {
				this._generateWithLibrary(oQRDiv, sText);
			} else {
				this.fireError({ message: "QRCode library not loaded" });
			}
		},

		/**
		 * Generate QR code using QRCode.js library (if loaded)
		 * @private
		 */
		_generateWithLibrary: function (oQRDiv, sText) {
			try {
				if (this._oQRCode) {
                    // Clear existing QR code if it exists
                    oQRDiv.textContent = '';
				}

                this._oQRCode = new QRCode(oQRDiv, {
                    text: sText,
                    width: parseInt(this.getWidth(), 10),
                    height: parseInt(this.getHeight(), 10),
                    colorDark: this.getColorDark(),
                    colorLight: this.getColorLight(),
                    correctLevel: this._getCorrectLevel()
                });
				
				// Fire generated event
				setTimeout(function () {
					this.fireGenerated({ dataUrl: this.getDataUrl() });
				}.bind(this), 100);
			} catch (e) {
				this.fireError({ message: "QR code generation failed: " + e.message });
			}
		},

		/**
		 * Get QRCode.js correct level constant
		 * @private
		 */
		_getCorrectLevel: function () {
			if (typeof QRCode === "undefined") {
				return this.getErrorCorrectionLevel();
			}
			
			switch (this.getErrorCorrectionLevel()) {
				case "L": return QRCode.CorrectLevel.L;
				case "M": return QRCode.CorrectLevel.M;
				case "Q": return QRCode.CorrectLevel.Q;
				case "H": return QRCode.CorrectLevel.H;
				default: return QRCode.CorrectLevel.M;
			}
		},

		/**
		 * Get the data URL of the generated QR code
		 * @public
		 * @returns {string} The data URL
		 */
		getDataUrl: function () {
			// Try to find canvas created by QRCode.js library
			var oContainer = document.getElementById(this.getId());
			if (oContainer) {
				var oCanvas = oContainer.querySelector("canvas");
				if (oCanvas) {
					return oCanvas.toDataURL();
				}
			}
			return "";
		},

		/**
		 * Download the QR code as an image file
		 * @public
		 * @param {string} sFileName - The name of the file to download
		 */
		downloadQRCode: function (sFileName) {
			sFileName = sFileName || "qrcode.png";
			var sDataUrl = this.getDataUrl();
			
			if (sDataUrl) {
				var oLink = document.createElement("a");
				oLink.download = sFileName;
				oLink.href = sDataUrl;
				oLink.click();
			}
		},

		/**
		 * Property setter override to regenerate QR code on text change
		 */
		setText: function (sText) {
			this.setProperty("text", sText, false);
			this._generateQRCode();
			return this;
		}
	});
});
