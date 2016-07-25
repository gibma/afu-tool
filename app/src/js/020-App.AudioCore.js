// ---------------------------------------------------------------------------------------------------------
// AudioCore module
App.AudioCore = (function(window, document, console, undefined){
	'use strict'
	
	var provider = new window.AudioContext();
	var sampleRate = provider.sampleRate;
	var streamNode = provider.createScriptProcessor(4096, 1, 1);
	var streamBuffer = [];
	var streamCallback = function(){ return [] };
	var callbacks = {
		onStart : function(){},
		onEnd : function(){}
	};
	
	streamNode.onaudioprocess = function(event) {
		var outBuffer = event.outputBuffer.getChannelData(0);
		
		if (streamBuffer.length < outBuffer.length) {
			streamBuffer = streamBuffer.concat(streamCallback());
		}
		
		if (streamBuffer.length == 0) {
			streamNode.disconnect();
			callbacks.onEnd();
			console.log("0");
		}		
		
		while(streamBuffer.length < outBuffer.length) {
			streamBuffer.push(0);
		}
		
		for (var idx = 0; idx < outBuffer.length; idx++) {
			outBuffer[idx] = streamBuffer.shift();
		}
	}
	
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
		callbacks.onStart();
		
		var buffer = provider.createBuffer(1, encodedData.length, sampleRate);
		buffer.getChannelData(0).set(encodedData);
			
		var bufferNode = provider.createBufferSource();
		bufferNode.buffer = buffer;
		bufferNode.connect(provider.destination);
		bufferNode.start(0);	
	}
	
	function stream(callback) {
		callbacks.onStart();
		streamCallback = callback;
		streamNode.connect(provider.destination);		
	}
	
	function onStart(callback) {
		callbacks.onStart = callback;
	}

	function onEnd(callback) {
		callbacks.onEnd = callback;
	}

	
	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		sampleRate     : sampleRate,
		play           : play,
		stream         : stream,
		onStart        : onStart,
		onEnd		   : onEnd
	};	

})(window, document, console);