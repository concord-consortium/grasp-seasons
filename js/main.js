import ViewsManager from './views-manager.js';

let state = {
  day: 0,
  earthTilt: true,
  earthRotation: false,
  lat: 0,
  long: 0
};
let view = new ViewsManager(state);
let ui = {
  $daySlider: $('#day-slider'),
  $earthRotation: $('#earth-rotation'),
  $earthTilt: $('#earth-tilt'),
  $latSlider: $('#latitude-slider')
};

function setState(newState) {
  state = $.extend(state, newState);
  view.setProps(state);
}

function updateUI() {
  ui.$daySlider.slider('value', state.day);
  ui.$earthRotation.prop('checked', state.earthRotation);
  ui.$earthTilt.prop('checked', state.earthTilt);
  ui.$latSlider.slider('value', state.lat);
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

ui.$latSlider.slider({
  min: -90,
  max: 90,
  step: 1
}).on('slide', function (e, ui) {
  setState({lat: ui.value});
});

updateUI();
