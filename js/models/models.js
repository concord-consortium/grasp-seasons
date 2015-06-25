import * as data from '../data.js';
import * as c from './constants.js';

export default {
  stars: function () {
    let SIZE = 4000000 * c.SF;
    let MIN_RADIUS = 500000000 * c.SF;
    let MAX_RADIUS = 3 * MIN_RADIUS;
    let geometry = new THREE.Geometry();

    for (let i = 0; i < 2000; i++) {
      let vertex = new THREE.Vector3();
      let theta = 2 * Math.PI * Math.random();
      let u = Math.random() * 2 - 1;
      vertex.x = Math.sqrt(1 - u * u) * Math.cos(theta);
      vertex.y = Math.sqrt(1 - u * u) * Math.sin(theta);
      vertex.z = u;
      vertex.multiplyScalar((MAX_RADIUS - MIN_RADIUS) * Math.random() + MIN_RADIUS);
      geometry.vertices.push(vertex);
    }
    let material = new THREE.PointCloudMaterial({size: SIZE, color: 0xffffee});
    let particles = new THREE.PointCloud(geometry, material);
    return particles;
  },

  ambientLight: function () {
    return new THREE.AmbientLight(0x111111);
  },

  sunLight: function () {
    return new THREE.PointLight(0xffffff, 1.2, 0);
  },

  // Light that affects only sun object (due to radius settings).
  sunOnlyLight: function () {
    var light = new THREE.PointLight(0xffffff, 1, c.SUN_RADIUS * 5);
    light.position.y = c.SUN_RADIUS * 4;
    return light;
  },

  sun: function () {
    var geometry = new THREE.SphereGeometry(15000000 * c.SF, 32, 32);
    var material = new THREE.MeshPhongMaterial({emissive: 0xFF8935});
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },

  earth: function (params) {
    var simple = params && params.simple;
    var RADIUS = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;
    var COLORS = simple ? {color: 0x1286CD, emissive: 0x023757} : {specular: 0x252525};
    var geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    var material = new THREE.MeshPhongMaterial(COLORS);
    if (!simple) {
      material.map = THREE.ImageUtils.loadTexture('images/earth-grid-2k.jpg');
      material.bumpMap = THREE.ImageUtils.loadTexture('images/earth-bump-2k.jpg');
      material.bumpScale = 0.7;
      material.specularMap = THREE.ImageUtils.loadTexture('images/earth-specular-2k.png');
    }
    return new THREE.Mesh(geometry, material);
  },

  orbit: function () {
    var curve = new THREE.EllipseCurve(
      data.sunFocus * 2, 0, // ax, aY
      data.earthSemiMajorAxis * data.earthOrbitalRadius, data.earthOrbitalRadius, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false // aClockwise
    );
    var path = new THREE.Path(curve.getPoints(150));
    var geometry = path.createPointsGeometry(150);
    var material = new THREE.LineBasicMaterial({color: 0xffff00});
    var mesh = new THREE.Line(geometry, material);
    mesh.rotateX(Math.PI / 2);

    return mesh;
  },

  label: function (txt) {
    var geometry = new THREE.TextGeometry(txt, {
      size: 50000000 * c.SF,
      height: 10000 * c.SF
    });
    var material = new THREE.LineBasicMaterial({color: 0xffff00});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.5;
    return mesh;
  },

  grid: function (params) {
    var steps = params && params.steps || 5;
    var size = params && params.size || data.earthOrbitalRadius;
    var step = size / steps;

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0x444444});

    for (var i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));

      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));

    }
    return new THREE.Line(geometry, material, THREE.LinePieces);
  },

  earthAxis: function (params) {
    var simple = params && params.simple;
    var HEIGHT = simple ? 70000000 * c.SF : 17000000 * c.SF;
    var RADIUS = simple ? 700000 * c.SF : 200000 * c.SF;
    var HEAD_RADIUS = simple ? 3 : 2;
    var EMMSIVE_COL = simple ? 0xaa0000 : 0x330000;
    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    var material = new THREE.MeshPhongMaterial({color: 0xff0000, emissive: EMMSIVE_COL});
    var mesh = new THREE.Mesh(geometry, material);

    var arrowHeadGeo = new THREE.CylinderGeometry(0, RADIUS * HEAD_RADIUS, HEIGHT * 0.05, 32);
    var arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    return mesh;
  },

  viewAxis: function () {
    var HEIGHT = 30000000 * c.SF;
    var RADIUS = 700000 * c.SF;
    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00, emissive: 0x009900});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = HEIGHT * 0.5 + c.SIMPLE_EARTH_RADIUS * 1.4;

    var arrowHeadGeo = new THREE.CylinderGeometry(RADIUS * 3, 0, HEIGHT * 0.05, 32);
    var arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = -HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    var pivot = new THREE.Object3D();
    pivot.add(mesh);
    return pivot;
  }
}