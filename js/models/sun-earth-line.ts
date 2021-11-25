import * as THREE from 'three';
import * as c from './constants.js';

const LINE_RADIUS = 20000 * c.SF;
const SIMPLE_LINE_RADIUS = 650000 * c.SF;
const POINTER_RADIUS = 200000 * c.SF;
const POINTER_TUBE = 60000 * c.SF;

export default class {
  _arrow: any;
  _earthRadius: any;
  _lineMesh: any;
  _pointerMesh: any;
  _refVector: any;
  rootObject: any;
  constructor(props: any) {
    let simple = props.type === 'orbit-view';

    // _refVector is used to calculate angle between it and the current earth position.
    this._refVector = new THREE.Vector3(-1, 0, 0);
    this._earthRadius = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;

    this._init3DObjects(simple);
  }

  setEarthPos(newPos: any) {
    let len = newPos.length() - this._earthRadius;
    let angleDiff = newPos.angleTo(this._refVector);
    if (newPos.z < 0) angleDiff *= -1;
    this.rootObject.rotation.y = angleDiff;
    this._lineMesh.scale.y = len;
    this._lineMesh.position.x = -len * 0.5;
    if (this._pointerMesh) {
      this._pointerMesh.position.x = -len;
    }
    this._arrow.position.x = -len;
  }

  _init3DObjects(simple: any) {
    this._lineMesh = this._initLine(simple);
    this._arrow = this._initArrow(simple);

    let container = new THREE.Object3D();
    container.add(this._lineMesh);
    container.add(this._arrow);
    let pivot = new THREE.Object3D();
    pivot.add(container);

    if (!simple) {
      this._pointerMesh = this._initPointer();
      container.add(this._pointerMesh);
    }

    this.rootObject = pivot;
  }

  _initPointer() {
    let container = new THREE.Object3D();

    for (let i = 2; i < 8; i++) {
      let radius = POINTER_RADIUS * Math.pow(i, 1.5);
      let material = new THREE.MeshPhongMaterial({color: c.SUN_COLOR, transparent: true, opacity: 1 - i * 0.125});
      let geometry = new THREE.TorusGeometry(radius, POINTER_TUBE, 6, 16 * i);
      let mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = Math.PI * 0.5;
      // Based on circle equation: x^2 + y^2 = r^2
      mesh.position.x = Math.sqrt(Math.pow(this._earthRadius, 2) - Math.pow(radius, 2)) - this._earthRadius;
      container.add(mesh);
    }

    return container;
  }

  _initLine(simple: any) {
    let radius = simple ? SIMPLE_LINE_RADIUS : LINE_RADIUS;
    let segments = simple ? 4 : 8;
    let material = new THREE.MeshPhongMaterial({emissive: c.SUN_COLOR});
    let geometry = new THREE.CylinderGeometry(radius, radius, 1, segments);
    let lineMesh = new THREE.Mesh(geometry, material);
    lineMesh.rotation.z = Math.PI * 0.5;
    return lineMesh;
  }

  _initArrow(simple: any) {
    let HEIGHT = simple ? 25000000 * c.SF : 2500000 * c.SF;
    let RADIUS = simple ? 1500000 * c.SF : 100000 * c.SF;
    let HEAD_RADIUS = RADIUS * (simple ? 2.5 : 2);
    let HEAD_HEIGHT = HEIGHT * 0.2;
    let geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    let material = new THREE.MeshPhongMaterial({color: 0xff0000, emissive: c.SUN_COLOR});
    let mesh = new THREE.Mesh(geometry, material);

    let arrowHeadGeo = new THREE.CylinderGeometry(0, HEAD_RADIUS, HEAD_HEIGHT, 32);
    let arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    mesh.position.x = 0.5 * HEIGHT + 0.5 * HEAD_HEIGHT;
    mesh.rotation.z = Math.PI * 0.5;

    let container = new THREE.Object3D();
    container.add(mesh);

    return container;
  }
}
