import React from 'react/addons';
import ViewManager from './view-manager.jsx';
import Slider from './slider.jsx';
import DaySlider from './day-slider.jsx';
import CitySelect from './city-select.jsx';

import '../../css/seasons.css';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
                     "August", "September", "October", "November", "December"];

export default class Seasons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainView: 'earth',
      simulation: {
        day: 171,
        earthTilt: true,
        earthRotation: false,
        sunEarthLine: true,
        lat: 40.11,
        long: -88.2
      }
    };

    this.mainViewChange = this.mainViewChange.bind(this);
    this.dayChange = this.dayChange.bind(this);
    this.simCheckboxChange = this.simCheckboxChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.latSliderChange = this.latSliderChange.bind(this);
    this.longSliderChange = this.longSliderChange.bind(this);
  }

  getFormattedDay() {
    // Initialize a date in `2015-01-01` (it's not a leap year).
    let date = new Date(2015, 0);
    // Add the number of days.
    date.setDate(this.state.simulation.day + 1);
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
  }

  getFormattedLat() {
    let dir = '';
    if (this.state.simulation.lat > 0) dir = 'N';
    else if (this.state.simulation.lat < 0) dir = 'S';
    let lat = Math.abs(this.state.simulation.lat).toFixed(2);
    return `${lat}°${dir}`;
  }

  getFormattedLong() {
    let dir = '';
    if (this.state.simulation.long > 0) dir = 'E';
    else if (this.state.simulation.long < 0) dir = 'W';
    let long = Math.abs(this.state.simulation.long).toFixed(2);
    return `${long}°${dir}`;
  }

  setSimState(newSimState) {
    let updateStruct = {};
    for (let key of Object.keys(newSimState)) {
      updateStruct[key] = {$set: newSimState[key]};
    }
    let newState = React.addons.update(this.state, {
      simulation: updateStruct
    });
    this.setState(newState);
  }

  mainViewChange(event) {
    this.setState({mainView: event.target.value});
  }

  dayChange(event, ui) {
    this.setSimState({day: ui.value});
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
        <ViewManager mainView={this.state.mainView} simulation={this.state.simulation} onLocationChange={this.locationChange}/>
        <div className='controls'>
          <label>Main view:
            <select value={this.state.mainView} onChange={this.mainViewChange}>
              <option value='earth'>Earth</option>
              <option value='orbit'>Orbit</option>
              <option value='rays'>Rays</option>
            </select>
          </label>
          <label>
            Day: {this.getFormattedDay()}
            <DaySlider value={this.state.simulation.day} slide={this.dayChange}/>
          </label>
          <label><input type='checkbox' name='earthRotation' checked={this.state.simulation.earthRotation} onChange={this.simCheckboxChange}/> Rotating</label>
          <label><input type='checkbox' name='earthTilt' checked={this.state.simulation.earthTilt} onChange={this.simCheckboxChange}/> Tilted</label>
          <label><input type='checkbox' name='sunEarthLine' checked={this.state.simulation.sunEarthLine} onChange={this.simCheckboxChange}/> Sun-earth line</label>
          <label>Select city: <CitySelect lat={this.state.simulation.lat} long={this.state.simulation.long} onLocationChange={this.locationChange}/></label>
          <label>Latitude: {this.getFormattedLat()}
            <Slider value={this.state.simulation.lat} min={-90} max={90} step={1} slide={this.latSliderChange}/>
          </label>
          <label>Longitude: {this.getFormattedLong()}
            <Slider value={this.state.simulation.long} min={-180} max={180} step={1} slide={this.longSliderChange}/>
          </label>
        </div>
      </div>
    );
  }
}
