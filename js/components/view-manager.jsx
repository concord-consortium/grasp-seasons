import React from 'react';
import EarthViewComp from './earth-view-comp.jsx';
import OrbitViewComp from './orbit-view-comp.jsx';
import RaysViewComp from './rays-view-comp.jsx';

export default class ViewManager extends React.Component {
  constructor(props) {
    super(props);
    this.rafCallback = this.rafCallback.bind(this);
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
    let sync = () => {
      let camVec = this.refs.earth.getCameraEarthVec();
      this.refs.orbit.setViewAxis(camVec);
    };
    // Initial sync.
    sync();
    // When earth view camera is changed, we need to update view axis in the orbit view.
    this.refs.earth.onCameraChange(sync);
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
      <div className='view-container'>
        <div className={`view ${layout.earth}`}>
          <EarthViewComp ref='earth' simulation={this.props.simulation}/>
        </div>
        <div className={`view ${layout.orbit}`}>
          <OrbitViewComp ref='orbit' simulation={this.props.simulation}/>
        </div>
        <div className={`view ${layout.rays}`}>
          <RaysViewComp ref='rays' simulation={this.props.simulation}/>
        </div>
      </div>
    )
  }
}