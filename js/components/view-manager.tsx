// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './earth-view-comp.jsx' was resolved to '/U... Remove this comment to see the full error message
import EarthViewComp from './earth-view-comp.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './orbit-view-comp.jsx' was resolved to '/U... Remove this comment to see the full error message
import OrbitViewComp from './orbit-view-comp.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './rays-view-comp.jsx' was resolved to '/Us... Remove this comment to see the full error message
import RaysViewComp from './rays-view-comp.jsx';
import t from '../translate.js';

import '../../css/view-manager.less';

export default class ViewManager extends React.Component {
  _rafId: any;
  props: any;
  refs: any;
  constructor(props: any) {
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

  componentDidUpdate(prevProps: any) {
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
    if (prevProps.simulation.earthGridlines !== this.props.simulation.earthGridlines){
      this.refs.earth.toggleGridlines(this.props.simulation.earthGridlines);
    }
  }

  rafCallback(timestamp: any) {
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

  handleViewChange(event: any) {
    this.props.onViewChange(event.target.name, event.target.value);
  }

  getViewPosition(view: any) {
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

  lockCameraRotation(lock: any){
    this.refs.orbit.lockCameraRotation(lock);
  }

  renderViewSelect(position: any) {
    let lang = this.props.simulation.lang;
    return (
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <select className={`form-control view-select ${position}`} name={position}
              value={this.props.view[position]} onChange={this.handleViewChange}>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <option value='earth'>{t("~EARTH", lang)}</option>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <option value='orbit'>{t("~ORBIT", lang)}</option>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <option value='raysGround'>{t("~GROUND", lang)}</option>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <option value='raysSpace'>{t("~SPACE", lang)}</option>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <option value='nothing'>{t("~NOTHING", lang)}</option>
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </select>
    );
  }

  render() {
    let lang = this.props.simulation.lang;
    return (
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className='view-manager'>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`view ${this.getViewPosition('earth')}`}>
          // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <EarthViewComp ref='earth' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}
                         onCameraChange={this.syncCameraAndViewAxis} log={this.props.log}/>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`view ${this.getViewPosition('orbit')}`}>
          // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <OrbitViewComp ref='orbit' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} log={this.props.log} showCamera={this.showOrbitViewCameraModel()} />
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`view ${this.getViewPosition('raysGround')}`}>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="rays-ground-text">{t("~NOON", lang)}</div>
          // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <RaysViewComp ref='raysGround' type='ground' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} />
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`view ${this.getViewPosition('raysSpace')}`}>
          // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <RaysViewComp ref='raysSpace' type='space' simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} />
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
        {this.renderViewSelect('main')}
        {this.renderViewSelect('small-top')}
        {this.renderViewSelect('small-bottom')}
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    );
  }
}
