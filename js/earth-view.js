import EventEmitter from 'eventemitter2';

import models from './models/models.js';
import LatitudeLine from './models/latitude-line.js';
import LatLongMarker from './models/lat-long-marker.js';
import * as data from './data.js';

const DEG_2_RAD = Math.PI / 180;

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  earthRotation: false,
  lat: 0,
  long: 0
};

export default class {
  constructor(canvasEl, props = DEF_PROPERTIES) {
    var width = canvasEl.clientWidth;
    var height = canvasEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.earthOrbitalRadius * 10);
    this.renderer = new THREE.WebGLRenderer({canvas: canvasEl, antialias: true});
    this.renderer.setSize(width, height);

    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
    this.controls.noPan = true;
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 0.5;

    this.dispatch = new EventEmitter();

    this.controls.addEventListener('change', () => {
      this.dispatch.emit('camera.change');
    });

    this._initScene();
    this._setInitialCamPos();

    this.props = {};
    this.setProps(props);

    this.render();
  }

  // Normalized vector pointing from camera to earth.
  getCameraEarthVec() {
    return this.camera.position.clone().sub(this.earthPos.position).normalize();
  }

  setProps(newProps) {
    var oldProps = $.extend(this.props);
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
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  _updateDay() {
    var day = this.props.day;
    var pos = data.earthEllipseLocationByDay(day);

    if (this._prevDay != null) {
      var angle = Math.atan2(this.earthPos.position.z, this.earthPos.position.x) - Math.atan2(pos.z, pos.x);
      // Make sure that earth maintains its rotation.
      this.earth.rotateY(angle);
      // Update camera position, rotate it and adjust its orbit length.
      this._rotateCam(angle);
      var oldOrbitLength = new THREE.Vector2(this.earthPos.position.x, this.earthPos.position.z).length();
      var newOrbitLength = new THREE.Vector2(pos.x, pos.z).length();
      this.camera.position.x *= newOrbitLength / oldOrbitLength;
      this.camera.position.z *= newOrbitLength / oldOrbitLength;
    }

    this.earthPos.position.x = pos.x;
    this.earthPos.position.z = pos.z;

    // Set camera target to new position too.
    this.controls.target.x = pos.x;
    this.controls.target.z = pos.z;
    this.controls.update();

    this._prevDay = day;
  }

  _updateEarthTilt() {
    this.earthRot.rotation.z = this.props.earthTilt ? 0.41 : 0; // 0.41 rad = 23.5 deg
  }

  _updateLatLong() {
    this.latLine.setLat(this.props.lat);
    this.latLongMarker.setLatLong(this.props.lat, this.props.long)
  }

  _rotateCam(angle) {
    var p = this.camera.position;
    var newZ = p.z * Math.cos(angle) - p.x * Math.sin(angle);
    var newX = p.z * Math.sin(angle) + p.x * Math.cos(angle);
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
    this.earth.add(this.latLine.mesh);
    this.earth.add(this.latLongMarker.mesh);

    this.earthRot = new THREE.Object3D();
    this.earthRot.add(this.earth);
    this.earthPos = new THREE.Object3D();
    this.earthPos.add(models.grid({size: data.earthOrbitalRadius / 8, steps: 15}));
    this.earthPos.add(this.earthRot);
    this.scene.add(this.earthPos);
  }

  _setInitialCamPos() {
    this.camera.position.x = -128207750 / data.scaleFactor;
    this.camera.position.y = 5928580 / data.scaleFactor;
    this.camera.position.z = 24799310 / data.scaleFactor;
  }

  _animate(timestamp) {
    if (!this.props.earthRotation) {
      this._prevFrame = null;
      return;
    }
    let progress = this._prevFrame ? timestamp - this._prevFrame : 0;
    let angleDiff = progress * 0.0001 * Math.PI;
    this.earth.rotateY(angleDiff);
    this._prevFrame = timestamp;
  }
}
