import React from 'react';
import CanvasView from './canvas-view.jsx';
import VerticalRaysView from '../views/vertical-rays-view.js';
import HorizontalRaysView from '../views/horizontal-rays-view.js';

export default class RaysViewComp extends React.Component {
  constructor(props) {
    super(props);
    this.handleOrientChange = this.handleOrientChange.bind(this);
  }

  componentDidMount() {
    this.verticalRaysView = new VerticalRaysView(this.refs.vertical, this.props.simulation);
    this.horizontalRaysView = new HorizontalRaysView(this.refs.horizontal, this.props.simulation);
  }

  componentWillReceiveProps(nextProps) {
    this.verticalRaysView.setProps(nextProps.simulation);
    this.horizontalRaysView.setProps(nextProps.simulation);
  }

  shouldComponentUpdate(nextProps) {
    // `sunrayOrientation` is a property of this container, not the canvas views.
    // That's the only case when we actually want to update this component.
    return nextProps.simulation.sunrayOrientation !== this.props.simulation.sunrayOrientation;
  }

  resize() {
    this.verticalRaysView.resize();
    this.horizontalRaysView.resize();
  }

  handleOrientChange(event) {
    this.props.onSimStateChange({sunrayOrientation: event.target.value})
  }

  render() {
    let orient = this.props.simulation.sunrayOrientation;
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div ref='vertical' style={{display: orient === 'vertical' ? '' : 'none', width: '100%', height: '100%', position: 'absolute'}}>
          {/* Canvas will be inserted here by the external view. */}
        </div>
        <div ref='horizontal' style={{display: orient === 'horizontal' ? '' : 'none', width: '100%', height: '100%', position: 'absolute'}}>
          {/* Canvas will be inserted here by the external view. */}
        </div>
        <div style={{position: 'absolute', left: '10px', bottom: '5px', color: '#fff', opacity: 0.8}}>
          <label>
            <input type='radio' name='orientation' value='horizontal' checked={orient === 'horizontal'} onChange={this.handleOrientChange}/> Horizontal
          </label>
          <span> </span>
          <label>
            <input type='radio' name='orientation' value='vertical' checked={orient === 'vertical'} onChange={this.handleOrientChange}/> Vertical
          </label>
        </div>
      </div>
    );
  }
}
