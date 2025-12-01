sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/unified/ColorPicker"
], function (Controller, MessageToast, Dialog, Button, ColorPicker) {
	"use strict";

	return Controller.extend("qrgen.controller.App", {
		
		onInit: function () {
			// Initialization
		},

		/**
		 * Generate QR code button handler
		 */
		onGenerateQR: function () {
			var oQRControl = this.byId("qrGenerator");
			var sText = this.getView().getModel().getProperty("/text");
			
			if (!sText) {
				this._showMessage("Please enter text to generate QR code", "Warning");
				return;
			}
			
			// Regenerate QR code
			oQRControl.setText(sText);
			MessageToast.show("Generating QR code...");
		},

		/**
		 * Download QR code as image
		 */
		onDownloadQR: function () {
			var oQRControl = this.byId("qrGenerator");
			var sText = this.getView().getModel().getProperty("/text");
			
			if (!sText) {
				this._showMessage("Please generate a QR code first", "Warning");
				return;
			}
			
			// Create filename from text (sanitized)
			var sFileName = this._sanitizeFileName(sText) + ".png";
			oQRControl.downloadQRCode(sFileName);
			
			MessageToast.show("Downloading QR code...");
		},

		/**
		 * Clear the text input
		 */
		onClearText: function () {
			this.getView().getModel().setProperty("/text", "");
			MessageToast.show("Text cleared");
		},

		/**
		 * Event handler when QR code is successfully generated
		 */
		onQRGenerated: function (oEvent) {
			var sDataUrl = oEvent.getParameter("dataUrl");
			this._showMessage("QR code generated successfully!", "Success");
		},

		/**
		 * Event handler when QR code generation fails
		 */
		onQRError: function (oEvent) {
			var sMessage = oEvent.getParameter("message");
			this._showMessage("Error: " + sMessage, "Error");
		},

		/**
		 * Show message in message strip
		 * @private
		 */
		_showMessage: function (sMessage, sType) {
			var oMessageStrip = this.byId("messageStrip");
			oMessageStrip.setText(sMessage);
			oMessageStrip.setType(sType);
			oMessageStrip.setVisible(true);

            if (sType === "Success") {
                this.byId("actionToolbar").setVisible(true);
            } else {
                this.byId("actionToolbar").setVisible(false);
            }
		},

		/**
		 * Sanitize filename by removing invalid characters
		 * @private
		 */
		_sanitizeFileName: function (sText) {
			// Remove invalid filename characters and limit length
			var sSanitized = sText.replace(/[^a-z0-9]/gi, '_').toLowerCase();
			return sSanitized.substring(0, 30) || "qrcode";
		},

        onQRPress: function () {
            MessageToast.show("QR code clicked!");
        },

		/**
		 * Open color picker dialog
		 */
		onColorPickerOpen: function (oEvent) {
			var oSource = oEvent.getSource();
			var sCurrentColor = oSource.getValue();
			var sBindingPath = oSource.getBinding("value").getPath();
			
			// Create color picker if not exists
			if (!this._oColorPickerDialog) {
				this._oColorPickerDialog = new Dialog({
					title: "Select Color",
					content: [
						new ColorPicker({
							id: this.createId("colorPicker"),
							colorString: sCurrentColor,
							displayMode: "Default"
						})
					],
					beginButton: new Button({
						text: "OK",
						press: function () {
							var oColorPicker = this.byId("colorPicker");
							var sColor = oColorPicker.getColorString();
							this.getView().getModel().setProperty(sBindingPath, sColor);
							this._oColorPickerDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this._oColorPickerDialog.close();
						}.bind(this)
					})
				});
				this.getView().addDependent(this._oColorPickerDialog);
			}
			
			// Update color picker and binding path
			var oColorPicker = this.byId("colorPicker");
			oColorPicker.setColorString(sCurrentColor);
			this._currentBindingPath = sBindingPath;
			
			this._oColorPickerDialog.open();
		}
	});
});
