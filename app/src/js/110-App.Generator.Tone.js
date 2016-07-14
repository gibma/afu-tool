// ---------------------------------------------------------------------------------------------------------
// Tone generator module
App.Generator.Tone = (function(window, document, console, Math, audioCore, undefined){
	'use strict'

	const RAD = Math.PI / 180.0;
	const PERIGON = 360.0;
	
	var sampleRate = audioCore.sampleRate;
	var buffer = [];
	var currentPhase1 = 0.0;
	var currentPhase2 = 0.0;
	var correction = 0.0;					
	var fadeIn = 0.0;
	var fadeOut = 0.0;								
				
	// -----------------------------------------------------------------------------------------------------
	// Clear buffer
	function clear() {
		buffer = [];
		return this;					
	}
		
	// -----------------------------------------------------------------------------------------------------
	// Set fade in and out duration
	function fade(duration) {
		fadeIn = duration;
		fadeOut = duration;
		return this;
	}
				
	// -----------------------------------------------------------------------------------------------------
	// Generate a pause with given duration
	function pause(duration) {
		var samples = getSamples(duration, true);
		while(samples--) {
			buffer.push(0);
		}
		currentPhase1 = 0.0;
		currentPhase2 = 0.0;
					
		return this;
	}
				
	// -----------------------------------------------------------------------------------------------------
	// Generate a single tone with given frequency and duration
	function single(frequency, duration) {
		var samples = getSamples(duration, true);
		var fis = getSamples(fadeIn, false);
		var fos = getSamples(fadeOut, false);
					
		var step1 = frequency * PERIGON / sampleRate;
					
		for (var left = 0, right = samples; right > 0; left++, right--) {
			var amp = getAmplitude(fis, fos, left, right);
			buffer.push(Math.sin(currentPhase1 * RAD) * amp);
			currentPhase1 = (currentPhase1 + step1) % PERIGON;						
		}
		currentPhase2 = 0.0;
					
		return this;
	}
				
	// -----------------------------------------------------------------------------------------------------
	// Generate a dual tone with given frequencies and duration
	function dual(frequency1, frequency2,  duration) {
		var samples = getSamples(duration, true);
		var fis = getSamples(fadeIn, false);
		var fos = getSamples(fadeOut, false);

		var step1 = frequency1 * PERIGON / sampleRate;
		var step2 = frequency2 * PERIGON / sampleRate;
					
		for (var left = 0, right = samples; right > 0; left++, right--) {
			var amp = getAmplitude(fis, fos, left, right);
			buffer.push((Math.sin(currentPhase1 * RAD) + Math.sin(currentPhase2 * RAD)) / 2 * amp);
			currentPhase1 = (currentPhase1 + step1) % PERIGON;
			currentPhase2 = (currentPhase2 + step2) % PERIGON;
		}
					
		return this;
	}

	// -----------------------------------------------------------------------------------------------------
	// Get the buffer
	function generate() {
		return buffer;
	}
				
	// -----------------------------------------------------------------------------------------------------
	// Calculate the actual amplitude
	function getAmplitude(fis, fos, l, r) {
		var amp = 1.0;
		amp = (l < fis) ? (amp / fis * l) : amp;
		amp = (r < fos) ? (amp / fos * r) : amp;
		return amp;
	}
				
	// -----------------------------------------------------------------------------------------------------
	// Calculate the amount of samples for the given duration and correct round errors
	function getSamples(duration, doCorrection) {
		if (duration == 0.0) {
			return 0;
		}
				
		var rawSamples = sampleRate * (duration / 1000.0);
		var samples = Math.round(rawSamples);
				
		if (doCorrection) {
			correction += (rawSamples - samples);
					
			if (correction >= 1.0) {
				samples++;
				correction -= 1.0;
			}
			if (correction <= -1.0) {
				samples--;
				correction += 1.0;
			}
		}
		
		return samples;
	}
	
	// -----------------------------------------------------------------------------------------------------
	// Public interface
	return {
		clear     : clear,
		fade      : fade,
		pause     : pause,
		single    : single,
		dual      : dual,
		generate  : generate
	}
		
})(window, document, console, Math, App.AudioCore);			