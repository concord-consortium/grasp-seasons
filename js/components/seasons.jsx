import React from 'react/addons';
import ViewManager from './view-manager.jsx';
import Slider from './slider.jsx';
import DaySlider from './day-slider.jsx';
import CitySelect from './city-select.jsx';
import AnimationButton from './animation-button.jsx';

import '../../css/seasons.css';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
                     "August", "September", "October", "November", "December"];

export default class Seasons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainView: 'earth',
      sim: {
        day: 171,
        earthTilt: true,
        earthRotation: false,
        sunEarthLine: true,
        lat: 40.11,
        long: -88.2
      }
    };

    this.mainViewChange = this.mainViewChange.bind(this);
    this.daySliderChange = this.daySliderChange.bind(this);
    this.dayAnimStep = this.dayAnimStep.bind(this);
    this.simCheckboxChange = this.simCheckboxChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.latSliderChange = this.latSliderChange.bind(this);
    this.longSliderChange = this.longSliderChange.bind(this);
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

  setSimState(newSimState) {
    let updateStruct = {};
    for (let key of Object.keys(newSimState)) {
      updateStruct[key] = {$set: newSimState[key]};
    }
    let newState = React.addons.update(this.state, {
      sim: updateStruct
    });
    this.setState(newState);
  }

  mainViewChange(event) {
    this.setState({mainView: event.target.value});
  }

  daySliderChange(event, ui) {
    this.setSimState({day: ui.value});
  }

  dayAnimStep(newDay) {
    this.setSimState({day: newDay});
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

  locationChange(loc) {
    this.setSimState(loc);
  }

  render() {
    return (
      <div>
        <ViewManager mainView={this.state.mainView} simulation={this.state.sim} onLocationChange={this.locationChange}/>
        <div className='controls'>
          <label>Main view:
            <select value={this.state.mainView} onChange={this.mainViewChange}>
              <option value='earth'>Earth</option>
              <option value='orbit'>Orbit</option>
              <option value='rays'>Rays</option>
            </select>
          </label>
          <label>
            <AnimationButton speed={0.02} currentValue={this.state.sim.day} onAnimationStep={this.dayAnimStep}/> Day: {this.getFormattedDay()}
            <DaySlider value={this.state.sim.day} slide={this.daySliderChange}/>
          </label>
          <label><input type='checkbox' name='earthRotation' checked={this.state.sim.earthRotation} onChange={this.simCheckboxChange}/> Rotating</label>
          <label><input type='checkbox' name='earthTilt' checked={this.state.sim.earthTilt} onChange={this.simCheckboxChange}/> Tilted</label>
          <label><input type='checkbox' name='sunEarthLine' checked={this.state.sim.sunEarthLine} onChange={this.simCheckboxChange}/> Sun-earth line</label>
          <label>Select city: <CitySelect lat={this.state.sim.lat} long={this.state.sim.long} onLocationChange={this.locationChange}/></label>
          <label>Latitude: {this.getFormattedLat()}
            <Slider value={this.state.sim.lat} min={-90} max={90} step={1} slide={this.latSliderChange}/>
          </label>
          <label>Longitude: {this.getFormattedLong()}
            <Slider value={this.state.sim.long} min={-180} max={180} step={1} slide={this.longSliderChange}/>
          </label>
        </div>
      </div>
    );
  }
}
