import $ from "jquery";
import React from "react";
import update, { Spec } from "immutability-helper";
import ViewManager from "./view-manager";
import Slider from "./slider/slider";
import InfiniteDaySlider from "./slider/infinite-day-slider";
import CitySelect from "./city-select";
import AnimationCheckbox from "./animation-checkbox";
import AnimationButton from "./animation-button";
import getURLParam from "../utils/utils";
import t, { Language } from "../translation/translate";
import { ISimState, IViewState, ViewType } from "../types";
import CCLogoImg from "../assets/concord-consortium.png";

import "./seasons.scss";

interface IState {
  sim: ISimState;
  view: IViewState;
}

const ANIM_SPEED = 0.02;
const DAILY_ROTATION_ANIM_SPEED = 0.0003;
const ROTATION_SPEED = 0.0004;
const DEFAULT_STATE: IState = {
  sim: {
    day: 171,
    earthTilt: true,
    earthRotation: 1.539,
    sunEarthLine: true,
    lat: 40.11,
    long: -88.2,
    sunrayColor: "#D8D8AC",
    groundColor: "#4C7F19", // 'auto' will make color different for each season
    sunrayDistMarker: false,
    dailyRotation: false,
    earthGridlines: false,
    lang: "en_us"
  },
  view: {
    "main": "orbit",
    "small-top": "raysGround",
    "small-bottom": "nothing"
  }
};

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface IProps {
  lang: Language;
  initialState: Partial<IState>;
  logHandler: (action: string, data: any) => void;
  onSimStateChange: (change: ISimState) => void;
  onViewStateChange: (change: IViewState) => void;
}
export default class Seasons extends React.Component<IProps, IState> {
  static defaultProps: IProps = {
    lang: "en_us",
    // Can be used to overwrite default initial state.
    initialState: {},
    // State is divided into values that are related to simulation and physics and ones that purely define UI.
    onSimStateChange (simState: Partial<ISimState>) {},
    onViewStateChange (viewState: Partial<IViewState>) {},
    logHandler (action: any, data: any) {
      console.log("[log]", action, data);
    }
  };

  refs: any;
  state: IState;
  constructor(props: IProps) {
    super(props);
    this.state = $.extend(true, {}, DEFAULT_STATE, props.initialState);
    this.state.sim.lang = props.lang || getURLParam("lang") as Language || DEFAULT_STATE.sim.lang;
    this.simStateChange = this.simStateChange.bind(this);
    this.viewChange = this.viewChange.bind(this);
    this.daySliderChange = this.daySliderChange.bind(this);
    this.daySliderStop = this.daySliderStop.bind(this);
    this.dayAnimFrame = this.dayAnimFrame.bind(this);
    this.earthRotationAnimFrame = this.earthRotationAnimFrame.bind(this);
    this.simCheckboxChange = this.simCheckboxChange.bind(this);
    this.latSliderChange = this.latSliderChange.bind(this);
    this.longSliderChange = this.longSliderChange.bind(this);
    this.citySelectChange = this.citySelectChange.bind(this);
    this.subpolarButtonClick = this.subpolarButtonClick.bind(this);
    this.logCheckboxChange = this.logCheckboxChange.bind(this);
    this.logButtonClick = this.logButtonClick.bind(this);
    this.log = this.log.bind(this);
  }

  log(action: string, data?: any) {
    this.props.logHandler(action, data);
  }
  UNSAFE_componentWillReceiveProps(nextProps: IProps){
    this.setState((prevState: IState) => {
      const sim = prevState.sim;
      sim.lang = nextProps.lang;
      return { sim };
    });
  }
  componentDidMount() {
    this.lookAtSubsolarPoint();
  }

  getMonth(date: Date) {
    const lang = this.state.sim.lang;
    const monthNames = t("~MONTHS", lang);
    return monthNames[date.getMonth()];
  }
  getFormattedDay() {
    // Initialize a date in `2015-01-01` (it's not a leap year).
    const date = new Date(2015, 0);
    // Add the number of days.
    date.setDate(this.state.sim.day + 1);
    return `${this.getMonth(date)} ${date.getDate()}`;
  }

  getFormattedLat() {
    let dir = "";
    const lang = this.state.sim.lang;
    const lat = this.state.sim.lat;
    if (lat > 0) dir = t("~DIR_NORTH", lang);
    else if (lat < 0) dir = t("~DIR_SOUTH", lang);
    const latitude = Math.abs(lat).toFixed(2);
    return `${latitude}°${dir}`;
  }

