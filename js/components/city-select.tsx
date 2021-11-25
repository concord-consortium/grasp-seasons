// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import CITY_DATA from '../city-data.js';
import t from '../translate.js';

import '../../css/city-select.less';

export default class CitySelect extends React.Component {
  props: any;
  setState: any;
  state: any;
  constructor(props: any) {
    super(props);
    this.state = {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      locations: [{name: t("~CUSTOM_LOCATION", props.lang), disabled: true}].concat(CITY_DATA),
      customLocationsCount: 0,
      customLocName: t("~CUSTOM_LOCATION_NAME", props.lang)
    };

    this.selectChange = this.selectChange.bind(this);
    this.handleCustomLocNameChange = this.handleCustomLocNameChange.bind(this);
    this.saveCustomLocation = this.saveCustomLocation.bind(this);
  }

  selectChange(event: any) {
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
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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

  handleCustomLocNameChange(event: any) {
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
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className='city-select'>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <label>{t("~SELECT_CITY", this.props.lang)}</label>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <select className='form-control' value={this.selectedCity} onChange={this.selectChange}>
          {this.getOptions()}
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </select>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className={`custom-location ${this.isLocationCustom ? 'visible' : ''}`}>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <input type='text' value={customLocName} onChange={this.handleCustomLocNameChange}/>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <button className='btn btn-small' onClick={this.saveCustomLocation}>Save Location</button>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </span>
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    );
  }
}
