import * as c from './constants.js';
import {mousePosNormalized} from '../utils.js';

let DEG_2_RAD = Math.PI / 180;
let DEF_COLOR = 0xffffff;
let HIGHLIGHT_COLOR = 0xff0000;

export default class LatLongMarker {
  constructor() {
    let geometry = new THREE.SphereGeometry(200000 * c.SF, 32, 32);
    let material = new THREE.MeshBasicMaterial({color: DEF_COLOR});
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
    this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
  }
}
