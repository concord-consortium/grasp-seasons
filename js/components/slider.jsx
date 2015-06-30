import React from 'react';
import $ from 'jquery';
import 'jquery-ui/slider';

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    // Default jQuery UI plugin.
    this.sliderFuncName = 'slider';
  }

  get $slider() {
    return $(React.findDOMNode(this));
  }

  componentDidMount() {
    this.$slider[this.sliderFuncName](this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.$slider[this.sliderFuncName](nextProps);
  }

  shouldComponentUpdate() {
    // Never update component as it's based on jQuery slider.
    return false;
  }

  render() {
    return (
      <div></div>
    )
  }
}
