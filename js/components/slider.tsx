import React from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    // Default jQuery UI plugin.
    this.sliderFuncName = 'slider';
  }

  get $slider() {
    return $(this.refs.container);
  }

  getSliderOpts(props) {
    const options = Object.assign({}, props);
    // Enhance options, support logging.
    if (props.log) {
      options.start = function (event, ui) {
        this._slideStart = Date.now();
        this._prevValue = ui.value;
        if (props.start) {
          props.start(event, ui);
        }
      };
      options.stop = function (event, ui) {
        const duration = (Date.now() - this._slideStart) / 1000;
        props.log(props.logId + 'SliderChanged', {
          value: ui.value,
          prevValue: this._prevValue,
          duration
        });
        if (props.stop) {
          props.stop(event, ui);
        }
      };
    }
    return options;
  }

  componentDidMount() {
    this.$slider[this.sliderFuncName](this.getSliderOpts(this.props));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.$slider[this.sliderFuncName](this.getSliderOpts(nextProps));
  }

  shouldComponentUpdate() {
    // Never update component as it's based on jQuery slider.
    return false;
  }

  render() {
    return (
      <div ref='container'></div>
    )
  }
}

Slider.defaultProps = {
  log: null, // or function(action, data) { ... }
  logId: ''
};
