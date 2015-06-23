import * as c from './constants.js';

var DEG_2_RAD = Math.PI / 180;

export default class LatitudeLine {
  constructor() {
    var geometry = new THREE.SphereGeometry(200000 * c.SF, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = c.EARTH_RADIUS;
    var pivot = new THREE.Object3D();
    pivot.add(mesh);

    this.mesh = pivot;
  }

  setLatLong(lat, long) {
    if (lat != null) {
      lat = lat * DEG_2_RAD;
      this.mesh.rotation.z = lat;
    }
    if (long != null) {
      long = long * DEG_2_RAD;
      this.mesh.rotation.y = long;
    }
  }
}
