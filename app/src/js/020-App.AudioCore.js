// ---------------------------------------------------------------------------------------------------------
// AudioCore module
App.AudioCore = (function(window, document, console, undefined){
	'use strict'
	const BUFFER_SIZE = 2048;
	
	var provider = new window.AudioContext();
	var sampleRate = provider.sampleRate;
	var streamNode = provider.createScriptProcessor(BUFFER_SIZE, 1, 1);
	var streamBuffer = [];
	var streamCallback = function(){ return [] };
	var callbacks = {
		onStart : function(){},
		onEnd : function(){},
		onProgress : function() {}
	};
	var end = 0;
	var progress;
	
	streamNode.onaudioprocess = function(event) {
		var outBuffer = event.outputBuffer.getChannelData(0);
		
		progress += BUFFER_SIZE;
		if (progress > 0) {
			callbacks.onProgress(progress);
		}
		
		if (streamBuffer.length < outBuffer.length) {
			streamBuffer = streamBuffer.concat(streamCallback());
		}
		
		if (streamBuffer.length == 0) {
			end++;
		}
		
		if (end == 2) {
			streamNode.disconnect();
			callbacks.onEnd();
		}		
		
		while(streamBuffer.length < outBuffer.length) {
			streamBuffer.push(0);
		}

		outBuffer.set(streamBuffer.splice(0, outBuffer.length));
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
	// Play buffer
	function play(encodedData) {
		stream(function(){
			var dummy = encodedData;
			encodedData = [];
			return dummy;
		})
	}
	
	function stream(callback) {
		end = 0;
		progress = -BUFFER_SIZE;
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

	
	function onProgress(callback) {
		callbacks.onProgress = callback;
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		sampleRate     : sampleRate,
		play           : play,
		stream         : stream,
		onStart        : onStart,
		onEnd		   : onEnd,
		onProgress     : onProgress,
	};	

})(window, document, console);