import THREE from 'three';
import * as c from './constants.js';
import {mousePosNormalized} from '../utils.js';

const DEG_2_RAD = Math.PI / 180;
const DEF_COLOR = 0xffffff;
const DEF_EMISSIVE = 0x999999;

export default class LatLongMarker {
  constructor() {
    let geometry = new THREE.SphereGeometry(300000 * c.SF, 32, 32);
    let material = new THREE.MeshPhongMaterial({emissive: DEF_EMISSIVE});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = c.EARTH_RADIUS;
    let pivot = new THREE.Object3D();
    pivot.add(mesh);

    this.rootObject = pivot;
    this.mesh = mesh;
    this.material = material;
  }

  setLatLong(lat, long) {
    if (lat != null) {
      lat = lat * DEG_2_RAD;
      this.rootObject.rotation.z = lat;
    }
    if (long != null) {
      long = long * DEG_2_RAD;
      this.rootObject.rotation.y = long;
    }
  }

  setHighlighted(v) {
    this.material.color.setHex(v ? c.HIGHLIGHT_COLOR : DEF_COLOR);
    this.material.emissive.setHex(v ? c.HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
