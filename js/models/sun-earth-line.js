import THREE from 'three';
import * as c from './constants.js';

const LINE_RADIUS = 30000 * c.SF;
const SIMPLE_LINE_RADIUS = 800000 * c.SF;
const POINTER_RADIUS = 100000 * c.SF;
const POINTER_TUBE = 45000 * c.SF;

export default class {
  constructor(props) {
    let simple = props.type === 'orbit-view';

    // _refVector is used to calculate angle between it and the current earth position.
    this._refVector = new THREE.Vector3(-1, 0, 0);
    this._earthRadius = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;

    this._init3DObjects(simple);
  }

  setEarthPos(newPos) {
    let len = newPos.length() - this._earthRadius;
    let angleDiff = newPos.angleTo(this._refVector);
    if (newPos.z < 0) angleDiff *= -1;
    this.rootObject.rotation.y = angleDiff;
    this._lineMesh.scale.y = len;
    this._lineMesh.position.x = -len * 0.5;
    if (this._pointerMesh) {
      this._pointerMesh.position.x = -len;
    }
  }

  _init3DObjects(simple) {
    let radius = simple ? SIMPLE_LINE_RADIUS : LINE_RADIUS;
    let segments = simple ? 4 : 8;
    let material = new THREE.MeshPhongMaterial({emissive: c.SUN_COLOR});
    let geometry = new THREE.CylinderGeometry(radius, radius, 1, segments);
    this._lineMesh = new THREE.Mesh(geometry, material);
    this._lineMesh.rotation.z = Math.PI * 0.5;

    let container = new THREE.Object3D();
    container.add(this._lineMesh);
    let pivot = new THREE.Object3D();
    pivot.add(container);

    if (!simple) {
      this._pointerMesh = this._initPointer();
      container.add(this._pointerMesh);
    }

    this.rootObject = pivot;
  }

  _initPointer() {
    let material = new THREE.MeshPhongMaterial({color: c.SUN_COLOR});
    let geometry = new THREE.TorusGeometry(POINTER_RADIUS, POINTER_TUBE, 4, 16);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI * 0.5;
    return mesh;
  }
}
