import React, { ChangeEvent } from "react";
import EarthViewComp from "./earth-view-comp";
import OrbitViewComp from "./orbit-view-comp";
import RaysViewComp from "./rays-view-comp";
import t from "../translation/translate";
import { ISimState, IViewState, ViewType } from "../types";

import "./view-manager.scss";

interface IProps {
  simulation: ISimState;
  view: IViewState;
  log: (action: string, data: any) => void;
  onSimStateChange: (change: Partial<ISimState>) => void;
  onViewChange: (viewPosition: keyof IViewState, viewName: ViewType) => void;
}
export default class ViewManager extends React.Component<IProps> {
  _rafId?: number;
  refs: any;
  constructor(props: IProps) {
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
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
    }
  }

  componentDidUpdate(prevProps: IProps) {
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

  rafCallback(timestamp: number) {
    this.refs.earth.rafCallback(timestamp);
    this.refs.orbit.rafCallback(timestamp);
    this._rafId = requestAnimationFrame(this.rafCallback);
  }

  // When earth view camera is changed, we need to update view axis in the orbit view.
  syncCameraAndViewAxis() {
    const camVec = this.refs.earth.getCameraEarthVec();
    this.refs.orbit.setViewAxis(camVec);
  }

  lookAtSubsolarPoint() {
    this.refs.earth.lookAtSubsolarPoint();
  }

  lookAtLatLongMarker() {
    this.refs.earth.lookAtLatLongMarker();
  }

  handleViewChange(event: ChangeEvent<HTMLSelectElement>) {
    this.props.onViewChange(event.target.name as keyof IViewState, event.target.value as ViewType);
  }

  getViewPosition(view: ViewType) {
    let key: keyof IViewState;
    for (key in this.props.view) {
      if (this.props.view[key] === view) return key;
    }
    return "hidden";
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
    } else {return null;}
  }

  lockCameraRotation(lock: boolean){
    this.refs.orbit.lockCameraRotation(lock);
  }

  renderViewSelect(position: keyof IViewState) {
    const lang = this.props.simulation.lang;
    return (
      <select className={`form-control view-select ${position}`} name={position}
              value={this.props.view[position]} onChange={this.handleViewChange}>
        <option value="earth">{ t("~EARTH", lang) }</option>
        <option value="orbit">{ t("~ORBIT", lang) }</option>
        <option value="raysGround">{ t("~GROUND", lang) }</option>
        <option value="raysSpace">{ t("~SPACE", lang) }</option>
        <option value="nothing">{ t("~NOTHING", lang) }</option>
      </select>
    );
  }

  render() {
    const lang = this.props.simulation.lang;
    return (
      <div className="view-manager">
        <div className={`view ${this.getViewPosition("earth")}`}>
          <EarthViewComp ref="earth" simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange}
                         onCameraChange={this.syncCameraAndViewAxis} log={this.props.log}/>
        </div>
        <div className={`view ${this.getViewPosition("orbit")}`}>
          <OrbitViewComp ref="orbit" simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} log={this.props.log} showCamera={this.showOrbitViewCameraModel()} />
        </div>
        <div className={`view ${this.getViewPosition("raysGround")}`}>
          <div className="rays-ground-text">{ t("~NOON", lang) }</div>
          <RaysViewComp ref="raysGround" type="ground" simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} />
        </div>
        <div className={`view ${this.getViewPosition("raysSpace")}`}>
          <RaysViewComp ref="raysSpace" type="space" simulation={this.props.simulation} onSimStateChange={this.props.onSimStateChange} />
        </div>
        { this.renderViewSelect("main") }
        { this.renderViewSelect("small-top") }
        { this.renderViewSelect("small-bottom") }
      </div>
    );
  }
}
