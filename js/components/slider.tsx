// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jque... Remove this comment to see the full error message
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';

export default class Slider extends React.Component {
  props: any;
  refs: any;
  sliderFuncName: any;
  constructor(props: any) {
    super(props);
    // Default jQuery UI plugin.
    this.sliderFuncName = 'slider';
  }

  get $slider() {
    return $(this.refs.container);
  }

  getSliderOpts(props: any) {
    const options = Object.assign({}, props);
    // Enhance options, support logging.
    if (props.log) {
      options.start = function (event: any, ui: any) {
        this._slideStart = Date.now();
        this._prevValue = ui.value;
        if (props.start) {
          props.start(event, ui);
        }
      };
      options.stop = function (event: any, ui: any) {
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

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    this.$slider[this.sliderFuncName](this.getSliderOpts(nextProps));
  }

  shouldComponentUpdate() {
    // Never update component as it's based on jQuery slider.
    return false;
  }

  render() {
    return (
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div ref='container'></div>
    )
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultProps' does not exist on type 'ty... Remove this comment to see the full error message
Slider.defaultProps = {
  log: null, // or function(action, data) { ... }
  logId: ''
};
