// ---------------------------------------------------------------------------------------------------------
// BOS 5-Tone encoder module
App.Encoder.BOS5Tone = (function(window, document, console, generator, undefined){
	'use strict'
	
	const PATTERN = /[0-9]{5}[FWAKEPab]?/;
	const FREQS = [1060, 1160, 1270, 1400, 1530, 1670, 1830, 2000, 2200, 2400, 2600];
	const DIGITS = "1234567890R";
	const SIREN_FREQS = [675, 825, 1240, 1860];
	const SIREN_TONES = [[0,2], [0,1], [2,3], [1,2], [1,3], [0,3]];
	const SIREN_DIGITS = "FWAKEP";

	
	// -----------------------------------------------------------------------------------------------------
	// Encode the given BOS 5-Tone sequence
	function encode(sequence) {
		generator.clear();
		if (sequence.match(PATTERN)) {
			generator.fade(5);
			cycle(sequence);
			cycle(sequence);
			specialTones(sequence);
		}
		return generator.generate();		
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Encode one cycle
	function cycle(sequence) {
		generator.pause(600);
		var lastDigit = '';
		for (var idx = 0; idx < 5; idx++) {
			var digit = sequence.charAt(idx);
			if (lastDigit === digit) {
				digit = 'R';
			}
			generator.single(getFrequency(digit), 70);
			lastDigit = digit;
		}
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Send tones for busy channel indication or siren activation
	function specialTones(sequence) {
		if (sequence.length == 6) {
			generator.pause(600);
			switch(sequence[5]) {
				case 'a': { // Busy tone a
					for (var rep = 0; rep < 10; rep++) {
						generator.single(FREQS[10], 250);
						if (rep < 9) {
							generator.pause(250);
						}
					}
					break;
				}
				case 'b': { // Busy tone b
					for (var rep = 0; rep < 5; rep++) {
						generator.single(FREQS[10], 800);
						if (rep < 4) {
							generator.pause(300);
						}
					}
					break;
				}
				default: { // Siren tones
					var freqs = getSirenFrequencies(sequence[5]);
					generator.dual(freqs[0], freqs[1], 5000).pause(70);
					break;
				}
			}
			generator.pause(70);				
		}
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Get the tone frequency for the given digit
	function getFrequency(digit) {		
		var idx = DIGITS.indexOf(digit);
		return (idx < 0) ? 0 : FREQS[idx];
	}	
	
	// -----------------------------------------------------------------------------------------------------
	// Get the dual tone frequencies for the given digit for siren activation
	function getSirenFrequencies(digit) {		
		var idx = SIREN_DIGITS.indexOf(digit);
		return [SIREN_FREQS[SIREN_TONES[idx][0]], SIREN_FREQS[SIREN_TONES[idx][1]]];
	}		
	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		encode : encode
	}
	
	
})(window, document, console, App.Generator.Tone);