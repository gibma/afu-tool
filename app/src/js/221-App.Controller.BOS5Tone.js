// ---------------------------------------------------------------------------------------------------------
// Vue BOS 5-Ton Controller

App.Controller.BOS5Tone = new Vue({
	
	el: '#zvei5ton',
  
	ready: function() {
		$('#sequence').mask('ZZZZZW', {
			translation: {
				'Z' : {
					pattern: /[0-9]/
				},
				'W' : {
					pattern: /[FWAKEPab]/,
					optional: true				
				}
			}
		});

		App.AudioCore.onStart(function(){
			App.Controller.BOS5Tone.isPlaying = true;
			$(".idle").show();
		});
	
		App.AudioCore.onEnd(function(){
			App.Controller.BOS5Tone.isPlaying = false;
			App.Controller.BOS5Tone.resetPlayed();
			$(".progress").width(0);
			$(".idle").hide();
		});
		
		App.AudioCore.onProgress(function(samplesPlayed){
			var max = App.Controller.BOS5Tone.sampleCount;
			var cur = samplesPlayed;
			var progress = (cur/max)*100;
			progress = progress > 100 ? 100 : progress;			
			$(".progress").width(progress + "%");
			
		});
	
	},
  
  data: {
    sequence: '',
	list: [],
	isPlaying: false,
	sampleCount: 0
  },
  
  computed: {		
	inputInvalid: function() {		
		return this.sequence.length && !this.sequence.match(/[0-9]{5}/);
	},	
	inputDisabled: function() {
		return this.isPlaying;
	},
	clearDisabled: function() {
		return (!this.list.length && !this.sequence.length) || this.isPlaying;
	},
	sendDisabled: function() {
		return (this.list.length == 0 && this.sequence.length == 0) || (this.sequence.length && !this.sequence.match(/[0-9]{5}/)) || this.isPlaying;
	},
	addDisabled: function() {
		return !this.sequence.match(/[0-9]{5}/) || this.isPlaying;
	},
	keypadDisabled: function() {
		return this.isPlaying || this.sequence.length >= 5;
	},
	extKeypadDisabled: function() {
		return this.isPlaying || this.sequence.length != 5;
	}
  },
  
  methods: {
  
	doKeypress: function(key) {
		this.sequence += key;
	},

	doAdd: function() {
		this.sequence = this.sequence.trim();
		if (this.sequence.length >= 5) {
			var data = App.Encoder.BOS5Tone.encode(this.sequence); 
			this.list.push({
				sequence: this.sequence,
				played: false,
				data: data
			});
			this.sequence = '';
			return true;
		}
		return false;
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
		self = this;
		this.sequence = this.sequence.trim();
		if (this.list.length) {
			for (var idx = 0; idx < self.list.length; idx++) {
				this.sampleCount += this.list[idx].data.length;
			}			
			
			App.AudioCore.stream(function(){
				for (var idx = 0; idx < self.list.length; idx++) {
					if (!self.list[idx].played) {
						self.list[idx].played = true;
						return self.list[idx].data;
					}
				}
				return []
			});
		} else if (this.sequence.length >= 5) {
			var buffer = App.Encoder.BOS5Tone.encode(this.sequence);
			this.sampleCount = buffer.length;
			App.AudioCore.play(buffer);
		}		
	},

	resetPlayed: function(){
		this.sampleCount = 0;
		for (var idx = 0; idx < this.list.length; idx++) {
			this.list[idx].played = false;
		}
	}
  },
})
