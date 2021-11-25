// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import reactMixin from 'react-mixin';
import t from '../translate.js';

import animationMixin from './animation-mixin.js';

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
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <button className='btn btn-default animation-btn' name={label} onClick={this.handleClick} disabled={this.state.disabled}>{label}</button>
    )
  }
}

reactMixin.onClass(AnimationButton, animationMixin);
