// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jque... Remove this comment to see the full error message
import $ from 'jquery';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import update from 'immutability-helper';
// @ts-expect-error ts-migrate(6142) FIXME: Module './view-manager.jsx' was resolved to '/User... Remove this comment to see the full error message
import ViewManager from './view-manager.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './slider.jsx' was resolved to '/Users/kswe... Remove this comment to see the full error message
import Slider from './slider.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './day-slider.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import DaySlider from './day-slider.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './city-select.jsx' was resolved to '/Users... Remove this comment to see the full error message
import CitySelect from './city-select.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './animation-checkbox.jsx' was resolved to ... Remove this comment to see the full error message
import AnimationCheckbox from './animation-checkbox.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './animation-button.jsx' was resolved to '/... Remove this comment to see the full error message
import AnimationButton from './animation-button.jsx';
import getURLParam from '../utils.js';
import t from '../translate.js';

import '../../css/seasons.less';
import '../../css/seasons-bootstrap.scss';

const ANIM_SPEED = 0.02;
const DAILY_ROTATION_ANIM_SPEED = 0.0003;
const ROTATION_SPEED = 0.0004;
const DEFAULT_STATE = {
  sim: {
    day: 171,
    earthTilt: true,
    earthRotation: 1.539,
    sunEarthLine: true,
    lat: 40.11,
    long: -88.2,
    sunrayColor: '#D8D8AC',
    groundColor: '#4C7F19', // 'auto' will make color different for each season
    sunrayDistMarker: false,
    dailyRotation: false,
    earthGridlines: false,
    lang: 'en_us'
  },
  view: {
    'main': 'orbit',
    'small-top': 'raysGround',
    'small-bottom': 'nothing'
  }
};

