import * as THREE from 'three';
import * as data from '../solar-system-data';
import * as c from './constants';
import earthLargeImg from '../../images/earth-2k.jpg';//'../../images/earth-grid-2k.jpg';
import earthLargeGridImg from '../../images/earth-grid-2k.jpg';
import earthSimpleImg from '../../images/earth-equator-0.5k.jpg';//'../../images/earth-0.5k.jpg';
import earthBumpImg from '../../images/earth-bump-2k.jpg';
import { IModelParams } from '../types';
// import earthSpecularImg from '../../images/earth-specular-2k.png';

const DEF_COLOR = 0xffffff;
const DEF_EMISSIVE = 0x002135;

export default class Earth {
  _earthObject: THREE.Mesh;
  _material: THREE.MeshPhongMaterial;
  _orbitRotationObject: THREE.Object3D;
  _posObject: THREE.Object3D;
  _tiltObject: THREE.Object3D;
  constructor(params: IModelParams) {
    let simple = params.type === 'orbit-view';
    let RADIUS = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;
    let COLORS = simple ? {color: DEF_COLOR, emissive: DEF_EMISSIVE, specular: 0x000000} : {specular: 0x000000};
    let geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    this._material = new THREE.MeshPhongMaterial(COLORS);
    let textureLoader = new THREE.TextureLoader();
    this._material.map = textureLoader.load(simple ? earthSimpleImg : earthLargeImg);
    if (true || !simple) {
      this._material.bumpMap = textureLoader.load(earthBumpImg);
      this._material.bumpScale = 100000 * c.SF;
    }
    this._earthObject = new THREE.Mesh(geometry, this._material);
    this._orbitRotationObject = new THREE.Object3D();
    this._orbitRotationObject.add(this._earthObject);
    this._tiltObject = new THREE.Object3D();
    this._tiltObject.add(this._orbitRotationObject);
    this._posObject = new THREE.Object3D();
    // Make sure that earth is at day 0 position.
    // This is necessary so angle diff is calculated correctly in _updateDay() method.
    let pos = data.earthEllipseLocationByDay(0);
    this._posObject.position.copy(pos);
    this._posObject.add(this._tiltObject);
  }

  get rootObject() {
    return this._posObject;
  }

  get posObject() {
    return this._posObject;
  }

  get tiltObject() {
    return this._tiltObject;
  }

  get earthObject() {
    return this._earthObject;
  }

  get position() {
    return this._posObject.position;
  }

  get tilt() {
    return this._tiltObject.rotation.z;
  }

  get rotation() {
    return this._earthObject.rotation.y;
  }

  set rotation(angle) {
    this._earthObject.rotation.y = angle;
  }

  get orbitRotation() {
    return this._orbitRotationObject.rotation.y;
  }

  get overallRotation() {
    return this.rotation + this.orbitRotation;
  }

  get verticalAxisDir() {
    let earthHorizontalAxis = new THREE.Vector3(0, 1, 0);
    earthHorizontalAxis.applyQuaternion(this.tiltObject.quaternion);
    return earthHorizontalAxis;
  }

  get horizontalAxisDir() {
    return new THREE.Vector3(0, 0, 1);
  }

  get lat0Long0AxisDir() {
    return new THREE.Vector3(1, 0, 0);
  }

  showGridlines(show: boolean) {
    let textureLoader = new THREE.TextureLoader();
    if (!show) {
      this._material.map = textureLoader.load(earthLargeImg);
    } else {
      this._material.map = textureLoader.load(earthLargeGridImg);
    }
  }

  // Rotates earth around its own axis.
  rotate(angleDiff: number) {
    this._earthObject.rotation.y += angleDiff;
  }

  setPositionFromDay(day: number) {
    let newPos = data.earthEllipseLocationByDay(day);

    let angleDiff = Math.atan2(this.position.z, this.position.x) - Math.atan2(newPos.z, newPos.x);
    // Make sure that earth maintains its current rotation.
    this._orbitRotationObject.rotation.y += angleDiff;

    this.position.copy(newPos);
  }

  setTilted(v?: boolean) {
    this._tiltObject.rotation.z = v ? data.EARTH_TILT : 0;
  }

  setHighlighted(v: boolean) {
    this._material.color.setHex(v ? c.HIGHLIGHT_COLOR : DEF_COLOR);
    this._material.emissive.setHex(v ? c.HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
