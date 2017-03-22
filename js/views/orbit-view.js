import BaseView from './base-view.js';
import EarthDraggingInteraction from './orbit-view-interaction.js';
import models from '../models/common-models.js';
import * as data from '../solar-system-data.js';

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  sunEarthLine: true
};

export default class extends BaseView {
  constructor(parentEl, props = DEF_PROPERTIES) {
    super(parentEl, props, 'orbit-view');
    this.registerInteractionHandler(new EarthDraggingInteraction(this));
  }

  setViewAxis(vec3) {
    this.viewAxis.lookAt(vec3);
    this.viewAxis.rotateX(Math.PI * 0.5);
  }

  getCameraAngle() {
    const refVec = this.camera.position.clone().setY(0);
    let angle = this.camera.position.angleTo(refVec) * 180 / Math.PI;
    if (this.camera.position.y < 0) angle *= -1;
    return angle;
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 360000000 / data.SCALE_FACTOR;
    this.camera.position.z = 0;
  }

  _initScene() {
    super._initScene();
    this.viewAxis = models.viewAxis();
    this.earth.posObject.add(this.viewAxis);
    this._addLabels();
  }

  _addLabels() {
    let juneLbl = models.label('June');
    juneLbl.position.x = data.EARTH_ORBITAL_RADIUS * 1.05;
    juneLbl.rotateZ(-Math.PI * 0.5);

    let decLbl = models.label('December');
    decLbl.position.x = -data.EARTH_ORBITAL_RADIUS * 1.05;
    decLbl.rotateZ(Math.PI * 0.5);

    let sepLbl = models.label('September');
    sepLbl.position.z = -data.EARTH_ORBITAL_RADIUS * 1.05;

    let marLbl = models.label('March');
    marLbl.position.z = data.EARTH_ORBITAL_RADIUS * 1.05;
    marLbl.rotateZ(Math.PI);

    this.scene.add(juneLbl);
    this.scene.add(decLbl);
    this.scene.add(sepLbl);
    this.scene.add(marLbl);
  }
}
