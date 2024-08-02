import $ from 'jquery';
import Slider from './slider';
import './grasp-slider';
import t from '../translation/translate';

export default class DaySlider extends Slider {
  // $slider: any;
  getSliderOpts: any;
  props: any;
  sliderFuncName: any;
  constructor(props: any) {
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
    this.generateMonthTicks(this.props.lang);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any){
    if (this.props.lang !== nextProps.lang){
      $(".ui-slider-tick").remove();
      this.generateMonthTicks(nextProps.lang);
    }

    this.$slider[this.sliderFuncName](this.getSliderOpts(nextProps));
  }

  generateMonthTicks(lang: any) {
    let ticks = [];
    let months = t("~MONTHS_SHORT", lang);
    for (let m = 0; m < 12; m++) {
      ticks.push({value: m * 30.4, name: months[m]});
    }
    this.$slider.graspSlider('option', 'ticks', ticks);
    // Shift tick labels so they are in the middle of the month section on the slider.
    let monthWidth = this.$slider.width() / 12;
    this.$slider.find('.ui-slider-tick-label').each(function(this: any) {
      let $label = $(this);
      let labelWidth = $label.width();
      labelWidth && $label.css('margin-left', -labelWidth * 0.5 + monthWidth * 0.5);
    });
  }
}
