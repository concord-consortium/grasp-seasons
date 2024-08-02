import React, { Component } from "react";
import reactMixin from "react-mixin";
import t from "../translation/translate";

import animationMixin from "./animation-mixin";

export default class AnimationButton extends Component {
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
    const lang = this.props.lang;
    const label = this.state.animationStarted ? t("~STOP", lang) : t("~PLAY", lang);
    return (
      <button
        className="btn btn-default animation-btn"
        name={label}
        onClick={this.handleClick}
        disabled={this.state.disabled}>{ label }
      </button>
    )
  }
}

reactMixin.onClass(AnimationButton, animationMixin as any);
