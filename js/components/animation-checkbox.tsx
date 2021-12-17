import React from 'react';
import reactMixin from 'react-mixin';

import animationMixin from './animation-mixin';

export default class AnimationCheckbox extends React.Component {
  props: any;
  state: any;
  toggleState: any;
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
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

reactMixin.onClass(AnimationCheckbox, animationMixin as any);
