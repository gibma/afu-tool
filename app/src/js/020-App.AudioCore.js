// ---------------------------------------------------------------------------------------------------------
// AudioCore module
App.AudioCore = (function(window, document, console, undefined){
	'use strict'
	
	const BLOCK_SIZE = 2048;
	
	var provider = new window.AudioContext();
	var sampleRate = provider.sampleRate;
	var streamNode = provider.createScriptProcessor(BLOCK_SIZE, 1, 1);
	var queue = [];
	var isActive = false;
	var shouldStop = false;
	var progress = 0;

	var callbacks = {
		onStart : function(){},
		onEnd : function(){},
		onProgress : function() {},
		onFillBuffer : function() { return [] }
	};
	
	streamNode.onaudioprocess = function(event) {
		var output = event.outputBuffer.getChannelData(0);
		
		if (shouldStop) {
			progress += BLOCK_SIZE;
			callbacks.onProgress(progress);
			callbacks.onEnd();
			isActive = false;
			
			for (var idx = 0; idx < BLOCK_SIZE; idx++) {
				output[idx] = 0;
			}
		}
		
		if (isActive) {
			progress += BLOCK_SIZE;
			callbacks.onProgress(progress);

			if (queue.length < BLOCK_SIZE) {
				while (queue.length < BLOCK_SIZE) {
					var buffer = callbacks.onFillBuffer();
					if (!buffer.length) {
						shouldStop = true;
						break;
					}
					for (var to = queue.length, from = 0; from < buffer.length; from++, to++){
						queue[to] = buffer[from];
					}	
				}
				for (var idx = queue.length; idx < BLOCK_SIZE; idx++) {
					queue[idx] = 0;
				}
			}
		
			for (var idx = 0; idx < BLOCK_SIZE; idx++) {
				output[idx] = queue[idx];
			}
		
			for (var to = 0, from = BLOCK_SIZE; from < queue.length; to++, from++) {
				queue[to] = queue[from];			
			}
			queue.length -= BLOCK_SIZE;
		}
	}	
	
	// -----------------------------------------------------------------------------------------------------
	// Check if audioContext is supported
	function isSupported() {
		return ('AudioContext' in window);
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
		queue = [];
		progress = 0;
		shouldStop = false;
		callbacks.onFillBuffer = callback;
		callbacks.onStart();		
		isActive = true;		
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
	
	function init() {
		streamNode.connect(provider.destination);
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		isSupported    : isSupported,
		init           : init,
		sampleRate     : sampleRate,
		play           : play,
		stream         : stream,
		onStart        : onStart,
		onEnd		   : onEnd,
		onProgress     : onProgress,
	};	

})(window, document, console);