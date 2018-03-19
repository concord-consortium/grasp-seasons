import React from 'react';
import reactMixin from 'react-mixin';
import t from '../translate.js';

import animationMixin from './animation-mixin.js';

export default class AnimationButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.toggleState();
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    let lang = this.props.lang;
    let label = this.state.animationStarted ? t("~STOP", lang) : t("~PLAY", lang);
    return (
      <button className='btn btn-default animation-btn' name={label} onClick={this.handleClick} disabled={this.state.disabled}>{label}</button>
    )
  }
}

reactMixin.onClass(AnimationButton, animationMixin);
