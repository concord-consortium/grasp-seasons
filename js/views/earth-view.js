import * as THREE from 'three';
import BaseView from './base-view.js';
import LatitudeLine from '../models/latitude-line.js';
import LatLongMarker from '../models/lat-long-marker.js';
import LatLongDraggingInteraction from './earth-view-interaction.js';
import * as data from '../solar-system-data.js';

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
    this.registerInteractionHandler(new LatLongDraggingInteraction(this));
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

  lookAtLatLongMarker() {
    // First, create vector pointing at lat 0, long 0.
    let markerVec = this.earth.lat0Long0AxisDir;
    // Apply latitude.
    markerVec.applyAxisAngle(this.earth.horizontalAxisDir, this.props.lat * DEG_2_RAD + this.earth.tilt);
    // Apply longitude.
    markerVec.applyAxisAngle(this.earth.verticalAxisDir, this.props.long * DEG_2_RAD + this.earth.overallRotation);
    markerVec.normalize();
    // Calculate quaternion that would be applied to camera position vector.
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(this.getCameraEarthVec(), markerVec);
    // Note that cameraVec is normalized, the one below is not.
    let newCameraPos = this.camera.position.clone().sub(this.earth.position);
    newCameraPos.applyQuaternion(quaternion);
    newCameraPos.add(this.earth.position);
    // Update position and orbit controls.
    this.camera.position.copy(newCameraPos);
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
    this.latLongMarker.setLatLong(this.props.lat, this.props.long);
  }

  _updateLong() {
    this.latLongMarker.setLatLong(this.props.lat, this.props.long);
  }

  _initScene() {
    super._initScene();
    this.latLine = new LatitudeLine();
    this.latLongMarker = new LatLongMarker();
    this.earth.earthObject.add(this.latLine.rootObject);
    this.earth.earthObject.add(this.latLongMarker.rootObject);
  }

  _setInitialCamPos() {
    // Sets camera next to earth at day 0 position to set initial distance from earth.
    this.camera.position.x = -129000000 / data.SCALE_FACTOR;
    this.camera.position.y = 5000000 / data.SCALE_FACTOR;
    this.camera.position.z = 25000000 / data.SCALE_FACTOR;
  }
}
