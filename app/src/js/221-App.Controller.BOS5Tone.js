// ---------------------------------------------------------------------------------------------------------
// Vue BOS 5-Ton Controller

App.Controller.BOS5Tone = new Vue({
	
	el: '#zvei5ton',
  
	ready: function() {
		this.core.onStart(this.onStart);	
		this.core.onEnd(this.onStop);		
		this.core.onProgress(this.onProgress);
	},
  
  data: {
	core        : App.AudioCore,
	encoder     : App.Encoder.BOS5Tone,   
    sequence    : '',
	list        : [],
	isPlaying   : false,
	sampleCount : 0,
	progress    : 0.0
  },
  
  computed: {		
	inputInvalid: function() {		
		return this.sequence.length && !this.encoder.validate(this.sequence);
	},	
	clearDisabled: function() {
		return this.isPlaying || (!this.list.length && !this.sequence.length);
	},
	sendDisabled: function() {
		return this.isPlaying || (!this.list.length && !this.encoder.validate(this.sequence));
	},
	addDisabled: function() {
		return this.isPlaying || !this.encoder.validate(this.sequence);
	},
	keypadDisabled: function() {
		return this.isPlaying || this.sequence.length >= 5;
	},
	extKeypadDisabled: function() {
		return this.isPlaying || this.sequence.length != 5;
	},
	progressStyle: function() {
		return "transform: scaleX(" + this.progress + ")";
	}
  },
  
  methods: {
	onStart: function() {
		this.isPlaying = true;
	},
	
	onStop: function() {
		this.isPlaying = false;
		this.sampleCount = 0;
		this.progress = 0;
		for (var idx = 0; idx < this.list.length; idx++) {
			this.list[idx].played = false;
		}	

	},
	
	onProgress: function(cur) {
		this.progress = (cur / this.sampleCount);
	},
	
	isValid: function(sequence, partial) {
		return this.encoder.isValid(sequence, partial);
	},
	
	doPaste: function(event) {
		event.preventDefault();
		event.stopPropagation();
		
		var data = (event.clipboardData || window.clipboardData).getData('Text');
		this.doInput(data);
	},
	
	doKeypress : function(event) {
		event.preventDefault();
		event.stopPropagation();

		var data = String.fromCharCode(event.charCode);
		this.doInput(data);
	},
	
	doKeydown: function(event) {
		if (this.isPlaying) {
			event.preventDefault();
			event.stopPropagation();			
		} else {		
			switch(event.keyCode) {
				case 13: {
					this.doSend();
					break;
				}
				case 32: {
					this.doAdd();
					break;
				}
				case 46: {
					this.doRemove();
					break;
				}
			}
		}
	},
	
	doInput: function(data) {
		if (!this.isPlaying && this.encoder.validate(this.sequence + data, true)) {
			this.sequence += data;
		}	
	},
  
	doAdd: function() {
		if (!this.isPlaying && this.encoder.validate(this.sequence)) {
			var data = App.Encoder.BOS5Tone.encode(this.sequence); 
			this.list.push({
				sequence: this.sequence,
				played: false,
				data: data
			});
			this.sequence = '';
		}
	},
	
	doRemove: function(index) {
		if (typeof index !== 'number') {
			if (this.list.length > 0) {
				this.list.pop();
			}
		} else {		
			this.list.splice(index, 1);
		}
	},
	
	doClear: function() {
		this.sequence = '';
		this.list = [];
	},
	
	doSend: function() {
		
		if (!this.isPlaying) {
		if (this.list.length) {
			if (this.sequence.length) {
				if (this.encoder.validate(this.sequence)) {
					this.doAdd();
				} else {
					return;
				}
			}
			
			for (var idx = 0; idx < this.list.length; idx++) {
				this.sampleCount += this.list[idx].data.length;
			}			
			
			App.AudioCore.stream((function(){
				for (var idx = 0; idx < this.list.length; idx++) {
					if (!this.list[idx].played) {
						this.list[idx].played = true;
						return this.list[idx].data;
					}
				}
				return []
			}).bind(this));
		} else if (this.encoder.validate(this.sequence)) {
			var buffer = App.Encoder.BOS5Tone.encode(this.sequence);
			this.sampleCount = buffer.length;
			App.AudioCore.play(buffer);
		}	
		}		
	}
	}
})
