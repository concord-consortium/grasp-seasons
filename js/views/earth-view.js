import $ from 'jquery';

import BaseView from './base-view.js';
import models from '../models/common-models.js';
import LatitudeLine from '../models/latitude-line.js';
import LatLongMarker from '../models/lat-long-marker.js';
import LatLongDraggingInteraction from './earth-view-interaction.js';
import * as data from '../solar-system-data.js';
import {mousePosNormalized} from '../utils.js';

const DEG_2_RAD = Math.PI / 180;

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  sunEarthLine: true,
  earthRotation: 4.94,
  lat: 0,
  long: 0
};

export default class extends BaseView {
  constructor(parentEl, props = DEF_PROPERTIES) {
    super(parentEl, props, 'earth-view');

    // Emit events when camera is changed.
    this.controls.addEventListener('change', () => {
      this.dispatch.emit('camera.change');
    });

    this.registerInteractionHandler(new LatLongDraggingInteraction(this));

    window.earth = this;
  }

  // Normalized vector pointing from camera to earth.
  getCameraEarthVec() {
    return this.camera.position.clone().sub(this.earth.position).normalize();
  }

  lookAtSubsolarPoint() {
    let earthPos = this.earth.position;
    let camEarthDist = this.camera.position.distanceTo(earthPos);
    let earthSunDist = earthPos.length();
    this.camera.position.copy(earthPos);
    this.camera.position.multiplyScalar((earthSunDist - camEarthDist) / earthSunDist);
    this.controls.update();
  }

  _updateDay() {
    let oldOrbitRot = this.earth.orbitRotation;
    let oldPos = this.earth.position.clone();
    super._updateDay();
    let newOrbitRot = this.earth.orbitRotation;
    let newPos = this.earth.position.clone();

    // Update camera position, rotate it and adjust its orbit length.
    this.rotateCam(newOrbitRot - oldOrbitRot);
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

  _updateEarthRotation() {
    this.earth.rotation = this.props.earthRotation;
  }

  _initScene() {
    super._initScene();
    this.latLine = new LatitudeLine();
    this.latLongMarker = new LatLongMarker();
    this.earth.earthObject.add(this.latLine.rootObject);
    this.earth.earthObject.add(this.latLongMarker.rootObject);
  }

  // Sets camera next to earth at day 0 position.
  _setInitialCamPos() {
    this.camera.position.x = -129000000 / data.SCALE_FACTOR;
    this.camera.position.y = 5000000 / data.SCALE_FACTOR;
    this.camera.position.z = 25000000 / data.SCALE_FACTOR;
  }
}
