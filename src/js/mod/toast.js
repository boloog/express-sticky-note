require('less/toast.less')

var Toast = (function(){
	function _toast(msg, time){
		this.msg = msg;
		this.time = time || 1000;
		this.createToast();
		this.showToast();
	}
	_toast.prototype = {
		createToast: function(){
			var tpl = '<div class="toast">'+this.msg+'</div>';
			this.$toast = $(tpl);
			$('body').append(this.$toast);
		},
		showToast: function(){
			var _this = this;
			this.$toast.fadeIn(400, function() {
				setTimeout(function(){
					_this.$toast.fadeOut(300, function() {
						_this.$toast.remove();
					});
				}, _this.time);
			});
		}
	}
	return {
		init: function(msg, time){
			new _toast(msg, time);
		}
	}
})()

module.exports = Toast;
