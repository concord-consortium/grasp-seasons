import $ from 'jquery';
import models from './models/common-models.js';
import SunEarthLine from './models/sun-earth-line.js';
import * as data from './solar-system-data.js';

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true
};

export default class {
  constructor(canvasEl, props = DEF_PROPERTIES, modelType) {
    let width = canvasEl.clientWidth;
    let height = canvasEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.EARTH_ORBITAL_RADIUS * 100);
    this.renderer = new THREE.WebGLRenderer({canvas: canvasEl, antialias: true});
    this.renderer.setSize(width, height);

    // Type is passed to 3D models.
    this.type = modelType;
    this._initScene();
    this._setInitialCamPos();

    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
    this.controls.noPan = true;
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 0.5;

    this.props = {};
    this.setProps(props);
  }

  setProps(newProps) {
    let oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);

    // Iterate over all the properties and call update handles for ones that have been changed.
    for (let key of Object.keys(this.props)) {
      if (this.props[key] !== oldProps[key]) {
        // Transform property name to name of the function that handles its update. For example:
        // earthTilt -> _updateEarthTilt.
        let funcName = `_update${key[0].toUpperCase()}${key.substr(1)}`;
        if (typeof this[funcName] === 'function') {
          this[funcName]();
        }
      }
    }
  }

  getEarthPosition() {
    return this.earthPos.position;
  }

  getEarthTilt() {
    return this.earthTiltPivot.rotation.z;
  }

  getEarthRotation() {
    return this.earth.rotation.y;
  }

  // Rotates earth around its own axis.
  rotateEarth(angleDiff) {
    this.earth.rotation.y += angleDiff;
  }

  // Rotates camera around the sun.
  rotateCam(angle) {
    this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.controls.update();
  }

  render(timestamp) {
    this.renderer.render(this.scene, this.camera);
  }

  // Called automatically when 'day' property is updated.
  _updateDay() {
    let day = this.props.day;
    let pos = data.earthEllipseLocationByDay(day);
    this.earthPos.position.copy(pos);
    this.sunEarthLine.setEarthPos(pos);
  }

  // Called automatically when 'earthTilt' property is updated.
  _updateEarthTilt() {
    this.earthTiltPivot.rotation.z = this.props.earthTilt ? data.EARTH_TILT : 0;
  }

  _initScene() {
    let basicProps = {type: this.type};

    this.scene.add(models.stars(basicProps));
    this.scene.add(models.ambientLight(basicProps));
    this.scene.add(models.sunLight(basicProps));
    this.scene.add(models.sunOnlyLight(basicProps));
    this.scene.add(models.grid(basicProps));
    this.scene.add(models.orbit(basicProps));
    this.scene.add(models.sun(basicProps));

    this.earth = models.earth(basicProps);
    this.earthAxis = models.earthAxis(basicProps);
    this.earth.add(this.earthAxis);
    this.earthTiltPivot = new THREE.Object3D();
    this.earthTiltPivot.add(this.earth);
    this.earthPos = new THREE.Object3D();
    // Make sure that earth is at day 0 position.
    // This is necessary so angle diff is calculated correctly in _updateDay() method.
    let pos = data.earthEllipseLocationByDay(0);
    this.earthPos.position.copy(pos);
    this.earthPos.add(this.earthTiltPivot);
    this.scene.add(this.earthPos);

    this.sunEarthLine = new SunEarthLine(basicProps);
    this.scene.add(this.sunEarthLine.rootObject);
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;
  }
}
