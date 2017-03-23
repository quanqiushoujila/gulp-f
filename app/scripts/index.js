$(function() {
    var returnTopBtn = $('.btn-return-top');



    var returnTop = new ReturnTop(returnTopBtn);
    returnTop.clickEvent();
    returnTop.isHide();
});

// 返回顶部效果
var ReturnTop = function(me) {
    this.me = me;
};
ReturnTop.prototype = {
    clickEvent: function() {
        this.me.on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            });
        });
    },

    isHide: function() {
        var $this = this;
        $(window).on('scroll', function() {
        	$this.scrollEvent();
        });
    },

    scrollEvent: function() {
        var maxHeight = 300;

        if ($(window).scrollTop() > maxHeight) {
            this.me.fadeIn();
        } else {
            this.me.fadeOut();
        }
    }
};
