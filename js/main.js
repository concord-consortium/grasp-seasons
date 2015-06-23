import EarthView from './earth-view.js';
import OrbitView from './orbit-view.js';

var earthView = new EarthView(document.getElementById('earth-view'));
var orbitView = new OrbitView(document.getElementById('orbit-view'));

earthView.onCameraChange = function(camVec) {
  orbitView.setViewAxis(camVec);
};

function anim() {
  requestAnimationFrame(anim);
  earthView.render();
  orbitView.render();
}
anim();

$('#day-slider').slider({
  min: 0,
  max: 364,
  step: 1
}).on('slide', function (e, ui) {
  earthView.setDay(ui.value);
  orbitView.setDay(ui.value);
});

