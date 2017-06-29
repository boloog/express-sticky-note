// 样式
require('less/note.less')

var Toast = require('./toast.js')
var Event = require('./event.js')

var Note = (function(){
	function _note(opts){
		this.initOpts(opts);
	}
	_note.prototype.initOpts = function(opts){
		var contents = $('#contents'),
			defaultOptions = {
				id: '',
				time: new Date().toLocaleString('chinese',{hour12:false}),
				contents: contents.length > 0 ? contents : $('body'),
				context: '点这里输入内容'
			};
		this.opts = $.extend({}, defaultOptions, opts || {});
		if( this.opts.id ){
			this.id = this.opts.id
		}

		var tpl = '<div class="note transition">'
			+ '<div class="note-head"></div>'
			+ '<div class="note-context" contenteditable="plaintext-only"></div>'
			+ '<p class="username u-t"></p><p class="time u-t">'+new Date().toLocaleString('chinese',{hour12:false})+'</p><span class="delete">&times;</span>'
			+ '</div>';
		this.note = $(tpl);
		this.note.find('.time').html( this.opts.update );
		this.note.find('.username').html(this.opts.username );
		this.note.find('.note-context').html( this.opts.context );
		this.opts.contents.append(this.note);
		if(!this.id){
			this.note.siblings().css('zIndex', 0);
			this.note.css({zIndex: 999, left: '10px', top: '100px'});
		}
		this.setStyle();
		Event.fire('waterfall');

	}
	_note.prototype.setStyle = function(){
		var colors = ['#64aaff','#fede89','#ffbfcd','#a4bdff', '#b194fe','#3fe0d0','#00dba', '#7c8bfe']
		var color = colors[Math.floor(Math.random()*7)];
		this.note.find('.note-head').css('background-color', color );
		this.bindEvent();
	}
	_note.prototype.setLayout = function(){
		var _this = this;
		if(_this.clk){
			clearTimeout(_this.clk);
		}
		_this.clk = setTimeout(function(){
			Event.fire('waterfall');
		},100)
	}
	// 点击 按下 拖拽 跟随
	_note.prototype.bindEvent = function(){
		var _this = this,
			note = this.note,
			noteHead = note.find('.note-head'),
			noteCont = note.find('.note-context'),
			noteTime = note.find('.time'),
			delBtn = note.find('.delete'),
			beforeNoteCont = noteCont.html();
		noteCont.on('focus', function(){
			note.siblings().css('zIndex', 0);
			note.css('zIndex', 999);
			if( noteCont.html() == '点这里输入内容'){
				noteCont.html('');
			}
			noteCont.data('before', beforeNoteCont );
		}).on('blur paste', function(){
			if(noteCont.data('before') != noteCont.html() ){
				if(noteCont.html() == '' ||  noteCont.html() == '<br>'){
					noteCont.html(beforeNoteCont);
					Toast.init('内容不能为空..');
					return;
				}
				if(_this.id){
					_this.editMsg(noteCont, noteTime)
				}else{
					_this.addMsg(noteCont.html())
				}
				_this.setLayout();
			}
		});
		note.hover(function() {
			note.find('.delete').fadeIn();
		}, function() {
			note.find('.delete').hide();
		});

		// 删除
		delBtn.on('click', function(){
			_this.deleteMsg(noteCont.html());
			_this.setLayout();
		})
		// 点击头部移动
		noteHead.on('mousedown', function(e){
			var eventX = e.pageX - note.offset().left,
				eventY = e.pageY - note.offset().top;
				note.siblings().css('zIndex', 0);
				note.css('zIndex', 999);
			note.removeClass('transition').addClass('draggable').data('evtPos', { x: eventX, y: eventY});

		}).on('mouseup', function(){
			note.removeClass('draggable').addClass('transition').removeData('pos')
		});


		// 当鼠标移动时，根据鼠标的位置和前面保持距离，计算位置
		$('body').on('mousemove', function(e){
			$('.draggable').length && $('.draggable').offset({
				top: e.pageY - $('.draggable').data('evtPos').y,
				left: e.pageX - $('.draggable').data('evtPos').x
			})
		});
	}
	_note.prototype.editMsg = function(noteCont, noteTime ){
		var beforeNoteCont = noteCont.data('before');
		var msg = noteCont.html();

		console.log('这里编辑之前的值', beforeNoteCont )
		console.log('这里编辑之后', msg )
		$.post('/api/notes/edit', {
			id: this.id,
			note: msg
		}).done(function(ret){
			if(ret.status === 0){
				Toast.init('编辑成功');
				noteTime.html(new Date().toLocaleString('chinese',{hour12:false}))
			}else{
				noteCont.html(beforeNoteCont)
				Toast.init(ret.errorMsg);
			}
		})
	}
	_note.prototype.addMsg = function(msg){
		var _this = this;
		$.post('/api/notes/add', {
			note: msg
		}).done(function(ret){
			if(ret.status === 0){
				_this.note.remove();
				new Note.init({
					id: ret.result.id,
					context: ret.result.text,
					update: new Date(parseInt(ret.result.updatedAt)).toLocaleString('chinese',{hour12:false}),
					username: ret.result.username
				});
				Toast.init('添加成功');
			}else{
				_this.note.remove();
				Toast.init(ret.errorMsg);
			}
		})
	}
	_note.prototype.deleteMsg = function(){
		var _this = this;
		$.post('/api/notes/delete', {
			id: _this.id
		}).done(function(ret){
			if(ret.status === 0){
				Toast.init('删除成功');
				_this.note.remove();
			}else{
				Toast.init(ret.errorMsg);
			}
		})
	}
	return {
		init: function(opts){
			new _note(opts);
		}
	}
})();

module.exports = Note;
