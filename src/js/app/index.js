require('less/index.less')

const NoteManager = require('../mod/note-manager.js')
const Event = require('../mod/event.js')
const WaterFall = require('../mod/waterfall.js')
const GoTop = require('../mod/gotop.js')

NoteManager.load();

$('.add-note').on('click', function(){
	NoteManager.add();
})
//
Event.on('waterfall', function(){
	WaterFall.init($('#contents'));
})

GoTop.init($('.goTop'));
