import * as THREE from 'three';
import * as c from './constants.js';

const DEG_2_RAD = Math.PI / 180;
const DEF_COLOR = 0xffffff;
const DEF_EMISSIVE = 0x999999;

export default class LatitudeLine {
  constructor(equator, simple) {
    let torusRadius = equator ? c.LAT_LINE_THICKNESS / 5 : c.LAT_LINE_THICKNESS;
    this.earthRadius = simple ? c.SIMPLE_EARTH_RADIUS * 1.02: c.EARTH_RADIUS;
    if (simple) torusRadius = torusRadius * 5;
    let geometry = new THREE.TorusGeometry(this.earthRadius, this.earthRadius * torusRadius, 16, 100);
    let material = new THREE.MeshPhongMaterial({emissive: DEF_EMISSIVE});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI * 0.5;

    this.rootObject = mesh;
    this.mesh = mesh;
    this.material = material;
  }

  setLat(lat) {
    if (lat != null) {
      this.rootObject.position.y = this.earthRadius * Math.sin(lat * DEG_2_RAD);
      this.rootObject.scale.x = Math.cos(lat * DEG_2_RAD);
      this.rootObject.scale.y = Math.cos(lat * DEG_2_RAD);
    }
  }

  setHighlighted(v) {
    this.material.color.setHex(v ? c.HIGHLIGHT_COLOR : DEF_COLOR);
    this.material.emissive.setHex(v ? c.HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
