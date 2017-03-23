import React from 'react';
import CITY_DATA from '../city-data.js';

import '../../css/city-select.less';

export default class CitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [{name: 'Custom Location (unsaved)', disabled: true}].concat(CITY_DATA),
      customLocationsCount: 0,
      customLocName: 'Custom Location 1'
    };

    this.selectChange = this.selectChange.bind(this);
    this.handleCustomLocNameChange = this.handleCustomLocNameChange.bind(this);
    this.saveCustomLocation = this.saveCustomLocation.bind(this);
  }

  selectChange(event) {
    const { onCityChange } = this.props;
    const { locations } = this.state;
    let city = locations[event.target.value];
    onCityChange(city.lat, city.long, city.name);
  }

  getOptions() {
    const { locations } = this.state;
    let options = [];
    for (let i = 0; i < locations.length; i++) {
      let loc = locations[i];
      options.push(<option key={i} value={i} disabled={loc.disabled}>{loc.name}</option>);
    }
    return options;
  }

  get selectedCity() {
    const { lat, long } = this.props;
    const { locations } = this.state;
    for (let i = 0; i < locations.length; i++) {
      if (lat === locations[i].lat && long === locations[i].long) {
        return i;
      }
    }
    return 0; // custom location
  }

  get isLocationCustom() {
    return this.selectedCity === 0;
  }

  handleCustomLocNameChange(event) {
    this.setState({customLocName: event.target.value});
  }

  saveCustomLocation() {
    const { lat, long } = this.props;
    const { customLocName, customLocationsCount, locations } = this.state;
    const newLocations = locations.concat({name: customLocName, lat, long});
    this.setState({
      customLocationsCount: customLocationsCount + 1,
      customLocName: `Custom Location ${customLocationsCount + 2}`,
      locations: newLocations
    });
  }

  render() {
    const { customLocName } = this.state;
    return (
      <div className='city-select'>
        <label>Select city:</label>
        <select className='form-control' value={this.selectedCity} onChange={this.selectChange}>
          {this.getOptions()}
        </select>
        <span className={`custom-location ${this.isLocationCustom ? 'visible' : ''}`}>
          <input type='text' value={customLocName} onChange={this.handleCustomLocNameChange}/>
          <button className='btn btn-small' onClick={this.saveCustomLocation}>Save Location</button>
        </span>
      </div>
    );
  }
}
