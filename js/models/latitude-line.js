import * as c from './constants.js';

let DEG_2_RAD = Math.PI / 180;
let DEF_COLOR = 0xffffff;
let HIGHLIGHT_COLOR = 0xff0000;

export default class LatitudeLine {
  constructor() {
    let geometry = new THREE.TorusGeometry(c.EARTH_RADIUS, c.EARTH_RADIUS * 0.005, 16, 100);
    let material = new THREE.MeshBasicMaterial({color: 0xffffff});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI * 0.5;

    this.rootObject = mesh;
    this.mesh = mesh;
    this.material = material;
  }

  setLat(lat) {
    if (lat != null) {
      this.rootObject.position.y = c.EARTH_RADIUS * Math.sin(lat * DEG_2_RAD);
      this.rootObject.scale.x = Math.cos(lat * DEG_2_RAD);
      this.rootObject.scale.y = Math.cos(lat * DEG_2_RAD);
    }
  }

  setHighlighted(v) {
    this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
  }
}
