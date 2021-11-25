// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';

export default class CanvasView extends React.Component {
  ExternalView: any;
  externalView: any;
  props: any;
  refs: any;
  componentDidMount() {
    this.externalView = new this.ExternalView(this.refs.container, this.props.simulation);
    if (this.externalView.on) {
      this.externalView.on('log', (action: any, data: any) => {
        this.props.log(action, data)
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    this.externalView.setProps(nextProps.simulation);
  }

  shouldComponentUpdate() {
    // Never update component as it's based on canvas.
    return false;
  }

  // requestAnimationFrame callback.
  rafCallback(timestamp: any) {
    if (this.externalView.render) this.externalView.render(timestamp);
  }

  resize() {
    if (this.externalView.resize) this.externalView.resize();
  }

  render() {
    return (
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div ref='container' style={{width: '100%', height: '100%'}}>
        {/* Canvas will be inserted here by the external view. */}
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    )
  }
}
