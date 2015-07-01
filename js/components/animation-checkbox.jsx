import React from 'react';
import reactMixin from 'react-mixin';

import animationMixin from './animation-mixin.js';

export default class AnimationCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.toggleState = this.toggleState.bind(this);
  }

  render() {
    return (
      <input type='checkbox' checked={this.state.animationStarted} onChange={this.toggleState}/>
    )
  }
}

reactMixin.onClass(AnimationCheckbox, animationMixin);
