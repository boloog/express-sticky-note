var Toast = require('./toast.js')
var Note = require('./note.js')
var Event = require('./event.js')

var NoteManager = (function(){
	function load(){
		$.get('/api/notes').done(function(ret){
			if(ret.status == 0){
				if(ret.data){
					$.each(ret.data, function(index, el) {
						new Note.init({
							id: el.id,
							context: el.text,
							update: new Date(parseInt(el.updatedAt)).toLocaleString('chinese',{hour12:false}),
							username: el.username
						});
					});
				}
			}else{
				Toast.init(ret.errorMsg);
			}
		}).fail(function(){
			Toast.init('网络异常');
		});
	}

	function add(){
		new Note.init();
	}

	return {
		load: load,
		add: add
	}
})();

module.exports = NoteManager
