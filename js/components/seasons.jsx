import React from 'react';
import update from 'react-addons-update';
import ViewManager from './view-manager.jsx';
import Slider from './slider.jsx';
import DaySlider from './day-slider.jsx';
import CitySelect from './city-select.jsx';
import AnimationCheckbox from './animation-checkbox.jsx';
import AnimationButton from './animation-button.jsx';
import EventEmitter from 'eventemitter2';

import '../../css/seasons.less';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
                     "August", "September", "October", "November", "December"];

const ANIM_SPEED = 0.02;
const DAILY_ROTATION_ANIM_SPEED = 0.0003;
const ROTATION_SPEED = 0.0004;

export default class Seasons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyRotation: false,
      sim: {
        day: 171,
        earthTilt: true,
        earthRotation: 1.539,
        sunEarthLine: true,
        lat: 40.11,
        long: -88.2,
        sunrayColor: '#D8D8AC',
        groundColor: '#4C7F19',
        sunrayDistMarker: false
      },
      view: {
        'main': 'raysGround',
        'small-top': 'orbit',
        'small-bottom': 'earth'
      }
    };

    this.dispatch = new EventEmitter();

    this.simStateChange = this.simStateChange.bind(this);
    this.viewChange = this.viewChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.daySliderChange = this.daySliderChange.bind(this);
    this.dayAnimFrame = this.dayAnimFrame.bind(this);
    this.earthRotationAnimFrame = this.earthRotationAnimFrame.bind(this);
    this.simCheckboxChange = this.simCheckboxChange.bind(this);
    this.latSliderChange = this.latSliderChange.bind(this);
    this.longSliderChange = this.longSliderChange.bind(this);
    this.citySelectChange = this.citySelectChange.bind(this);
    this.lookAtSubsolarPoint = this.lookAtSubsolarPoint.bind(this);
  }

  on(event, callback) {
    this.dispatch.on(event, callback);
  }

  getFormattedDay() {
    // Initialize a date in `2015-01-01` (it's not a leap year).
    let date = new Date(2015, 0);
    // Add the number of days.
    date.setDate(this.state.sim.day + 1);
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
  }

  getFormattedLat() {
    let dir = '';
    if (this.state.sim.lat > 0) dir = 'N';
    else if (this.state.sim.lat < 0) dir = 'S';
    let lat = Math.abs(this.state.sim.lat).toFixed(2);
    return `${lat}°${dir}`;
  }

  getFormattedLong() {
    let dir = '';
    if (this.state.sim.long > 0) dir = 'E';
    else if (this.state.sim.long < 0) dir = 'W';
    let long = Math.abs(this.state.sim.long).toFixed(2);
    return `${long}°${dir}`;
  }

  getAnimSpeed() {
    // Slow down animation when daily rotation is on.
    return this.state.dailyRotation ? DAILY_ROTATION_ANIM_SPEED : ANIM_SPEED;
  }

  setPlayBtnDisabled(v) {
    if (!this.refs.playButton) return;
    this.refs.playButton.setDisabled(v);
  }

  setRotatingBtnDisabled(v) {
    if (!this.refs.rotatingButton) return;
    this.refs.rotatingButton.setDisabled(v);
  }

  setSimState(newSimState, callback, skipEvent=false) {
    let updateStruct = {};
    for (let key of Object.keys(newSimState)) {
      if (newSimState[key] !== this.state.sim[key]) {
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
        this.dispatch.emit('simState.change', this.state.sim);
      }
    });
  }

  // Used by the simulation view itself, as user can interact with the view.
  simStateChange(newState) {
    this.setSimState(newState);
  }

  viewChange(viewPosition, viewName) {
    let updateStruct = {};
    updateStruct[viewPosition] = {$set: viewName};
    // Swap views if needed.
    if (viewName !== 'nothing') {
      let oldView = this.state.view[viewPosition];
      for (let key in this.state.view) {
        if (this.state.view[key] === viewName) {
          updateStruct[key] = {$set: oldView};
        }
      }
    }
    let newState = update(this.state.view, updateStruct);
    this.setState({view: newState}, () => {
      this.dispatch.emit('viewState.change', this.state.view);
    });
  }

  handleStateChange(event) {
    let state = {};
    // Handle all kind of inputs (checkboxes and radios use .checked prop).
    state[event.target.name] = event.target.checked !== undefined ? event.target.checked : event.target.value;
    this.setState(state);
  }

  daySliderChange(event, ui) {
    this.setSimState({day: ui.value});
  }

  dayAnimFrame(newDay) {
    // % 365 as this handler is also used for animation, which doesn't care about 365 limit.
    let state = {day: newDay % 365};
    if (this.state.dailyRotation) {
      state.earthRotation = (newDay % 1) * 2 * Math.PI;
    }
    this.setSimState(state);
  }

  earthRotationAnimFrame(newAngle) {
    // Again, animation simply increases value so make sure that angle has reasonable value.
    this.setSimState({earthRotation: newAngle % (2 * Math.PI)});
  }

  simCheckboxChange(event) {
    let newSimState = {};
    newSimState[event.target.name] = event.target.checked;
    this.setSimState(newSimState);
  }

  latSliderChange(event, ui) {
    this.setSimState({lat: ui.value});
  }

  longSliderChange(event, ui) {
    this.setSimState({long: ui.value});
  }

  citySelectChange(lat, long) {
    // When a new city is selected, update lat-long marker, but also:
    // - rotate earth so the new point is on the bright side of earth,
    // - update camera position to look at this point.
    let rot = -long * Math.PI / 180;
    this.setSimState({lat: lat, long: long, earthRotation: rot}, () => {
      // .setState is an async operation!
      this.refs.view.lookAtLatLongMarker();
    });
  }

  lookAtSubsolarPoint() {
    this.refs.view.lookAtSubsolarPoint();
    // Clicking the subsolar button should also turn the Earth such that the longitude of
    // the selected city or point is visible. 11.5 deg shift ensures that the point is perfectly
    // positioned. I can't explain why we need it.
    this.setSimState({earthRotation: (11.5 - this.state.sim.long) * Math.PI / 180});
  }

  render() {
    return (
      <div className='grasp-seasons'>
        <ViewManager ref='view' view={this.state.view} simulation={this.state.sim} onSimStateChange={this.simStateChange} onViewChange={this.viewChange}/>
        <div className='controls clearfix' >
          <div className='pull-right right-col'>
            <button className='btn btn-default' onClick={this.lookAtSubsolarPoint}>View Subsolar Point</button>
            <span> </span>
            <label><AnimationCheckbox ref='rotatingButton' speed={ROTATION_SPEED} currentValue={this.state.sim.earthRotation} onAnimationStep={this.earthRotationAnimFrame}/> Rotating</label>
            <span> </span>
            <label><input type='checkbox' name='earthTilt' checked={this.state.sim.earthTilt} onChange={this.simCheckboxChange}/> Tilted</label>
            <span> </span>
            <label><input type='checkbox' name='sunEarthLine' checked={this.state.sim.sunEarthLine} onChange={this.simCheckboxChange}/> Sun-earth line</label>
          </div>
          <div className='left-col'>
            <div className='form-group'>
              <AnimationButton ref='playButton' speed={this.getAnimSpeed()} currentValue={this.state.sim.day} onAnimationStep={this.dayAnimFrame}/>
              <label><input type='checkbox' name='dailyRotation' checked={this.state.dailyRotation} onChange={this.handleStateChange}/> Daily rotation</label>
              <label className='day'>Day: {this.getFormattedDay()}</label>
              <div className='day-slider'>
                <DaySlider value={this.state.sim.day} slide={this.daySliderChange}/>
              </div>
            </div>
            <div className='form-group pull-left'>
              <label>Select city:</label>
              <CitySelect lat={this.state.sim.lat} long={this.state.sim.long} onCityChange={this.citySelectChange}/>
            </div>
            <div className='long-lat-sliders pull-right'>
              <div className='form-group'>
                <label>Latitude: {this.getFormattedLat()}</label>
                <Slider value={this.state.sim.lat} min={-90} max={90} step={1} slide={this.latSliderChange}/>
              </div>
              <div className='form-group'>
                <label>Longitude: {this.getFormattedLong()}</label>
                <Slider value={this.state.sim.long} min={-180} max={180} step={1} slide={this.longSliderChange}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
