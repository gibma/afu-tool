// ---------------------------------------------------------------------------------------------------------
// DTMF encoder module
App.Encoder.DTMF = (function(window, document, console, generator, undefined){
	'use strict'
	
	const PATTERN = /[0-9A-D*#]+/i;
	const FREQS = [697, 770, 852, 941, 1209, 1336, 1477, 1633];
	const DIGITS = "123A456B789C*0#D";
	const TONES = [[0,4],[0,5],[0,6],[0,7],[1,4],[1,5],[1,6],[1,7],[2,4],[2,5],[2,6],[2,7],[3,4],[3,5],[3,6],[3,7]]
	
	var duration = [250, 250];
	
	// -----------------------------------------------------------------------------------------------------
	// Set tone speed and pause length
	function speed(tone, pause) {
		duration = [tone, pause];
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Encode the given DTMF sequence
	function encode(sequence) {
		generator.clear();
		if (sequence.matches(PATTERN)) {
			generator.fade(5).pause(duration[1]);
			for (var idx = 0; idx < sequence.length; idx++) {
				var freqs = getFrequencies(sequence.charAt(idx));
				generator.dual(freqs[0], freqs[1], duration[0]).pause(duration[1]);
			}
		}
		return generator.generate();
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Get the dual tone frequencies for the given digit
	function getFrequencies(digit) {		
		var idx = DIGITS.indexOf(digit);
		return [FREQS[TONES[idx][0]], FREQS[TONES[idx][1]]];
	}	
	
	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		encode : encode,
		speed : speed
	}
	
	
})(window, document, console, App.Generator.Tone);