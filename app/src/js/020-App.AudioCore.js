// ---------------------------------------------------------------------------------------------------------
// AudioCore module
App.AudioCore = (function(window, document, console, undefined){
	'use strict'
	
	var provider = new window.AudioContext();
	var sampleRate = provider.sampleRate;
	//var streamNode = provider.createScriptProcessor(2048, 1, 1);
	
	// -----------------------------------------------------------------------------------------------------
	// Check if audioContext is available
	function isAvailable() {
		var msg = "App.AudioCore check for audioContext : ";

		if ('AudioContext' in window) {
			console.log(msg + "available");
		} else {
			console.log(msg + "!!NOT!! available");
			alert("Teile der Anwendung [App.AudioCore] funktionieren in Ihrem Browser nicht!");
		}	
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Check if audioContext is available
	function play(encodedData) {
		var buffer = provider.createBuffer(1, encodedData.length, sampleRate);
		buffer.getChannelData(0).set(encodedData);
			
		var bufferNode = provider.createBufferSource();
		bufferNode.buffer = buffer;
		bufferNode.connect(provider.destination);
		bufferNode.start(0);	
	}

	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		isAvailable : isAvailable,
		play        : play,
		sampleRate  : sampleRate
	};	

})(window, document, console);