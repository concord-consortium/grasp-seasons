import * as THREE from 'three';
import * as data from '../solar-system-data.js';
import * as c from './constants.js';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/earth-2k.jpg' or ... Remove this comment to see the full error message
import earthLargeImg from '../../images/earth-2k.jpg';//'../../images/earth-grid-2k.jpg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/earth-grid-2k.jpg... Remove this comment to see the full error message
import earthLargeGridImg from '../../images/earth-grid-2k.jpg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/earth-equator-0.5... Remove this comment to see the full error message
import earthSimpleImg from '../../images/earth-equator-0.5k.jpg';//'../../images/earth-0.5k.jpg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/earth-bump-2k.jpg... Remove this comment to see the full error message
import earthBumpImg from '../../images/earth-bump-2k.jpg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/earth-specular-2k... Remove this comment to see the full error message
import earthSpecularImg from '../../images/earth-specular-2k.png';

const DEF_COLOR = 0xffffff;
const DEF_EMISSIVE = 0x002135;

export default class {
  _earthObject: any;
  _material: any;
  _orbitRotObject: any;
  _posObject: any;
  _tiltObject: any;
  constructor(params: any) {
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
    this._orbitRotObject = new THREE.Object3D();
    this._orbitRotObject.add(this._earthObject);
    this._tiltObject = new THREE.Object3D();
    this._tiltObject.add(this._orbitRotObject);
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
    return this._orbitRotObject.rotation.y;
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

  showGridlines(show: any) {
    let textureLoader = new THREE.TextureLoader();
    if (!show) {
      this._material.map = textureLoader.load(earthLargeImg);
    } else {
      this._material.map = textureLoader.load(earthLargeGridImg);
    }
  }

  // Rotates earth around its own axis.
  rotate(angleDiff: any) {
    this._earthObject.rotation.y += angleDiff;
  }

  setPositionFromDay(day: any) {
    let newPos = data.earthEllipseLocationByDay(day);

    let angleDiff = Math.atan2(this.position.z, this.position.x) - Math.atan2(newPos.z, newPos.x);
    // Make sure that earth maintains its current rotation.
    this._orbitRotObject.rotation.y += angleDiff;

    this.position.copy(newPos);
  }

  setTilted(v: any) {
    this._tiltObject.rotation.z = v ? data.EARTH_TILT : 0;
  }

  setHighlighted(v: any) {
    this._material.color.setHex(v ? c.HIGHLIGHT_COLOR : DEF_COLOR);
    this._material.emissive.setHex(v ? c.HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
