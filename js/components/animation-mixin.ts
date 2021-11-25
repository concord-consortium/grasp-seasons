export default {
  getInitialState: function (props: any) {
    return {
      animationStarted: false,
      disabled: false
    };
  },

  componentWillUnmount: function () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rafId' does not exist on type '{ getInit... Remove this comment to see the full error message
    cancelAnimationFrame(this.rafId);
  },

  toggleState: function () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{ getInit... Remove this comment to see the full error message
    if (!this.state.animationStarted) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  },

  startAnimation: function () {
    // @ts-expect-error ts-migrate(2551) FIXME: Property '_animate' does not exist on type '{ getI... Remove this comment to see the full error message
    this._animate = this.animate.bind(this);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rafId' does not exist on type '{ getInit... Remove this comment to see the full error message
    this.rafId = requestAnimationFrame(this._animate);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'setState' does not exist on type '{ getI... Remove this comment to see the full error message
    this.setState({animationStarted: true});
  },

  stopAnimation: function () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rafId' does not exist on type '{ getInit... Remove this comment to see the full error message
    cancelAnimationFrame(this.rafId);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'prevTimestamp' does not exist on type '{... Remove this comment to see the full error message
    this.prevTimestamp = null;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'setState' does not exist on type '{ getI... Remove this comment to see the full error message
    this.setState({animationStarted: false});
  },

  animate: function (timestamp: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rafId' does not exist on type '{ getInit... Remove this comment to see the full error message
    this.rafId = requestAnimationFrame(this._animate);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'prevTimestamp' does not exist on type '{... Remove this comment to see the full error message
    let progress = this.prevTimestamp ? timestamp - this.prevTimestamp : 0;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'props' does not exist on type '{ getInit... Remove this comment to see the full error message
    let newValue = this.props.currentValue + progress * this.props.speed;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'props' does not exist on type '{ getInit... Remove this comment to see the full error message
    this.props.onAnimationStep(newValue);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'prevTimestamp' does not exist on type '{... Remove this comment to see the full error message
    this.prevTimestamp = timestamp;
  },

  setDisabled: function (v: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'setState' does not exist on type '{ getI... Remove this comment to see the full error message
    this.setState({disabled: v});
    if (v) {
      // Stop animation if we just disabled the component.
      this.stopAnimation();
    }
  }
}
