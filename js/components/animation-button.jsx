import React from 'react';

export default class AnimationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationStarted: false
    };

    this.toggleState = this.toggleState.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
  }

  toggleState() {
    if (!this.state.animationStarted) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }

  startAnimation() {
    this.rafId = requestAnimationFrame(this.animate);
    this.setState({animationStarted: true});
  }

  stopAnimation() {
    cancelAnimationFrame(this.rafId);
    this.prevTimestamp = null;
    this.setState({animationStarted: false});
  }

  animate(timestamp) {
    this.rafId = requestAnimationFrame(this.animate);
    let progress = this.prevTimestamp ? timestamp - this.prevTimestamp : 0;
    let newValue = this.props.currentValue + progress * this.props.speed;
    this.props.onAnimationStep(newValue);
    this.prevTimestamp = timestamp;
  }

  render() {
    let label = this.state.animationStarted ? 'Stop' : 'Play';
    return (
      <button className='btn btn-default animation-btn' onClick={this.toggleState}>{label}</button>
    )
  }
}
