import * as data from '../solar-system-data.js';
import * as c from './constants.js';

const DEF_COLOR = 0x1286CD;
const DEF_EMISSIVE = 0x002135;

export default class {
  constructor(params) {
    let simple = params.type === 'orbit-view';
    let RADIUS = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;
    let COLORS = simple ? {color: DEF_COLOR, emissive: DEF_EMISSIVE} : {specular: 0x252525};
    let geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    this._material = new THREE.MeshPhongMaterial(COLORS);
    if (!simple) {
      this._material.map = THREE.ImageUtils.loadTexture('images/earth-grid-2k.jpg');
      this._material.bumpMap = THREE.ImageUtils.loadTexture('images/earth-bump-2k.jpg');
      this._material.bumpScale = 100000 * c.SF;
      this._material.specularMap = THREE.ImageUtils.loadTexture('images/earth-specular-2k.png');
    }
    
    this._earthObject = new THREE.Mesh(geometry, this._material);
    this._tiltObject = new THREE.Object3D();
    this._tiltObject.add(this._earthObject);
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

  // Rotates earth around its own axis.
  rotate(angleDiff) {
    this._earthObject.rotation.y += angleDiff;
  }

  setPositionFromDay(day) {
    let pos = data.earthEllipseLocationByDay(day);
    this.position.copy(pos);
  }

  setTilted(v) {
    this._tiltObject.rotation.z = v ? data.EARTH_TILT : 0;
  }

  setHighlighted(v) {
    this._material.color.setHex(v ? c.HIGHLIGHT_COLOR : DEF_COLOR);
    this._material.emissive.setHex(v ? c.HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
