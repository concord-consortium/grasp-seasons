import $ from 'jquery';
import EventEmitter from 'eventemitter2';
import models from '../models/common-models.js';
import Earth from '../models/earth.js';
import SunEarthLine from '../models/sun-earth-line.js';
import * as data from '../solar-system-data.js';

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  sunEarthLine: true
};

export default class {
  constructor(parentEl, props = DEF_PROPERTIES, modelType) {
    let width = parentEl.clientWidth;
    let height = parentEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.EARTH_ORBITAL_RADIUS * 100);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    parentEl.appendChild(this.renderer.domElement);

    // Type is passed to 3D models.
    this.type = modelType;
    this._initScene();
    this._setInitialCamPos();

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.noPan = true;
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 0.5;

    this.dispatch = new EventEmitter();
    this._interactionHandlers = [];

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

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  // Rotates camera around the sun.
  rotateCam(angle) {
    this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.controls.update();
  }

  render(timestamp) {
    this.controls.update();
    for (let i = 0; i < this._interactionHandlers.length; i++) {
      this._interactionHandlers[i].checkInteraction();
    }
    this.renderer.render(this.scene, this.camera);
  }

  // Resizes canvas to fill its parent.
  resize() {
    let $parent = $(this.renderer.domElement).parent();
    let newWidth = $parent.width();
    let newHeight = $parent.height();
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }

  registerInteractionHandler(handler) {
    this._interactionHandlers.push(handler);
  }

  // Called automatically when 'day' property is updated.
  _updateDay() {
    this.earth.setPositionFromDay(this.props.day);
    this.sunEarthLine.setEarthPos(this.earth.position);
  }

  // Called automatically when 'earthTilt' property is updated.
  _updateEarthTilt() {
    this.earth.setTilted(this.props.earthTilt);
  }

  _updateSunEarthLine() {
    let mesh = this.sunEarthLine.rootObject;
    if (this.props.sunEarthLine && !mesh.parent) {
      this.scene.add(mesh);
    } else if (!this.props.sunEarthLine && mesh.parent) {
      this.scene.remove(mesh);
    }
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

    this.earth = new Earth(basicProps);
    this.earthAxis = models.earthAxis(basicProps);
    this.earth.earthObject.add(this.earthAxis);
    this.scene.add(this.earth.rootObject);

    this.sunEarthLine = new SunEarthLine(basicProps);
    this.scene.add(this.sunEarthLine.rootObject);
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;
  }
}
