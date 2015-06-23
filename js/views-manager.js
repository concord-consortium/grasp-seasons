import EarthView from './earth-view.js';
import OrbitView from './orbit-view.js';

export default class {
  constructor(props) {
    this.earthView = new EarthView(document.getElementById('earth-view'), props);
    this.orbitView = new OrbitView(document.getElementById('orbit-view'), props);

    // Export views to global namespace, so we can play with them using console.
    window.earthView = this.earthView;
    window.orbitView = this.orbitView;

    this._syncCameraAndViewAxis();
    this._startAnimation();
  }

  setProps(props) {
    this.earthView.setProps(props);
    this.orbitView.setProps(props);
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
      this.earthView.render(timestamp);
      this.orbitView.render(timestamp);
      requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }
}