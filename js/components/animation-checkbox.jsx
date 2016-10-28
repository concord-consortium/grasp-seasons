import React from 'react';
import reactMixin from 'react-mixin';

import animationMixin from './animation-mixin.js';

export default class AnimationCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.toggleState();
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    return (
      <input type='checkbox' name={this.props.name} checked={this.state.animationStarted} onChange={this.handleChange} disabled={this.state.disabled}/>
    )
  }
}

reactMixin.onClass(AnimationCheckbox, animationMixin);
