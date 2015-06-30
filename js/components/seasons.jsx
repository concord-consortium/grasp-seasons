import React from 'react/addons';
import ViewManager from './view-manager.jsx';
import Slider from './slider.jsx';
import DaySlider from './day-slider.jsx';

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
        lat: 0,
        long: 0
      }
    };

    this.mainViewChange = this.mainViewChange.bind(this);
    this.dayChange = this.dayChange.bind(this);
    this.simCheckboxChange = this.simCheckboxChange.bind(this);
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

  render() {
    return (
      <div>
        <ViewManager mainView={this.state.mainView} simulation={this.state.simulation}/>
        <div className='controls'>
          <label>Main view:
            <select value={this.state.mainView} onChange={this.mainViewChange}>
              <option value='earth'>Earth</option>
              <option value='orbit'>Orbit</option>
              <option value='rays'>Rays</option>
            </select>
          </label>
          <DaySlider value={this.state.simulation.day} slide={this.dayChange}/>
          <label><input type='checkbox' name='earthRotation' checked={this.state.simulation.earthRotation} onChange={this.simCheckboxChange}/> Rotating</label>
          <label><input type='checkbox' name='earthTilt' checked={this.state.simulation.earthTilt} onChange={this.simCheckboxChange}/> Tilted</label>
          <label><input type='checkbox' name='sunEarthLine' checked={this.state.simulation.sunEarthLine} onChange={this.simCheckboxChange}/> Sun-earth line</label>
        </div>
      </div>
    );
  }
}
