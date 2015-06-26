import $ from 'jquery';
import EventEmitter from 'eventemitter2';

import models from './models/models.js';
import LatitudeLine from './models/latitude-line.js';
import LatLongMarker from './models/lat-long-marker.js';
import * as data from './solar-system-data.js';
import {mousePosNormalized} from './utils.js';

const DEG_2_RAD = Math.PI / 180;
const RAD_2_DEG = 180 / Math.PI;

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  earthRotation: false,
  lat: 0,
  long: 0
};

export default class {
  constructor(canvasEl, props = DEF_PROPERTIES) {
    let width = canvasEl.clientWidth;
    let height = canvasEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.EARTH_ORBITAL_RADIUS * 10);
    this.renderer = new THREE.WebGLRenderer({canvas: canvasEl, antialias: true});
    this.renderer.setSize(width, height);

    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
    this.controls.noPan = true;
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 0.5;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1, -1);
    this._enableMousePicking();

    this.dispatch = new EventEmitter();

    this.controls.addEventListener('change', () => {
      this.dispatch.emit('camera.change');
    });

    this._initScene();
    this._setInitialCamPos();
    // Rotate earth a bit so USA is visible.
    this._rotateEarth(2);

    this.props = {};
    this.setProps(props);

    this.render();
  }

  // Normalized vector pointing from camera to earth.
  getCameraEarthVec() {
    return this.camera.position.clone().sub(this.earthPos.position).normalize();
  }

  getEarthTilt() {
    return this.earthTiltPivot.rotation.z;
  }

  getEarthRotation() {
    return this.earth.rotation.y;
  }

  setProps(newProps) {
    let oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);

    if (this.props.day !== oldProps.day) this._updateDay();
    if (this.props.earthTilt !== oldProps.earthTilt) this._updateEarthTilt();
    if (this.props.lat !== oldProps.lat || this.props.long !== oldProps.long) this._updateLatLong();
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  render(timestamp) {
    this._animate(timestamp);
    this._interactivityHandler();
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  _updateDay() {
    let day = this.props.day;
    let pos = data.earthEllipseLocationByDay(day);

    let angle = Math.atan2(this.earthPos.position.z, this.earthPos.position.x) - Math.atan2(pos.z, pos.x);
    // Make sure that earth maintains its rotation.
    this._rotateEarth(angle);
    // Update camera position, rotate it and adjust its orbit length.
    this._rotateCam(angle);
    let oldOrbitLength = new THREE.Vector2(this.earthPos.position.x, this.earthPos.position.z).length();
    let newOrbitLength = new THREE.Vector2(pos.x, pos.z).length();
    this.camera.position.x *= newOrbitLength / oldOrbitLength;
    this.camera.position.z *= newOrbitLength / oldOrbitLength;

    // Set orbit controls target to new position too.
    this.controls.target.copy(pos);
    this.controls.update();

    this.earthPos.position.copy(pos);
  }

  _updateEarthTilt() {
    this.earthTiltPivot.rotation.z = this.props.earthTilt ? data.EARTH_TILT : 0;
  }

  _updateLatLong() {
    this.latLine.setLat(this.props.lat);
    this.latLongMarker.setLatLong(this.props.lat, this.props.long)
  }

  // Rotates earth around its own axis.
  _rotateEarth(angleDiff) {
    this.earth.rotation.y += angleDiff;
  }

  // Rotates camera around the sun.
  _rotateCam(angle) {
    let p = this.camera.position;
    let newZ = p.z * Math.cos(angle) - p.x * Math.sin(angle);
    let newX = p.z * Math.sin(angle) + p.x * Math.cos(angle);
    this.camera.position.x = newX;
    this.camera.position.z = newZ;
  }

  _initScene() {
    this.scene.add(models.stars());
    this.scene.add(models.ambientLight());
    this.scene.add(models.sunLight());
    this.scene.add(models.sunOnlyLight());
    this.scene.add(models.orbit());
    this.scene.add(models.sun());

    this.earth = models.earth();
    this.earthAxis = models.earthAxis();
    this.latLine = new LatitudeLine();
    this.latLongMarker = new LatLongMarker();
    this.earth.add(this.earthAxis);
    this.earth.add(this.latLine.rootObject);
    this.earth.add(this.latLongMarker.rootObject);

    this.earthTiltPivot = new THREE.Object3D();
    this.earthTiltPivot.add(this.earth);
    this.earthPos = new THREE.Object3D();
    this.earthPos.add(models.grid({size: data.EARTH_ORBITAL_RADIUS / 8, steps: 15}));
    this.earthPos.add(this.earthTiltPivot);
    let pos = data.earthEllipseLocationByDay(0);
    this.earthPos.position.copy(pos);
    this.scene.add(this.earthPos);
  }

  // Sets camera next to earth at day 0 position.
  _setInitialCamPos() {
    this.camera.position.x = -130000000 / data.SCALE_FACTOR;
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
    this.earth.rotation.y += angleDiff;
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
    intVec.sub(this.earthPos.position);
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
