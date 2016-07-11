var dtmfController = new Vue({
  el: '#dtmf',
  
  data: {
    sequence: '',
	list: []
  },
  
  computed: {
	clearDisabled: function() {
		return !this.list.length && !this.sequence.length;
	},
	sendDisabled: function() {
		return !this.list.length && !this.sequence.length;
	},
	addDisabled: function() {
		return !this.sequence.length;
	},
	keypadDisabled: function() {
		return false;
	}
  },
  
  methods: {
  
	doKeypress: function(key) {
		this.sequence += key;
	},
	
	doAdd: function() {
		if (this.sequence.length) {
			this.list.push({
				sequence: this.sequence,
				played: false
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
		if (this.list.length) {
			this.doAdd();
			alert("Play list");
		} else if (this.sequence.length) {
			alert("Play single");
		}
	}
  
  }
})
