import React from 'react';
import EarthViewComp from './earth-view-comp.jsx';
import OrbitViewComp from './orbit-view-comp.jsx';
import RaysViewComp from './rays-view-comp.jsx';

import '../../css/view-manager.css';

export default class ViewManager extends React.Component {
  constructor(props) {
    super(props);
    this.rafCallback = this.rafCallback.bind(this);
    this.syncCameraAndViewAxis = this.syncCameraAndViewAxis.bind(this);
  }

  componentDidMount() {
    this._rafId = requestAnimationFrame(this.rafCallback);
    this.syncCameraAndViewAxis();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._rafId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mainView !== this.props.mainView) {
      this.refs.earth.resize();
      this.refs.orbit.resize();
      this.refs.rays.resize();
    }
  }

  rafCallback(timestamp) {
    this.refs.earth.rafCallback(timestamp);
    this.refs.orbit.rafCallback(timestamp);
    this._rafId = requestAnimationFrame(this.rafCallback);
  }

  // When earth view camera is changed, we need to update view axis in the orbit view.
  syncCameraAndViewAxis() {
    let camVec = this.refs.earth.getCameraEarthVec();
    this.refs.orbit.setViewAxis(camVec);
  }

  lookAtSubsolarPoint() {
    this.refs.earth.lookAtSubsolarPoint();
  }

  lookAtLatLongMarker() {
    this.refs.earth.lookAtLatLongMarker();
  }

  getLayout() {
    switch(this.props.mainView) {
      case 'earth':
        return {earth: 'main', orbit: 'small-top', rays: 'small-bottom'};
      case 'orbit':
        return {earth: 'small-top', orbit: 'main', rays: 'small-bottom'};
      case 'rays':
        return {earth: 'small-top', orbit: 'small-bottom', rays: 'main'};
    }
  }

  render() {
    let layout = this.getLayout();
    return (
      <div className='view-manager'>
        <div className={`view ${layout.earth}`}>
          <EarthViewComp ref='earth' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} onCameraChange={this.syncCameraAndViewAxis}/>
          <div className='view-label'>Earth</div>
        </div>
        <div className={`view ${layout.orbit}`}>
          <OrbitViewComp ref='orbit' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}/>
          <div className='view-label'>Orbit</div>
        </div>
        <div className={`view ${layout.rays}`}>
          <RaysViewComp ref='rays' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}/>
          <div className='view-label'>Rays</div>
        </div>
      </div>
    );
  }
}
