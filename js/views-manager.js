import EarthView from './earth-view.js';
import OrbitView from './orbit-view.js';
import RaysView from './rays-view.js';

export default class {
  constructor(props) {
    this.earthView = new EarthView(document.getElementById('earth-view'), props);
    this.orbitView = new OrbitView(document.getElementById('orbit-view'), props);
    this.raysView = new RaysView(document.getElementById('rays-view'), props);

    this.views = [this.earthView, this.orbitView, this.raysView];

    this._syncCameraAndViewAxis();
    this._startAnimation();
  }

  setProps(props) {
    for (let view of this.views) {
      view.setProps(props);
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