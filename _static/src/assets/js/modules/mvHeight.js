import jQuery from 'jquery';
const $ = jQuery;

$(window).on('resize load', function () {
  var w = $(window).width();
  var x = 1200;
  if (w <= x) {
    var MVHEIGHT = MVHEIGHT || {};
    MVHEIGHT.VIEW_HEIGHT = {
      init: function () {
        this.setParameters();
        this.setMvHeight();
        this.bind();
      },
      setParameters: function () {
        this.$window = $(window);
        this.$target = $('.p-home-mv');
      },
      bind: function () {
        var _self = this;
        this.$window.on('resize', function () {
          _self.setMvHeight();
        });
      },
      setMvHeight: function () {
        this.$target.css('height', this.$window.height());
      },
    };
    $(function () {
      MVHEIGHT.VIEW_HEIGHT.init();
    });
  }
});
