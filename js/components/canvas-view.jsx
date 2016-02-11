import React from 'react';

export default class CanvasView extends React.Component {
  componentDidMount() {
    this.externalView = new this.ExternalView(this.refs.container, this.props.simulation);
  }

  componentWillReceiveProps(nextProps) {
    this.externalView.setProps(nextProps.simulation);
  }

  shouldComponentUpdate() {
    // Never update component as it's based on canvas.
    return false;
  }

  // requestAnimationFrame callback.
  rafCallback(timestamp) {
    if (this.externalView.render) this.externalView.render(timestamp);
  }

  resize() {
    if (this.externalView.resize) this.externalView.resize();
  }

  render() {
    return (
      <div ref='container' style={{width: '100%', height: '100%'}}>
        {/* Canvas will be inserted here by the external view. */}
      </div>
    )
  }
}