  getFormattedLong() {
    let dir = "";
    const lang = this.state.sim.lang;
    const lng = this.state.sim.long;
    if (lng > 0) dir = t("~DIR_EAST", lang);
    else if (lng < 0) dir = t("~DIR_WEST", lang);
    const long = Math.abs(lng).toFixed(2);
    return `${long}°${dir}`;
  }

  getAnimSpeed() {
    // Slow down animation when daily rotation is on.
    return this.state.sim.dailyRotation ? DAILY_ROTATION_ANIM_SPEED : ANIM_SPEED;
  }

  setPlayBtnDisabled(v: boolean) {
    if (!this.refs.playButton) return;
    this.refs.playButton.setDisabled(v);
  }

  setRotatingBtnDisabled(v: boolean) {
    if (!this.refs.rotatingButton) return;
    this.refs.rotatingButton.setDisabled(v);
  }

  setSimState(newSimState: Partial<ISimState>, callback?: () => void, skipEvent=false) {
    const updateStruct: Spec<ISimState> = {};
    let key: keyof ISimState;
    for (key in newSimState) {
      if (newSimState[key] !== this.state.sim[key]) {
        updateStruct[key] = { $set: newSimState[key] } as any;
      }
    }
    if (Object.keys(updateStruct).length === 0) {
      // Skip if there is nothing to update.
      return;
    }
    this.setState(prevState => {
      const newState = update(prevState.sim, updateStruct);
      return { sim: newState };
    }, () => {
      if (callback) callback();
      if (!skipEvent) {
        this.props.onSimStateChange(this.state.sim);
      }
    });
  }

  // Used by the simulation view itself, as user can interact with the view.
  simStateChange(newState: Partial<ISimState>) {
    this.setSimState(newState);
  }

  viewChange(viewPosition: keyof IViewState, viewName: ViewType) {
    const updateStruct: Spec<IViewState> = {};
    updateStruct[viewPosition] = { $set: viewName };
    // Swap views if needed.
    if (viewName !== "nothing") {
      const oldView = this.state.view[viewPosition];
      for (const key in this.state.view) {
        if (this.state.view[key as keyof IViewState] === viewName) {
          updateStruct[key as keyof IViewState] = { $set: oldView };
        }
      }
    }
    this.setState(prevState => {
      const newState = update(prevState.view, updateStruct);
      return { view: newState };
    }, () => {
      this.log("ViewsRearranged", this.state.view);
      this.props.onViewStateChange(this.state.view);
    });
  }

  daySliderChange(event: any, ui: any) {
    this.setSimState({ day: ui.value });
  }

  daySliderStop(event: any, ui: any) {
    this.log("DaySliderChanged", { day: ui.value });
  }

  dayAnimFrame(newDay: number) {
    // % 365 as this handler is also used for animation, which doesn't care about 365 limit.
    const state: Partial<ISimState> = { day: newDay % 365 };
    if (this.state.sim.dailyRotation) {
      state.earthRotation = (newDay % 1) * 2 * Math.PI;
    }
    this.setSimState(state);
  }

  earthRotationAnimFrame(newAngle: number) {
    // Again, animation simply increases value so make sure that angle has reasonable value.
    this.setSimState({ earthRotation: newAngle % (2 * Math.PI) });
  }

  simCheckboxChange(event: any) {
    const newSimState: Partial<ISimState> = {};
    newSimState[event.target.name as keyof ISimState] = event.target.checked;
    this.setSimState(newSimState);
    this.logCheckboxChange(event);
  }

  logCheckboxChange(event: any) {
    this.log(capitalize(event.target.name) + "CheckboxChanged", {
      value: event.target.checked
    });
  }

  logButtonClick(event: any) {
    this.log(capitalize(event.target.name) + "ButtonClicked");
  }

  latSliderChange(event: any, ui: any) {
    this.setSimState({ lat: ui.value });
  }

  longSliderChange(event: any, ui: any) {
    this.setSimState({ long: ui.value });
  }

  citySelectChange(lat: number, long: number, city: string) {
    // When a new city is selected, update lat-long marker, but also:
    // - rotate earth so the new point is on the bright side of earth,
    // - update camera position to look at this point.
    const rot = -long * Math.PI / 180;
    this.setSimState({ lat, long, earthRotation: rot }, () => {
      // .setState is an async operation!
      this.refs.view.lookAtLatLongMarker();
    });
    this.log("CityPulldownChanged", {
      value: city,
      lat,
      long
    })
  }

