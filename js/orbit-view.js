import $ from 'jquery';
import models from './models/models.js';
import * as data from './solar-system-data.js';

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true
};

export default class {
  constructor(canvasEl, props = DEF_PROPERTIES) {
    let width = canvasEl.clientWidth;
    let height = canvasEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.EARTH_ORBITAL_RADIUS * 100);
    this.renderer = new THREE.WebGLRenderer({canvas: canvasEl, antialias: true});
    this.renderer.setSize(width, height);

    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
    this.controls.noPan = true;
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 0.5;

    this._initScene();
    this._setInitialCamPos();

    this.props = {};
    this.setProps(props);

    this.render();
  }

  setProps(newProps) {
    let oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);

    if (this.props.day !== oldProps.day) this._updateDay();
    if (this.props.earthTilt !== oldProps.earthTilt) this._updateEarthTilt();
  }

  setViewAxis(vec3) {
    this.viewAxis.lookAt(vec3);
    this.viewAxis.rotateX(Math.PI * 0.5);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  _updateDay() {
    let day = this.props.day;
    let pos = data.earthEllipseLocationByDay(day);
    this.earthPos.position.x = pos.x;
    this.earthPos.position.z = pos.z;
  }

  _updateEarthTilt() {
    this.earth.rotation.z = this.props.earthTilt ? 0.41 : 0; // 0.41 rad = 23.5 deg
  }

  _initScene() {
    this.scene.add(models.stars());
    this.scene.add(models.ambientLight());
    this.scene.add(models.sunLight());
    this.scene.add(models.sunOnlyLight());
    this.scene.add(models.grid());
    this.scene.add(models.orbit());
    this._addLabels();
    this.scene.add(models.sun());

    this.earth = models.earth({simple: true});
    this.earthPos = new THREE.Object3D();
    this.earthAxis = models.earthAxis({simple: true});
    this.viewAxis = models.viewAxis();
    this.earth.add(this.earthAxis);
    this.earthPos.add(this.earth);
    this.earthPos.add(this.viewAxis);
    this.scene.add(this.earthPos);
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 245232773 / data.SCALE_FACTOR;
    this.camera.position.z = 228174616 / data.SCALE_FACTOR;
    this.controls.update();
  }

  _addLabels() {
    let juneLbl = models.label('Jun');
    juneLbl.position.x = data.EARTH_ORBITAL_RADIUS * 1.05;
    juneLbl.rotateZ(-Math.PI * 0.5);

    let decLbl = models.label('Dec');
    decLbl.position.x = -data.EARTH_ORBITAL_RADIUS * 1.05;
    decLbl.rotateZ(Math.PI * 0.5);

    let sepLbl = models.label('Sep');
    sepLbl.position.z = -data.EARTH_ORBITAL_RADIUS * 1.05;

    let marLbl = models.label('Mar');
    marLbl.position.z = data.EARTH_ORBITAL_RADIUS * 1.05;
    marLbl.rotateZ(Math.PI);

    this.scene.add(juneLbl);
    this.scene.add(decLbl);
    this.scene.add(sepLbl);
    this.scene.add(marLbl);
  }
}
