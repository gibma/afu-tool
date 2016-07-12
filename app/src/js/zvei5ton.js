var zvei5tonController = new Vue({
  el: '#zvei5ton',
  
  ready: function() {
	$('#sequence').mask('ZZZZZW', {
		translation: {
			'Z' : {
				pattern: /[0-9]/
			},
			'W' : {
				pattern: /[FWEAKP]/i,
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
	inputDisabled: function() {
		return this.isPlaying;
	},
	clearDisabled: function() {
		return (!this.list.length && !this.sequence.length) || this.isPlaying;
	},
	sendDisabled: function() {
		return (!this.list.length && !this.sequence.length) || this.isPlaying;
	},
	addDisabled: function() {
		return (!this.sequence.length) || this.isPlaying;
	},
	keypadDisabled: function() {
		return this.isPlaying || this.sequence.length >= 5;
	}
  },
  
  methods: {
  
	doKeypress: function(key) {
		this.sequence += key;
	},

	doAdd: function() {
		this.sequence = this.sequence.trim();
		if (this.sequence.length) {
			this.list.push({
				sequence: this.sequence,
				playing: false
			});
			this.sequence = '';
		}
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
			this.doAdd();
			//alert("Play list");
		} else if (this.sequence.length) {
			//alert("Play single");
		}
		this.isPlaying = true;
		
		this.timer = setInterval(function(){
			$('.progress').width(self.progress + '%');
			
			if (self.progress % 10 == 0) {
				idx = self.progress / 10;
				if (idx < self.list.length) {
					if (idx > 0) {
						self.list[idx - 1].playing = false;
					}
					self.list[idx].playing = true;
				}
			}

			self.progress++;
			
			if (self.progress == 100) {
				clearInterval(self.timer);
				self.isPlaying = false;
				$('.progress').width(0);
				self.progress = 0;
				$.each(self.list, function(index, item){
					item.playing = false;
				});
			}
		}, 10);
	}  
  },
})