function capitalize(string: any) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class Seasons extends React.Component {
  props: any;
  refs: any;
  setState: any;
  state: any;
  constructor(props: any) {
    super(props);
    this.state = $.extend(true, {}, DEFAULT_STATE, props.initialState);
    this.state.sim.lang = props.lang || getURLParam('lang') || DEFAULT_STATE.sim.lang;
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

  log(action: any, data: any) {
    this.props.logHandler(action, data);
  }
  UNSAFE_componentWillReceiveProps(nextProps: any){
    let sim = this.state.sim;
    sim.lang = nextProps.lang;
    this.setState({sim});
  }
  componentDidMount() {
    this.lookAtSubsolarPoint();
  }

  getMonth(date: any){
    let lang = this.state.sim.lang;
    let monthNames = t("~MONTHS", lang);
    return monthNames[date.getMonth()];
  }
  getFormattedDay() {
    // Initialize a date in `2015-01-01` (it's not a leap year).
    let date = new Date(2015, 0);
    // Add the number of days.
    date.setDate(this.state.sim.day + 1);
    return `${this.getMonth(date)} ${date.getDate()}`;
  }

  getFormattedLat() {
    let dir = '';
    let lang = this.state.sim.lang;
    let lat = this.state.sim.lat;
    if (lat > 0) dir = t("~DIR_NORTH", lang);
    else if (lat < 0) dir = t("~DIR_SOUTH", lang);
    let latitude = Math.abs(lat).toFixed(2);
    return `${latitude}°${dir}`;
  }

  getFormattedLong() {
    let dir = '';
    let lang = this.state.sim.lang;
    let lng = this.state.sim.long;
    if (lng > 0) dir = t("~DIR_EAST", lang);
    else if (lng < 0) dir = t("~DIR_WEST", lang);
    let long = Math.abs(lng).toFixed(2);
    return `${long}°${dir}`;
  }

  getAnimSpeed() {
    // Slow down animation when daily rotation is on.
    return this.state.sim.dailyRotation ? DAILY_ROTATION_ANIM_SPEED : ANIM_SPEED;
  }

  setPlayBtnDisabled(v: any) {
    if (!this.refs.playButton) return;
    this.refs.playButton.setDisabled(v);
  }

  setRotatingBtnDisabled(v: any) {
    if (!this.refs.rotatingButton) return;
    this.refs.rotatingButton.setDisabled(v);
  }

  setSimState(newSimState: any, callback: any, skipEvent=false) {
    let updateStruct = {};
    for (let key of Object.keys(newSimState)) {
      if (newSimState[key] !== this.state.sim[key]) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        updateStruct[key] = {$set: newSimState[key]};
      }
    }
    if (Object.keys(updateStruct).length === 0) {
      // Skip if there is nothing to update.
      return;
    }
    let newState = update(this.state.sim, updateStruct);
    this.setState({sim: newState}, () => {
      if (callback) callback();
      if (!skipEvent) {
        this.props.onSimStateChange(this.state.sim);
      }
    });
  }

  // Used by the simulation view itself, as user can interact with the view.
  simStateChange(newState: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState(newState);
  }

  viewChange(viewPosition: any, viewName: any) {
    let updateStruct = {};
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    updateStruct[viewPosition] = {$set: viewName};
    // Swap views if needed.
    if (viewName !== 'nothing') {
      let oldView = this.state.view[viewPosition];
      for (let key in this.state.view) {
        if (this.state.view[key] === viewName) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          updateStruct[key] = {$set: oldView};
        }
      }
    }
    let newState = update(this.state.view, updateStruct);
    this.setState({view: newState}, () => {
      this.log('ViewsRearranged', this.state.view);
      this.props.onViewStateChange(this.state.view);
    });
  }

  daySliderChange(event: any, ui: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState({day: ui.value});
  }

  daySliderStop(event: any, ui: any) {
    this.log('DaySliderChanged', {day: ui.value});
  }

  dayAnimFrame(newDay: any) {
    // % 365 as this handler is also used for animation, which doesn't care about 365 limit.
    let state = {day: newDay % 365};
    if (this.state.sim.dailyRotation) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'earthRotation' does not exist on type '{... Remove this comment to see the full error message
      state.earthRotation = (newDay % 1) * 2 * Math.PI;
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState(state);
  }

  earthRotationAnimFrame(newAngle: any) {
    // Again, animation simply increases value so make sure that angle has reasonable value.
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState({earthRotation: newAngle % (2 * Math.PI)});
  }

  simCheckboxChange(event: any) {
    let newSimState = {};
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    newSimState[event.target.name] = event.target.checked;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState(newSimState);
    this.logCheckboxChange(event);
  }

  logCheckboxChange(event: any) {
    this.log(capitalize(event.target.name) + 'CheckboxChanged', {
      value: event.target.checked
    });
  }

  logButtonClick(event: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    this.log(capitalize(event.target.name) + 'ButtonClicked');
  }

  latSliderChange(event: any, ui: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState({lat: ui.value});
  }

  longSliderChange(event: any, ui: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState({long: ui.value});
  }

  citySelectChange(lat: any, long: any, city: any) {
    // When a new city is selected, update lat-long marker, but also:
    // - rotate earth so the new point is on the bright side of earth,
    // - update camera position to look at this point.
    let rot = -long * Math.PI / 180;
    this.setSimState({lat: lat, long: long, earthRotation: rot}, () => {
      // .setState is an async operation!
      this.refs.view.lookAtLatLongMarker();
    });
    this.log('CityPulldownChanged', {
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
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    this.setSimState({earthRotation: (11.5 - this.state.sim.long) * Math.PI / 180});
  }

  subpolarButtonClick(event: any) {
    this.lookAtSubsolarPoint();
    this.logButtonClick(event);
  }

  getEarthScreenPosition(){
    return this.refs.view.getEarthScreenPosition();
  }

  lockCameraRotation(lock: any){
    this.refs.view.lockCameraRotation(lock);
  }

  render() {
    let lang = this.state.sim.lang,
    earthVisible = Object.values(this.state.view).indexOf("earth") > -1;

    return (
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className='grasp-seasons'>
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ViewManager ref='view' view={this.state.view} simulation={this.state.sim} onSimStateChange={this.simStateChange} onViewChange={this.viewChange} log={this.log} />
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='controls clearfix' >
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className='pull-right right-col'>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <button className='btn btn-default' onClick={this.subpolarButtonClick} name='ViewSubpolarPoint'>{t("~VIEW_SUBSOLAR_POINT", lang)}</button>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <span> </span>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label>
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <AnimationCheckbox ref='rotatingButton' speed={ROTATION_SPEED} currentValue={this.state.sim.earthRotation} onAnimationStep={this.earthRotationAnimFrame}
                                 name='EarthRotation' onChange={this.logCheckboxChange}/> {t("~ROTATING", lang)}
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </label>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <span> </span>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label><input type='checkbox' name='earthTilt' checked={this.state.sim.earthTilt} onChange={this.simCheckboxChange}/> {t("~TILTED", lang)}</label>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <span> </span>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label><input type='checkbox' name='sunEarthLine' checked={this.state.sim.sunEarthLine} onChange={this.simCheckboxChange}/> {t("~SUN_EARTH_LINE", lang)}</label>

            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='long-lat-sliders pull-right'>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className='form-group'>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <label>{t("~LATITUDE", lang)}: {this.getFormattedLat()}</label>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Slider value={this.state.sim.lat} min={-90} max={90} step={1} slide={this.latSliderChange} log={this.log} logId='Latitude'/>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className='form-group'>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <label>{t("~LONGITUDE", lang)}: {this.getFormattedLong()}</label>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Slider value={this.state.sim.long} min={-180} max={180} step={1} slide={this.longSliderChange} log={this.log} logId='Longitude'/>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className='left-col'>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='form-group'>
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <AnimationButton ref='playButton' speed={this.getAnimSpeed()} currentValue={this.state.sim.day} lang={lang} onAnimationStep={this.dayAnimFrame}
                               onClick={this.logButtonClick}/>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <label><input type='checkbox' name='dailyRotation' checked={this.state.sim.dailyRotation} onChange={this.simCheckboxChange}/> {t("~DAILY_ROTATION", lang)}</label>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <label className='day'>{t("~DAY", lang)}: {this.getFormattedDay()}</label>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className='day-slider'>
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <DaySlider value={this.state.sim.day} slide={this.daySliderChange} lang={lang} log={this.log} logId='Day'/>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='form-group pull-left'>
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <CitySelect lat={this.state.sim.lat} long={this.state.sim.long} lang={lang} onCityChange={this.citySelectChange}/>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className='earth-gridlines-toggle'>
                { earthVisible &&
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <label>{t("~EARTH_GRIDLINES", lang)}<input type='checkbox' name='earthGridlines' checked={this.state.sim.earthGridlines} onChange={this.simCheckboxChange}/></label>
                }
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    );
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultProps' does not exist on type 'ty... Remove this comment to see the full error message
Seasons.defaultProps = {
  // Can be used to overwrite default initial state.
  initialState: {},
  // State is divided into values that are related to simulation and physics and ones that purely define UI.
  onSimStateChange: function (simState: any) {},
  onViewStateChange: function (viewState: any) {},
  logHandler: function (action: any, data: any) {
    console.log('[log]', action, data);
  }
};
