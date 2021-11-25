import $ from 'jquery';
import '../../css/jquery-ui-theme.less';
import 'jquery-ui/ui/widgets/slider';

var TICK_WIDTH = 1;

// Patched jQueryUI slider that can wrap. When user drags slider handle over max (or min) value,
// it will jump back to min (or max).
// It also supports 'ticks' option.
$.widget("ui.graspSlider", $.ui.slider, {
  _create: function () {
    this._super();
  },
  _setOption: function (key, value) {
    this._superApply(arguments);
    if (key === 'ticks') {
      var valueTotal = this._valueMax() - this._valueMin();
      value.forEach(function (t) {
        var percentValue = t.value / valueTotal * 100;
        var tick = $('<div></div>').addClass('ui-slider-tick').css({
          position: 'absolute',
          left: percentValue + '%'
        });
        var mark = $('<div></div>').addClass('ui-slider-tick-mark').css({
          height: this.element.height(),
          width: TICK_WIDTH + 'px',
          'margin-left': (-0.5 * TICK_WIDTH) + 'px',
          background: '#aaaaaa'
        });
        var label = $('<div></div>').addClass('ui-slider-tick-label').text(t.name);
        mark.appendTo(tick);
        label.appendTo(tick);
        tick.appendTo(this.element);
        // We can do it at the very end, when the element is rendered and its width can be calculated.
        label.css('margin-left', (-0.5 * label.width()) + 'px');
      }.bind(this));
      this.element.addClass('ui-slider-with-tick-labels');
    }
  },

  _normValueFromMouse: function( position ) {
    var pixelTotal,
      pixelMouse,
      percentMouse,
      valueTotal,
      valueMouse;

    if ( this.orientation === "horizontal" ) {
      pixelTotal = this.elementSize.width;
      pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
    } else {
      pixelTotal = this.elementSize.height;
      pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
    }

    percentMouse = ( pixelMouse / pixelTotal );
    // Original jQuery UI code:
    // if ( percentMouse > 1 ) {
    //   percentMouse = 1;
    // }
    // if ( percentMouse < 0 ) {
    //   percentMouse = 0;
    // }
    // === Customization ===
    percentMouse = percentMouse % 1;
    if ( percentMouse < 0 ) {
      percentMouse += 1;
    }
    // =====================
    if ( this.orientation === "vertical" ) {
      percentMouse = 1 - percentMouse;
    }

    valueTotal = this._valueMax() - this._valueMin();
    valueMouse = this._valueMin() + percentMouse * valueTotal;

    return this._trimAlignValue( valueMouse );
  }
});
