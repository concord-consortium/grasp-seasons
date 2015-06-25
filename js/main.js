import $ from 'jquery';
import 'jquery-ui/slider';

import ViewsManager from './views-manager.js';
import CITY_DATA from './city-data.js';

let state = {
  day: 0,
  earthTilt: true,
  earthRotation: false,
  lat: 0,
  long: 0
};
let view = new ViewsManager(state);

view.earthView.on('latitude.change', function (newLat) {
  setState({lat: newLat});
});
view.earthView.on('longitude.change', function (newLong) {
  setState({long: newLong});
});

let ui = {
  $daySlider: $('#day-slider'),
  $earthRotation: $('#earth-rotation'),
  $earthTilt: $('#earth-tilt'),
  $citySelect: $('#city-pulldown'),
  $latSlider: $('#latitude-slider'),
  $longSlider: $('#longitude-slider')
};

function setState(newState) {
  state = $.extend(state, newState);
  view.setProps(newState);
  updateUI();
}

function updateUI() {
  ui.$daySlider.slider('value', state.day);
  ui.$earthRotation.prop('checked', state.earthRotation);
  ui.$earthTilt.prop('checked', state.earthTilt);
  ui.$latSlider.slider('value', state.lat);
  ui.$longSlider.slider('value', state.long);
  // Unselect city if longitude or latitude has been changed manually.
  let city = getSelectedCity();
  if (city && (state.lat !== city.lat || state.long !== city.long)) {
    ui.$citySelect.val('');
  }
}

function getSelectedCity() {
  return CITY_DATA[ui.$citySelect.val()];
}

ui.$daySlider.slider({
  min: 0,
  max: 364,
  step: 1
}).on('slide', function (e, ui) {
  setState({day: ui.value});
});

ui.$earthRotation.on('change', function() {
  setState({earthRotation: this.checked});
});

ui.$earthTilt.on('change', function() {
  setState({earthTilt: this.checked});
});

for(let i = 0; i < CITY_DATA.length; i++) {
  ui.$citySelect.append(`<option value=${i}>${CITY_DATA[i].name}</option>`);
}
ui.$citySelect.on('change', function() {
  let city = getSelectedCity();
  if (city) {
    setState({lat: city.lat, long: city.long});
  }
});

ui.$latSlider.slider({
  min: -90,
  max: 90,
  step: 1
}).on('slide', function (e, ui) {
  setState({lat: ui.value});
});

ui.$longSlider.slider({
  min: -180,
  max: 180,
  step: 1
}).on('slide', function (e, ui) {
  setState({long: ui.value});
});

// Select the first city on page load.
ui.$citySelect.trigger('change');
// Export view manager to global namespace (so it's possible to use browser console to play with it).
window.view = view;