import * as c from './constants.js';

var DEG_2_RAD = Math.PI / 180;

export default class LatitudeLine {
  constructor() {
    var geometry = new THREE.TorusGeometry(c.EARTH_RADIUS, c.EARTH_RADIUS * 0.005, 16, 100);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI * 0.5;

    this.mesh = mesh;
  }

  setLat(lat) {
    if (lat != null) {
      this.mesh.position.y = c.EARTH_RADIUS * Math.sin(lat * DEG_2_RAD);
      this.mesh.scale.x = Math.cos(lat * DEG_2_RAD);
      this.mesh.scale.y = Math.cos(lat * DEG_2_RAD);
    }
  }
}
