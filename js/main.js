import $ from 'jquery';
import 'jquery-ui/slider';

import ViewsManager from './views-manager.js';
import CITY_DATA from './city-data.js';

let DEF_STATE = {
  day: 171,
  earthTilt: true,
  earthRotation: false,
  lat: 0,
  long: 0
};

class SeasonsApp {
  constructor(state = DEF_STATE) {
    this.view = new ViewsManager(state);
    this._initUI();

    this.state = {};
    this.setState(state);

    this.view.earthView.on('latitude.change', (newLat) => {
      this.setState({lat: newLat});
    });
    this.view.earthView.on('longitude.change', (newLong) => {
      this.setState({long: newLong});
    });
  }

  setState(newState) {
    this.state = $.extend(this.state, newState);
    this.view.setProps(newState);
    this._updateUI();
  }

  selectCity(index) {
    this.ui.$citySelect.val(0).trigger('change');
  }

  _initUI() {
    this.ui = {
      $daySlider: $('#day-slider'),
      $earthRotation: $('#earth-rotation'),
      $earthTilt: $('#earth-tilt'),
      $citySelect: $('#city-pulldown'),
      $latSlider: $('#latitude-slider'),
      $longSlider: $('#longitude-slider')
    };
    this._initDaySlider();
    this._initRotationCheckbox();
    this._initEarthTiltCheckbox();
    this._initCitySelect();
    this._initLatLongSliders();
  }

  _initDaySlider() {
    this.ui.$daySlider.slider({
      min: 0,
      max: 364,
      step: 1
    }).on('slide', (e, ui) => {
      this.setState({day: ui.value});
    });
  }

  _initRotationCheckbox() {
    this.ui.$earthRotation.on('change', (e) => {
      this.setState({earthRotation: e.target.checked});
    });
  }

  _initEarthTiltCheckbox() {
    this.ui.$earthTilt.on('change', (e) => {
      this.setState({earthTilt: e.target.checked});
    });
  }

  _initCitySelect() {
    for(let i = 0; i < CITY_DATA.length; i++) {
      this.ui.$citySelect.append(`<option value=${i}>${CITY_DATA[i].name}</option>`);
    }
    this.ui.$citySelect.on('change', () => {
      let city = this._getSelectedCity();
      if (city) {
        this.setState({lat: city.lat, long: city.long});
      }
    });
  }

  _initLatLongSliders() {
    this.ui.$latSlider.slider({
      min: -90,
      max: 90,
      step: 1
    }).on('slide', (e, ui) => {
      this.setState({lat: ui.value});
    });

    this.ui.$longSlider.slider({
      min: -180,
      max: 180,
      step: 1
    }).on('slide', (e, ui) => {
      this.setState({long: ui.value});
    });
  }

  _updateUI() {
    this.ui.$daySlider.slider('value', this.state.day);
    this.ui.$earthRotation.prop('checked', this.state.earthRotation);
    this.ui.$earthTilt.prop('checked', this.state.earthTilt);
    this.ui.$latSlider.slider('value', this.state.lat);
    this.ui.$longSlider.slider('value', this.state.long);
    // Unselect city if longitude or latitude has been changed manually.
    let city = this._getSelectedCity();
    if (city && (this.state.lat !== city.lat || this.state.long !== city.long)) {
      this.ui.$citySelect.val('');
    }
  }

  _getSelectedCity() {
    return CITY_DATA[this.ui.$citySelect.val()];
  }
}

window.seasons = new SeasonsApp();
// Select the first city.
window.seasons.selectCity(0);
