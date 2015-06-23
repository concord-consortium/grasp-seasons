import * as data from './data.js';

var sf = 1 / data.scaleFactor;
var SIMPLE_EARTH_RADIUS = 10000000 * sf;
var SUN_RADIUS = 15000000 * sf;

export default {
  stars: function () {
    var geometry = new THREE.SphereGeometry(350000000 * sf, 32, 32);
    var material = new THREE.MeshBasicMaterial();
    material.map = THREE.ImageUtils.loadTexture('images/milky_way.jpg');
    material.side = THREE.BackSide;
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },

  ambientLight: function () {
    return new THREE.AmbientLight(0x111111);
  },

  sunLight: function () {
    return new THREE.PointLight(0xffffff, 1, 0);
  },

  // Light that affects only sun object (due to radius settings).
  sunOnlyLight: function () {
    var light = new THREE.PointLight(0xffffff, 1, SUN_RADIUS * 5);
    light.position.y = SUN_RADIUS * 4;
    return light;
  },

  sun: function () {
    var geometry = new THREE.SphereGeometry(15000000 * sf, 32, 32);
    var material = new THREE.MeshPhongMaterial({emissive: 0x999900});
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },

  earth: function (params) {
    var simple = params && params.simple;
    var RADIUS = simple ? SIMPLE_EARTH_RADIUS : 7000000 * sf;
    var COLORS = simple ? {color: 0x5555ff, emissive: 0x000044} : {};
    var geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
    var material = new THREE.MeshPhongMaterial(COLORS);
    if (!simple) {
      material.map = THREE.ImageUtils.loadTexture('images/earth.jpg');
    }
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
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
      size: 50000000 * sf,
      height: 10000 * sf
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
    var material = new THREE.LineBasicMaterial({color: 0x005500});

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
    var HEIGHT = simple ? 70000000 * sf : 17000000 * sf;
    var RADIUS = simple ? 700000 * sf : 200000 * sf;
    var HEAD_RADIUS = simple ? 3 : 2;
    var EMMSIVE_COL = simple ? 0xaa0000 : 0x330000;
    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS , HEIGHT, 32);
    var material = new THREE.MeshPhongMaterial({color: 0xff0000, emissive: EMMSIVE_COL});
    var mesh = new THREE.Mesh(geometry, material);

    var arrowHeadGeo = new THREE.CylinderGeometry(0, RADIUS * HEAD_RADIUS, HEIGHT * 0.05, 32);
    var arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    return mesh;
  },

  viewAxis: function () {
    var HEIGHT = 30000000 * sf;
    var RADIUS = 700000 * sf;
    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00,  emissive: 0x009900});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = HEIGHT * 0.5 + SIMPLE_EARTH_RADIUS * 1.4;

    var arrowHeadGeo = new THREE.CylinderGeometry(RADIUS * 3, 0, HEIGHT * 0.05, 32);
    var arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = -HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    var pivot = new THREE.Object3D();
    pivot.add(mesh);
    return pivot;
  }
};