  lookAtSubsolarPoint() {
    this.refs.view.lookAtSubsolarPoint();
    // Clicking the subsolar button should also turn the Earth such that the longitude of
    // the selected city or point is visible. 11.5 deg shift ensures that the point is perfectly
    // positioned. I can't explain why we need it.
    this.setSimState({ earthRotation: (11.5 - this.state.sim.long) * Math.PI / 180 });
  }

  subpolarButtonClick(event: any) {
    this.lookAtSubsolarPoint();
    this.logButtonClick(event);
  }

  getEarthScreenPosition(){
    return this.refs.view.getEarthScreenPosition();
  }

  lockCameraRotation(lock: boolean) {
    this.refs.view.lockCameraRotation(lock);
  }

  render() {
    const lang = this.state.sim.lang,
    earthVisible = Object.values(this.state.view).indexOf("earth") > -1;

    return (
      <div className="grasp-seasons">
        <ViewManager ref="view" view={this.state.view} simulation={this.state.sim} onSimStateChange={this.simStateChange} onViewChange={this.viewChange} log={this.log} />
        <div className="controls" >
          <div className="left-col">
            <div className="form-group">
              <AnimationButton ref="playButton" speed={this.getAnimSpeed()} currentValue={this.state.sim.day} lang={lang} onAnimationStep={this.dayAnimFrame}
                               onClick={this.logButtonClick}/>
              <label><input type="checkbox" name="dailyRotation" checked={this.state.sim.dailyRotation} onChange={this.simCheckboxChange}/> { t("~DAILY_ROTATION", lang) }</label>
              <label className="day">{ t("~DAY", lang) }: { this.getFormattedDay() }</label>
              <div className="day-slider">
                <InfiniteDaySlider value={this.state.sim.day} slide={this.daySliderChange} lang={lang} log={this.log} logId="Day"/>
              </div>
            </div>
            <div className="form-group pull-left">
              <CitySelect lat={this.state.sim.lat} long={this.state.sim.long} lang={lang} onCityChange={this.citySelectChange}/>
              <div className="earth-gridlines-toggle">

              </div>
            </div>
          </div>
          <div className="right-col">
            <button className="btn btn-default" onClick={this.subpolarButtonClick} name="ViewSubpolarPoint">{ t("~VIEW_SUBSOLAR_POINT", lang) }</button>
            <div className="long-lat-sliders">
              <div className="form-group">
                <label>{ t("~LATITUDE", lang) }: { this.getFormattedLat() }</label>
                <Slider value={this.state.sim.lat} min={-90} max={90} step={1} slide={this.latSliderChange} log={this.log} logId="Latitude"/>
              </div>
              <div className="form-group">
                <label>{ t("~LONGITUDE", lang) }: { this.getFormattedLong() }</label>
                <Slider value={this.state.sim.long} min={-180} max={180} step={1} slide={this.longSliderChange} log={this.log} logId="Longitude"/>
              </div>
            </div>
            <div className="checkboxes">
              <label>
                <AnimationCheckbox ref="rotatingButton" speed={ROTATION_SPEED} currentValue={this.state.sim.earthRotation} onAnimationStep={this.earthRotationAnimFrame}
                                  name="EarthRotation" onChange={this.logCheckboxChange}/> { t("~ROTATING", lang) }
              </label>
              <label><input type="checkbox" name="earthTilt" checked={this.state.sim.earthTilt} onChange={this.simCheckboxChange}/> { t("~TILTED", lang) }</label>
              <label><input type="checkbox" name="sunEarthLine" checked={this.state.sim.sunEarthLine} onChange={this.simCheckboxChange}/> { t("~SUN_EARTH_LINE", lang) }</label>
              {
                earthVisible &&
                <label><input type="checkbox" name="earthGridlines" checked={this.state.sim.earthGridlines} onChange={this.simCheckboxChange}/>{ t("~EARTH_GRIDLINES", lang) }</label>
              }
            </div>
          </div>
        </div>
        <footer className="page-footer">
          <section>
            <a className="cc-brand" href="http://concord.org/" target="_blank" title="The Concord Consortium - Revolutionary digital learning for science, math and engineering" rel="noreferrer"><img src={CCLogoImg} alt="The Concord Consortium" /></a>
            <p>&copy; Copyright 2024 The Concord Consortium</p>
          </section>
        </footer>
      </div>
    );
  }
}
