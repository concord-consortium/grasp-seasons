import $ from 'jquery';
window.$ = $;
import EarthView from './earth-view.js';
import OrbitView from './orbit-view.js';
import RaysView from './rays-view.js';

const VIEW_CLASS = 'view';
const EARTH_VIEW_ID = 'earth-view';
const ORBIT_VIEW_ID = 'orbit-view';
const RAYS_VIEW_ID = 'rays-view';

const MAIN_CLASS = 'main';
const SMALL_TOP_CLASS = 'small-top';
const SMALL_BOTTOM_CLASS = 'small-bottom';

export default class {
  constructor(props) {
    this.earthView = new EarthView($(`#${EARTH_VIEW_ID}`)[0], props);
    this.orbitView = new OrbitView($(`#${ORBIT_VIEW_ID}`)[0], props);
    this.raysView = new RaysView($(`#${RAYS_VIEW_ID}`)[0], props);

    this.views = [this.earthView, this.orbitView, this.raysView];

    this._syncCameraAndViewAxis();
    this._startAnimation();
  }

  setProps(props) {
    for (let view of this.views) {
      view.setProps(props);
    }
  }

  selectMainView(view) {
    $(`.${VIEW_CLASS}`).removeClass(`${MAIN_CLASS} ${SMALL_TOP_CLASS} ${SMALL_BOTTOM_CLASS}`);
    let $earthView = $(`#${EARTH_VIEW_ID}`);
    let $orbitView = $(`#${ORBIT_VIEW_ID}`);
    let $raysView = $(`#${RAYS_VIEW_ID}`);
    switch(view) {
      case EARTH_VIEW_ID:
        $earthView.addClass(MAIN_CLASS);
        $orbitView.addClass(SMALL_TOP_CLASS);
        $raysView.addClass(SMALL_BOTTOM_CLASS);
        break;
      case ORBIT_VIEW_ID:
        $earthView.addClass(SMALL_TOP_CLASS);
        $orbitView.addClass(MAIN_CLASS);
        $raysView.addClass(SMALL_BOTTOM_CLASS);
        break;
      case RAYS_VIEW_ID:
        $earthView.addClass(SMALL_TOP_CLASS);
        $orbitView.addClass(SMALL_BOTTOM_CLASS);
        $raysView.addClass(MAIN_CLASS);
        break;
    }
    for (let view of this.views) {
      view.resize && view.resize();
    }
  }

  // When earth view camera is changed, we need to update view axis in the orbit view.
  _syncCameraAndViewAxis() {
    let sync = () => {
      let camVec = this.earthView.getCameraEarthVec();
      this.orbitView.setViewAxis(camVec);
    };
    // Initial sync.
    sync();
    // When earth view camera is changed, we need to update view axis in the orbit view.
    this.earthView.on('camera.change', sync);
  }

  _startAnimation() {
    let anim = (timestamp) => {
      for (let view of this.views) {
        view.render && view.render(timestamp);
      }
      requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }
}