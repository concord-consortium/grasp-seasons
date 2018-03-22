import BaseView from './base-view.js';
import EarthDraggingInteraction from './orbit-view-interaction.js';
import LatitudeLine from '../models/latitude-line.js';
import LatLongMarker from '../models/lat-long-marker.js';
import models from '../models/common-models.js';
import * as data from '../solar-system-data.js';
import * as THREE from 'three';
import t from '../translate';

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  earthRotation: 4.94,
  sunEarthLine: true
};

export default class extends BaseView {
  constructor(parentEl, props = DEF_PROPERTIES) {
    super(parentEl, props, 'orbit-view');
    this.registerInteractionHandler(new EarthDraggingInteraction(this));
  }

  setViewAxis(vec3) {
    this.cameraSymbol.lookAt(vec3);
    this.cameraSymbol.rotateX(Math.PI * 0.5);
  }

  getCameraAngle() {
    const refVec = this.camera.position.clone().setY(0);
    let angle = this.camera.position.angleTo(refVec) * 180 / Math.PI;
    if (this.camera.position.y < 0) angle *= -1;
    return angle;
  }

  getEarthPosition() {
    let vector = this.earth.posObject.position.clone();

    let container = this.renderer.context.canvas;

    let widthHalf = (container.width/2);
    let heightHalf = (container.height/2);

    vector.project(this.camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;
    vector.z = 0;

    return {
        x: Math.round(vector.x),
        y: Math.round(vector.y)
    };
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 360000000 / data.SCALE_FACTOR;
    this.camera.position.z = 0;
  }

  toggleCameraModel(show) {
    this.earth.posObject.remove(this.cameraSymbol);
    if (show) {
      this.cameraSymbol = models.cameraSymbol();
    } else {
      this.cameraSymbol = models.hiddenCameraSymbol();
    }
    this.earth.posObject.add(this.cameraSymbol);
  }

  _updateLang() {
    for (let i = 0; i < this.monthLabels.length; i++){
      this.scene.remove(this.monthLabels[i]);
    }
    this._addLabels();
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
    this.latLine = new LatitudeLine(false, true);
    this.latLongMarker = new LatLongMarker(true);
    this.earth.earthObject.add(this.latLine.rootObject);
    this.earth.earthObject.add(this.latLongMarker.rootObject);
    this.cameraSymbol = models.cameraSymbol();
    this.earth.posObject.add(this.cameraSymbol);
    this._addLabels();
  }

  _addLabels() {
    let months = this.months;
    let segments = months.length;
    let arc = 2 * Math.PI / segments;
    let labelRadius = data.EARTH_ORBITAL_RADIUS * 1.15;

    let monthLabels = [];

    for (let i = 0; i < months.length; i++) {
      let monthLbl = models.label(months[i], months[i].length === 3);
      let angle = i * arc;
      monthLbl.position.x = labelRadius * Math.sin(angle);
      monthLbl.position.z = labelRadius * Math.cos(angle);
      monthLbl.rotateZ(angle);
      this.scene.add(monthLbl);
      monthLabels.push(monthLbl);
    }
    this.monthLabels = monthLabels;
  }
}
