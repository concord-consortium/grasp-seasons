import $ from 'jquery';

import ViewsManager from './views-manager.js';
import CITY_DATA from './city-data.js';
import './ui/grasp-slider.js';
import '../css/main.css';
import '../css/jquery-ui-theme.css';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
                     "August", "September", "October", "November", "December"];
const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                           "Aug", "Sep", "Oct", "Nov", "Dec"];

const DEF_STATE = {
  day: 171,
  earthTilt: true,
  earthRotation: false,
  sunEarthLine: true,
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

  getSelectedCity() {
    return CITY_DATA[this.ui.$citySelect.val()];
  }

  getFormattedDay() {
    // Initialize a date in `2015-01-01` (it's not a leap year).
    let date = new Date(2015, 0);
    // Add the number of days.
    date.setDate(this.state.day + 1);
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
  }

  getFormattedLat() {
    let dir = '';
    if (this.state.lat > 0) {
      dir = 'N';
    } else  if (this.state.lat < 0) {
      dir = 'S';
    }
    let lat = Math.abs(this.state.lat).toFixed(2);
    return `${lat}&deg;${dir}`;
  }

  getFormattedLong() {
    let dir = '';
    if (this.state.long > 0) {
      dir = 'E';
    } else if (this.state.long < 0) {
      dir = 'W';
    }
    let long = Math.abs(this.state.long).toFixed(2);
    return `${long}&deg;${dir}`;
  }

  _initUI() {
    this.ui = {
      $daySlider: $('#day-slider'),
      $dayValue: $('#day-value'),
      $earthRotation: $('#earth-rotation'),
      $earthTilt: $('#earth-tilt'),
      $sunEarthLine: $('#sun-earth-line'),
      $citySelect: $('#city-pulldown'),
      $latSlider: $('#latitude-slider'),
      $latValue: $('#lat-value'),
      $longSlider: $('#longitude-slider'),
      $longValue: $('#long-value')
    };
    this._initDaySlider();
    this._initRotationCheckbox();
    this._initEarthTiltCheckbox();
    this._initSunEarthLineCheckbox();
    this._initCitySelect();
    this._initLatLongSliders();
  }

  _initDaySlider() {
    this.ui.$daySlider.graspSlider({
      min: 0,
      max: 364,
      step: 1,
      slide: (e, ui) => {
        this.setState({day: ui.value});
      }
    });
    // Generate month ticks.
    let ticks = [];
    for (let m = 0; m < 12; m++) {
      ticks.push({value: m * 30.4, name: MONTH_NAMES_SHORT[m]});
    }
    this.ui.$daySlider.graspSlider('option', 'ticks', ticks);
    // Shift tick labels so they are in the middle of the month section on the slider.
    let monthWidth = this.ui.$daySlider.width() / 12;
    this.ui.$daySlider.find('.ui-slider-tick-label').each(function () {
      let $label = $(this);
      let labelWidth = $label.width();
      $label.css('margin-left', -labelWidth * 0.5 + monthWidth * 0.5);
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

  _initSunEarthLineCheckbox() {
    this.ui.$sunEarthLine.on('change', (e) => {
      this.setState({sunEarthLine: e.target.checked});
    });
  }

  _initCitySelect() {
    for (let i = 0; i < CITY_DATA.length; i++) {
      this.ui.$citySelect.append(`<option value=${i}>${CITY_DATA[i].name}</option>`);
    }
    this.ui.$citySelect.on('change', () => {
      let city = this.getSelectedCity();
      if (city) {
        this.setState({lat: city.lat, long: city.long});
      }
    });
  }

  _initLatLongSliders() {
    this.ui.$latSlider.slider({
      min: -90,
      max: 90,
      step: 1,
      slide: (e, ui) => {
        this.setState({lat: ui.value});
      }
    });

    this.ui.$longSlider.slider({
      min: -180,
      max: 180,
      step: 1,
      slide: (e, ui) => {
        this.setState({long: ui.value});
      }
    });
  }

  _updateUI() {
    this.ui.$daySlider.graspSlider('value', this.state.day);
    this.ui.$dayValue.html(this.getFormattedDay());
    this.ui.$earthRotation.prop('checked', this.state.earthRotation);
    this.ui.$earthTilt.prop('checked', this.state.earthTilt);
    this.ui.$sunEarthLine.prop('checked', this.state.sunEarthLine);
    this.ui.$latSlider.slider('value', this.state.lat);
    this.ui.$latValue.html(this.getFormattedLat());
    this.ui.$longSlider.slider('value', this.state.long);
    this.ui.$longValue.html(this.getFormattedLong());
    // Unselect city if longitude or latitude has been changed manually.
    let city = this.getSelectedCity();
    if (city && (this.state.lat !== city.lat || this.state.long !== city.long)) {
      this.ui.$citySelect.val('');
    }
  }
}

window.seasons = new SeasonsApp();
// Select the first city.
window.seasons.selectCity(0);
