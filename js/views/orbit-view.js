import BaseView from './base-view.js';
import EarthDraggingInteraction from './orbit-view-interaction.js';
import models from '../models/common-models.js';
import * as data from '../solar-system-data.js';
import * as THREE from 'three';

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
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * this.renderer.context.canvas.width;
    var heightHalf = 0.5 * this.renderer.context.canvas.height;

    this.earth.posObject.updateMatrixWorld();
    vector.setFromMatrixPosition(this.earth.posObject.matrixWorld);
    vector.project(this.camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
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

  _initScene() {
    super._initScene();
    this.cameraSymbol = models.cameraSymbol();
    this.earth.posObject.add(this.cameraSymbol);
    this._addLabels();
  }

  _addLabels() {
    let months = ["March", "Apr", "May", "June", "Jul", "Aug", "September", "Oct", "Nov", "December", "Jan", "Feb"];
    let segments = months.length;
    let arc = 2 * Math.PI / segments;
    let labelRadius = data.EARTH_ORBITAL_RADIUS * 1.15;

    for (let i = 0; i < months.length; i++) {
      let monthLbl = models.label(months[i], months[i].length === 3);
      let angle = i * arc;
      monthLbl.position.x = labelRadius * Math.sin(angle);
      monthLbl.position.z = labelRadius * Math.cos(angle);
      monthLbl.rotateZ(angle);
      this.scene.add(monthLbl);
    }
  }
}
