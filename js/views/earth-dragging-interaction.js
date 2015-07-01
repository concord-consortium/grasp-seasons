import $ from 'jquery';
import {mousePosNormalized} from '../utils.js';
import {earthEllipseLocationByDay} from '../solar-system-data.js';

export default class {
  constructor(view) {
    this.view = view;
    this.domElement = view.renderer.domElement;
    this.camera = view.camera;
    this.earth = view.earth;
    this.controls = view.controls;
    this.dispatch = view.dispatch;

    let day0Pos = earthEllipseLocationByDay(0); // reference for further calculations
    this._atan2Day0Pos = Math.atan2(day0Pos.z, day0Pos.x);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-2, -2); // intentionally out of view, which is limited to [-1, 1] x [-1, 1]
    this._followMousePosition();
  }

  checkInteraction() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this._isEarthDragging) {
      let coords = this._getXZPlanPos();
      let angleDiff = this._atan2Day0Pos - Math.atan2(coords.z, coords.x);
      let newDay = angleDiff / (Math.PI * 2) * 364;
      if (newDay < 0) newDay += 364;
      this.dispatch.emit('day.change', newDay);
      return;
    }

    // Note that order of calls below is very important. First, we need to disable old interaction
    // and then enable new one (as they're both modifying camera controls).
    if (this._isUserPointing(this.earth.earthObject)) {
      this._setEarthDraggingEnabled(true);
    } else {
      this._setEarthDraggingEnabled(false);
    }
  }

  _setEarthDraggingEnabled(v) {
    if (this._isEarthDraggingEnabled === v) return; // exit, nothing has changed
    this._isEarthDraggingEnabled = v;
    this.earth.setHighlighted(v);
    document.body.style.cursor = v ? 'move' : '';
    this.controls.noRotate = v;
    let $elem = $(this.domElement);
    if (v) {
      $elem.on('mousedown.earthDragging touchstart.earthDragging', () => {
        this._isEarthDragging = true;
      });
      $elem.on('mouseup.earthDragging touchend.earthDragging touchcancel.earthDragging', () => {
        this._isEarthDragging = false;
      });
    } else {
      $elem.off('.earthDragging');
    }
  }

  _followMousePosition() {
    let onMouseMove = (event) => {
      let pos = mousePosNormalized(event, this.domElement);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    };
    $(this.domElement).on('mousemove touchmove', onMouseMove);
  }

  _isUserPointing(mesh) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      return intersects;
    } else {
      return false;
    }
  }

  // Projects mouse position on XZ plane.
  _getXZPlanPos() {
    let v = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    v.unproject(this.camera);
    v.sub(this.camera.position);
    v.normalize();
    let distance = -this.camera.position.y / v.y;
    v.multiplyScalar(distance);
    let result = this.camera.position.clone();
    result.add(v);
    return result;
  }
}
