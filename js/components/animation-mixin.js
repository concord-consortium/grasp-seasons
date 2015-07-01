export default {
  getInitialState: function (props) {
    return {
      animationStarted: false
    };
  },

  componentWillUnmount: function () {
    cancelAnimationFrame(this.rafId);
  },

  toggleState: function () {
    if (!this.state.animationStarted) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  },

  startAnimation: function () {
    this._animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this._animate);
    this.setState({animationStarted: true});
  },

  stopAnimation: function () {
    cancelAnimationFrame(this.rafId);
    this.prevTimestamp = null;
    this.setState({animationStarted: false});
  },

  animate: function (timestamp) {
    this.rafId = requestAnimationFrame(this._animate);
    let progress = this.prevTimestamp ? timestamp - this.prevTimestamp : 0;
    let newValue = this.props.currentValue + progress * this.props.speed;
    this.props.onAnimationStep(newValue);
    this.prevTimestamp = timestamp;
  }
}
