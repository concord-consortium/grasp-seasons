import $ from 'jquery';
import 'jquery-ui/slider';

// Patched jQueryUI slider that can wrap. When user drags slider handle over max (or min) value,
// it will jump back to min (or max).
$.widget( "ui.wrappingSlider", $.ui.slider, {
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
