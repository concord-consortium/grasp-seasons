import React from 'react';
import CITY_DATA from '../city-data.js';

const LOCATIONS = [{name: 'Custom location', disabled: true}].concat(CITY_DATA);

export default class CitySelect extends React.Component {
  selectChange(event) {
    let city = LOCATIONS[event.target.value];
    this.props.onCityChange(city.lat, city.long, city.name);
  }

  getOptions() {
    let options = [];
    for (let i = 0; i < LOCATIONS.length; i++) {
      let loc = LOCATIONS[i];
      options.push(<option key={i} value={i} disabled={loc.disabled}>{loc.name}</option>);
    }
    return options;
  }

  getSelectedCity() {
    for (let i = 0; i < LOCATIONS.length; i++) {
      if (this.props.lat === LOCATIONS[i].lat && this.props.long === LOCATIONS[i].long) {
        return i;
      }
    }
    return 0; // custom location
  }

  render() {
    return (
      <select className='form-control' value={this.getSelectedCity()} onChange={this.selectChange.bind(this)}>
        {this.getOptions()}
      </select>
    );
  }
}
