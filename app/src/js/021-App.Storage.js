// ---------------------------------------------------------------------------------------------------------
// Storage module
App.Storage = (function(window, document, console, undefined){
	'use strict'
	
	var provider = window.localStorage;
	
	// -----------------------------------------------------------------------------------------------------
	// Check if localStorage is available
	function isAvailable() {
		var msg = "App.Storage check for localStorage : ";
		try {
			provider.setItem(msg, msg);
			provider.removeItem(msg);
			console.log(msg + "available");
		} catch (e) {
			console.log(msg + "!!NOT!! available");
			alert("Teile der Anwendung [App.Storage] funktionieren in Ihrem Browser nicht!");
		}	
	}

	// -----------------------------------------------------------------------------------------------------
	// Write JSON data to Storage
	function write(key, jsonData) {
		provider.setItem(key, JSON.stringify(jsonData));
	}

	// -----------------------------------------------------------------------------------------------------
	// Read JSON data from Storage
	function read(key) {
		return JSON.parse(provider.getItem(key));
	}

	// -----------------------------------------------------------------------------------------------------
	// Remoce JSON data from Storage
	function remove(key) {
		provider.removeItem(key);
	}

	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		isAvailable : isAvailable,
		write       : write,
		read        : read,
		remove      : remove
	};	

})(window, document, console);