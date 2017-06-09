import * as THREE from 'three';
import fontDef from 'raw!./museo-500-regular.json';
import * as data from '../solar-system-data.js';
import * as c from './constants.js';

function addEdges(mesh) {
  let geometry = new THREE.EdgesGeometry(mesh.geometry);
  let material = new THREE.LineBasicMaterial({color: 0x000000});
  let edges = new THREE.LineSegments(geometry, material);
  edges.scale.x = edges.scale.y = edges.scale.z = 1.02; // so edges are more visible
  mesh.add(edges);
}

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
    let material = new THREE.PointsMaterial({size: SIZE, color: 0xffffee});
    let particles = new THREE.Points(geometry, material);
    return particles;
  },

  ambientLight: function () {
    return new THREE.AmbientLight(0x202020);
  },

  sunLight: function () {
    return new THREE.PointLight(0xffffff, 1, 0);
  },

  // Light that affects only sun object (due to radius settings).
  sunOnlyLight: function () {
    let light = new THREE.PointLight(0xffffff, 1, c.SUN_RADIUS * 5);
    light.position.y = c.SUN_RADIUS * 4;
    return light;
  },

  sun: function (params) {
    let radius = params.type === 'orbit-view' ? c.SIMPLE_SUN_RADIUS : c.SUN_RADIUS;
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshPhongMaterial({emissive: c.SUN_COLOR});
    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },

  earth: function (params) {
    let simple = params.type === 'orbit-view';
    let RADIUS = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;
    let COLORS = simple ? {color: 0x1286CD, emissive: 0x002135} : {specular: 0x252525};
    let geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    let material = new THREE.MeshPhongMaterial(COLORS);
    return new THREE.Mesh(geometry, material);
  },

  orbit: function (params) {
    let simple = params.type === 'orbit-view';
    let curve = new THREE.EllipseCurve(
      data.SUN_FOCUS * 2, 0, // ax, aY
      data.EARTH_SEMI_MAJOR_AXIS * data.EARTH_ORBITAL_RADIUS, data.EARTH_ORBITAL_RADIUS, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false // aClockwise
    );
    let path = new THREE.Path(curve.getPoints(150));
    let geometry = path.createPointsGeometry(150);
    let material = new THREE.LineBasicMaterial({color: 0xffff00, transparent: true, opacity: simple ? 0.7 : 0.9, linewidth: 2});
    let mesh = new THREE.Line(geometry, material);
    mesh.rotateX(Math.PI / 2);

    return mesh;
  },

  label: function (txt) {
    // Load font in a sync way, using webpack raw-loader. Based on async THREE JS loader:
    // https://github.com/mrdoob/three.js/blob/ddab1fda4fd1e21babf65aa454fc0fe15bfabc33/src/loaders/FontLoader.js#L20
    let font = new THREE.Font(JSON.parse(fontDef));
    let geometry = new THREE.TextGeometry(txt, {
      size: 16000000 * c.SF,
      height: 1000000 * c.SF,
      font: font
    });
    let material = new THREE.LineBasicMaterial({color: 0xffff00});
    let mesh = new THREE.Mesh(geometry, material);
    // Center labels.
    let bbox = new THREE.Box3().setFromObject(mesh);
    mesh.position.x = -0.5 * (bbox.max.x - bbox.min.x);
    // Apply rotation.
    let container = new THREE.Object3D();
    container.rotation.x = -Math.PI * 0.5;
    container.add(mesh);
    return container;
  },

  grid: function (params) {
    let simple = params.type === 'orbit-view';
    let COUNT = 24;
    let STEP = 365 / COUNT;
    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({color: 0xffff00, transparent: true, opacity: simple ? 0.3 : 0.6});
    for (let i = 0; i < 365; i += STEP) {
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      geometry.vertices.push(data.earthEllipseLocationByDay(i));
    }
    return new THREE.LineSegments(geometry, material);
  },

  earthAxis: function (params) {
    let simple = params.type === 'orbit-view';
    let HEIGHT = simple ? 50000000 * c.SF : 15000000 * c.SF;
    let RADIUS = simple ? 1200000 * c.SF : 120000 * c.SF;
    let HEAD_RADIUS = RADIUS * (simple ? 3 : 2);
    let HEAD_HEIGHT = HEIGHT * (simple ? 0.2 : 0.05);
    let EMISSIVE_COL = simple ? 0x770000 : 0x330000;
    let geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    let material = new THREE.MeshPhongMaterial({color: 0xff0000, emissive: EMISSIVE_COL});
    let mesh = new THREE.Mesh(geometry, material);

    let arrowHeadGeo = new THREE.SphereGeometry(HEAD_RADIUS, 32, 32);
    let arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    return mesh;
  },

  cameraSymbol: function () {
    let DIST_FROM_EARTH = 60000000 * c.SF;
    let RADIUS = 6000000 * c.SF;
    let geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, 1.5 * RADIUS, 12);
    let material = new THREE.MeshPhongMaterial({color: 0x00ff00, emissive: 0x007700});
    let lens = new THREE.Mesh(geometry, material);
    lens.position.y = DIST_FROM_EARTH;
    addEdges(lens);

    geometry = new THREE.BoxGeometry(RADIUS * 3, RADIUS * 3, RADIUS * 3);
    let box = new THREE.Mesh(geometry, material);
    box.position.y = RADIUS * 2;
    addEdges(box);
    lens.add(box);

    let pivot = new THREE.Object3D();
    pivot.add(lens);
    return pivot;
  }
}