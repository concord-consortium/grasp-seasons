import React from 'react';
import EarthViewComp from './earth-view-comp.jsx';
import OrbitViewComp from './orbit-view-comp.jsx';
import RaysViewComp from './rays-view-comp.jsx';

import '../../css/view-manager.less';

export default class ViewManager extends React.Component {
  constructor(props) {
    super(props);
    this.rafCallback = this.rafCallback.bind(this);
    this.syncCameraAndViewAxis = this.syncCameraAndViewAxis.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.showOrbitViewCameraModel = this.showOrbitViewCameraModel.bind(this);
  }

  componentDidMount() {
    this._rafId = requestAnimationFrame(this.rafCallback);
    this.refs.orbit.toggleCameraModel(this.showOrbitViewCameraModel());
    this.syncCameraAndViewAxis();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._rafId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view !== this.props.view) {
      this.refs.earth.resize();
      this.refs.orbit.resize();
      this.refs.raysGround.resize();
      this.refs.raysSpace.resize();

      this.refs.orbit.toggleCameraModel(this.showOrbitViewCameraModel());
      if (this.showOrbitViewCameraModel()){
        this.syncCameraAndViewAxis();
      }
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

  handleViewChange(event) {
    this.props.onViewChange(event.target.name, event.target.value);
  }

  getViewPosition(view) {
    for (let key in this.props.view) {
      if (this.props.view[key] === view) return key;
    }
    return 'hidden';
  }

  showOrbitViewCameraModel(){
    // Hiding camera model for now, retaining functionality for future.
    // If Earth is visible in another view, Orbit view will show camera model
    // return (Object.values(this.props.view)).indexOf("earth") > -1;
    return false;
  }

  getEarthScreenPosition(){
    if ((Object.values(this.props.view)).indexOf("orbit") > -1){
      return this.refs.orbit.getEarthPosition();
    } else return null;
  }

  renderViewSelect(position) {
    return (
      <select className={`form-control view-select ${position}`} name={position}
              value={this.props.view[position]} onChange={this.handleViewChange}>
        <option value='earth'>Earth</option>
        <option value='orbit'>Orbit</option>
        <option value='raysGround'>Ground</option>
        <option value='raysSpace'>Space</option>
        <option value='nothing'>Nothing</option>
      </select>
    );
  }

  render() {
    return (
      <div className='view-manager'>
        <div className={`view ${this.getViewPosition('earth')}`}>
          <EarthViewComp ref='earth' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}
                         onCameraChange={this.syncCameraAndViewAxis} log={this.props.log}/>
        </div>
        <div className={`view ${this.getViewPosition('orbit')}`}>
          <OrbitViewComp ref='orbit' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} log={this.props.log} showCamera={this.showOrbitViewCameraModel()}/>
        </div>
        <div className={`view ${this.getViewPosition('raysGround')}`}>
          <RaysViewComp ref='raysGround' type='ground' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}/>
        </div>
        <div className={`view ${this.getViewPosition('raysSpace')}`}>
          <RaysViewComp ref='raysSpace' type='space' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}/>
        </div>
        {this.renderViewSelect('main')}
        {this.renderViewSelect('small-top')}
        {this.renderViewSelect('small-bottom')}
      </div>
    );
  }
}
