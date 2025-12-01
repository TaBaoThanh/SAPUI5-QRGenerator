sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("qrgen.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			// Call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// Create a model for the QR generator demo
			var oModel = new JSONModel({
				text: "Hello SAPUI5 QR Generator!",
				width: 450,
				height: 450,
				errorCorrectionLevel: "M",
				colorDark: "#000000",
				colorLight: "#ffffff"
			});
			this.setModel(oModel);
		}
	});
});
