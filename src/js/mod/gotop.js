require('less/gotop.less')

var GoTop = (function(){
    function _gotop(ct){
        this.target = ct;
        this.bindEvent();
    }
    /**
     * 绑定事件
     */
    _gotop.prototype.bindEvent = function(){
        var _this = this;
        $(window).on('scroll', function(){
            if($(window).scrollTop() > 200){
                _this.target.show();
            }else{
                _this.target.hide();
            }
        });
        this.target.on('click', function(){
            $(window).scrollTop(0);
        });
    }
    /**
     * 创建返回按钮
     */
    _gotop.prototype.createNode = function(){
        $('body').append(this.target);
    }
    return {
        init: function(ct){
            new _gotop(ct);
        }
    }
})();

module.exports = GoTop;
