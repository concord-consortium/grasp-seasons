import React from 'react';
import reactMixin from 'react-mixin';
import t from '../translation/translate';

import animationMixin from './animation-mixin';

export default class AnimationButton extends React.Component {
  props: any;
  state: any;
  toggleState: any;
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event: any) {
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

reactMixin.onClass(AnimationButton, animationMixin as any);
