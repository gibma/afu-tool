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
  },
  
  data: {
    sequence: '',
	list: [],
	isPlaying: false,
	progress: 0
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
			this.list.push({
				sequence: this.sequence,
				playing: false
			});
			this.sequence = '';
			return true;
		}
		return false;
	},
	
	doRemove: function(index) {
		this.list.splice(index, 1);
	},
	
	doClear: function() {
		this.sequence = '';
		this.list = [];
	},
	
	doSend: function() {
		self = this;
		this.sequence = this.sequence.trim();
		if (this.list.length) {
			if (this.doAdd()) {
				doPlay = true;
			}			
		} else if (this.sequence.length >= 5) {
			App.Storage.write("lastSequence", this.sequence);
			App.AudioCore.play(App.Encoder.BOS5Tone.encode(this.sequence));
		}
		
		
	}  
  },
})