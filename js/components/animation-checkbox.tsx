// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import reactMixin from 'react-mixin';

import animationMixin from './animation-mixin.js';

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
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <input type='checkbox' name={this.props.name} checked={this.state.animationStarted} onChange={this.handleChange} disabled={this.state.disabled}/>
    )
  }
}

reactMixin.onClass(AnimationCheckbox, animationMixin);
