import $ from 'jquery';
import EventEmitter from 'eventemitter2';

import BaseView from './base-view.js';
import models from './models/common-models.js';
import LatitudeLine from './models/latitude-line.js';
import LatLongMarker from './models/lat-long-marker.js';
import * as data from './solar-system-data.js';
import {mousePosNormalized} from './utils.js';

const DEG_2_RAD = Math.PI / 180;
const RAD_2_DEG = 180 / Math.PI;

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  sunEarthLine: true,
  earthRotation: false,
  lat: 0,
  long: 0
};

export default class extends BaseView {
  constructor(parentEl, props = DEF_PROPERTIES) {
    super(parentEl, props, 'earth-view');

    // Rotate earth a bit so USA is visible.
    this.rotateEarth(2);

    // Support mouse interaction.
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1, -1);
    this._enableMousePicking();

    // Emit events when camera is changed.
    this.dispatch = new EventEmitter();
    this.controls.addEventListener('change', () => {
      this.dispatch.emit('camera.change');
    });
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  // Normalized vector pointing from camera to earth.
  getCameraEarthVec() {
    return this.camera.position.clone().sub(this.getEarthPosition()).normalize();
  }

  render(timestamp) {
    this._animate(timestamp);
    this._interactivityHandler();
    this.controls.update();
    super.render(timestamp);
  }

  _updateDay() {
    let oldPos = this.getEarthPosition().clone();
    super._updateDay();
    let newPos = this.getEarthPosition().clone();

    let angleDiff = Math.atan2(oldPos.z, oldPos.x) - Math.atan2(newPos.z, newPos.x);
    // Make sure that earth maintains its current rotation.
    this.rotateEarth(angleDiff);

    // Update camera position, rotate it and adjust its orbit length.
    this.rotateCam(angleDiff);
    let lenRatio = newPos.length() / oldPos.length();
    this.camera.position.x *= lenRatio;
    this.camera.position.z *= lenRatio;
    // Set orbit controls target to new position too.
    this.controls.target.copy(newPos);
    // Make sure that this call is at the very end, as otherwise 'camera.change' event can be fired before
    // earth position is updated. This causes problems when client code tries to call .getCameraEarthVec()
    // in handler (as earth position is still outdated).
    this.controls.update();
  }

  _updateLat() {
    this.latLine.setLat(this.props.lat);
    this.latLongMarker.setLatLong(this.props.lat, this.props.long)
  }

  _updateLong() {
    this.latLongMarker.setLatLong(this.props.lat, this.props.long)
  }

  _initScene() {
    super._initScene();
    this.latLine = new LatitudeLine();
    this.latLongMarker = new LatLongMarker();
    this.earth.add(this.latLine.rootObject);
    this.earth.add(this.latLongMarker.rootObject);
  }

  // Sets camera next to earth at day 0 position.
  _setInitialCamPos() {
    this.camera.position.x = -129000000 / data.SCALE_FACTOR;
    this.camera.position.y = 5000000 / data.SCALE_FACTOR;
    this.camera.position.z = 25000000 / data.SCALE_FACTOR;
  }

  _animate(timestamp) {
    if (!this.props.earthRotation) {
      this._prevFrame = null;
      return;
    }
    let progress = this._prevFrame ? timestamp - this._prevFrame : 0;
    let angleDiff = progress * 0.0001 * Math.PI;
    this.rotateEarth(angleDiff);
    this._prevFrame = timestamp;
  }

  _enableMousePicking() {
    let onMouseMove = (event) => {
      let pos = mousePosNormalized(event, this.renderer.domElement);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    };
    $(this.renderer.domElement).on('mousemove touchmove', onMouseMove);
  }

  _interactivityHandler() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this._isLatDragging) {
      let coords = this._getPointerLatLong();
      if (coords != null) {
        // coords can be equal to null if user isn't pointing earth anymore.
        this.setProps({lat: coords.lat});
        this.dispatch.emit('latitude.change', coords.lat);
      }
      return;
    } else if (this._isLatLongDragging) {
      let coords = this._getPointerLatLong();
      if (coords != null) {
        // coords can be equal to null if user isn't pointing earth anymore.
        this.setProps({lat: coords.lat, long: coords.long});
        this.dispatch.emit('latitude.change', coords.lat);
        this.dispatch.emit('longitude.change', coords.long);
      }
      return;
    }

    // Note that order of calls below is very important. First, we need to disable old interaction
    // and then enable new one (as they're both modifying camera controls).
    if (this._isUserPointing(this.latLongMarker.mesh)) {
      this._setLatDraggingEnabled(false);
      this._setLatLongDraggingEnabled(true);
    } else if (this._isUserPointing(this.latLine.mesh)) {
      this._setLatLongDraggingEnabled(false);
      this._setLatDraggingEnabled(true);
    } else {
      this._setLatLongDraggingEnabled(false);
      this._setLatDraggingEnabled(false);
    }
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

  _setLatDraggingEnabled(v) {
    if (this._isLatDraggingEnabled === v) return; // exit, nothing has changed
    this._isLatDraggingEnabled = v;
    this.latLongMarker.setHighlighted(v);
    this.latLine.setHighlighted(v);
    this.controls.noRotate = v;
    let $elem = $(this.renderer.domElement);
    if (v) {
      let $elem = $(this.renderer.domElement);
      $elem.on('mousedown.latDragging touchstart.latDragging', () => {
        this._isLatDragging = true;
      });
      $elem.on('mouseup.latDragging touchend.latDragging touchcancel.latDragging', () => {
        this._isLatDragging = false;
      });
    } else {
      $elem.off('.latDragging');
    }
  }

  _setLatLongDraggingEnabled(v) {
    if (this._isLatLongDraggingEnabled === v) return; // exit, nothing has changed
    this._isLatLongDraggingEnabled = v;
    this.latLongMarker.setHighlighted(v);
    this.controls.noRotate = v;
    let $elem = $(this.renderer.domElement);
    if (v) {
      $elem.on('mousedown.latLongDragging touchstart.latLongDragging', () => {
        this._isLatLongDragging = true;
      });
      $elem.on('mouseup.latLongDragging touchend.latLongDragging touchcancel.latLongDragging', () => {
        this._isLatLongDragging = false;
      });
    } else {
      $elem.off('.latLongDragging');
    }
  }

  // Returns longitude and latitude pointed by cursor or null if pointer doesn't intersect with earth model.
  _getPointerLatLong() {
    let intersects = this._isUserPointing(this.earth);
    if (!intersects) {
      // Pointer does not intersect with earth, return null.
      return null;
    }
    // Calculate vector pointing from Earth center to intersection point.
    let intVec = intersects[0].point;
    intVec.sub(this.getEarthPosition());
    // Take into account earth tilt and rotation.
    intVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.getEarthTilt());
    intVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), -this.getEarthRotation());

    // Latitude calculations.
    let xzVec = new THREE.Vector3(intVec.x, 0, intVec.z);
    let lat = intVec.angleTo(xzVec) * RAD_2_DEG;
    // .angleTo returns always positive number.
    if (intVec.y < 0) lat *= -1;
    // Longitude calculations.
    let xVec = new THREE.Vector3(1, 0, 0);
    let long = xVec.angleTo(xzVec) * RAD_2_DEG;
    if (intVec.z > 0) long *= -1;
    return {lat: lat, long: long};
  }
}
