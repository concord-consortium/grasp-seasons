import React from 'react';
import reactMixin from 'react-mixin';

import animationMixin from './animation-mixin.js';

export default class AnimationButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggleState = this.toggleState.bind(this);
  }

  render() {
    let label = this.state.animationStarted ? 'Stop' : 'Play';
    return (
      <button className='btn btn-default animation-btn' onClick={this.toggleState}>{label}</button>
    )
  }
}

reactMixin.onClass(AnimationButton, animationMixin);
