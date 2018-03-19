import $ from 'jquery';
import Slider from './slider.jsx';
import '../ui/grasp-slider.js';
import t from '../translate.js';

export default class DaySlider extends Slider {
  constructor(props) {
    super(props);
    // Custom, tweaked jQuery UI slider (defined in ui/grasp-slider).
    this.sliderFuncName = 'graspSlider';
  }

  componentDidMount() {
    super.componentDidMount();
    this.$slider.graspSlider({
      min: 0,
      max: 364,
      step: 1
    });
    this.generateMonthTicks();
  }

  generateMonthTicks() {
    let ticks = [];
    let months = t("~MONTHS_SHORT", this.props.lang);
    for (let m = 0; m < 12; m++) {
      ticks.push({value: m * 30.4, name: months[m]});
    }
    this.$slider.graspSlider('option', 'ticks', ticks);
    // Shift tick labels so they are in the middle of the month section on the slider.
    let monthWidth = this.$slider.width() / 12;
    this.$slider.find('.ui-slider-tick-label').each(function () {
      let $label = $(this);
      let labelWidth = $label.width();
      $label.css('margin-left', -labelWidth * 0.5 + monthWidth * 0.5);
    });
  }
}
