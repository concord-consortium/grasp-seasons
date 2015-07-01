import * as data from '../solar-system-data.js';
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
    if (!simple) {
      material.map = THREE.ImageUtils.loadTexture('images/earth-grid-2k.jpg');
      material.bumpMap = THREE.ImageUtils.loadTexture('images/earth-bump-2k.jpg');
      material.bumpScale = 100000 * c.SF;
      material.specularMap = THREE.ImageUtils.loadTexture('images/earth-specular-2k.png');
    }
    return new THREE.Mesh(geometry, material);
  },

  orbit: function () {
    let curve = new THREE.EllipseCurve(
      data.SUN_FOCUS * 2, 0, // ax, aY
      data.EARTH_SEMI_MAJOR_AXIS * data.EARTH_ORBITAL_RADIUS, data.EARTH_ORBITAL_RADIUS, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false // aClockwise
    );
    let path = new THREE.Path(curve.getPoints(150));
    let geometry = path.createPointsGeometry(150);
    let material = new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 2});
    let mesh = new THREE.Line(geometry, material);
    mesh.rotateX(Math.PI / 2);

    return mesh;
  },

  label: function (txt) {
    let geometry = new THREE.TextGeometry(txt, {
      size: 50000000 * c.SF,
      height: 1000000 * c.SF
    });
    let material = new THREE.LineBasicMaterial({color: 0xffff00});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.5;
    return mesh;
  },

  grid: function (params) {
    let steps = params.type === 'orbit-view' ? 5 : 60;
    let size = data.EARTH_ORBITAL_RADIUS;
    let step = size / steps;

    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2});

    for (let i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));

      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));

    }
    return new THREE.Line(geometry, material, THREE.LinePieces);
  },

  earthAxis: function (params) {
    let simple = params.type === 'orbit-view';
    let HEIGHT = simple ? 70000000 * c.SF : 17000000 * c.SF;
    let RADIUS = simple ? 2000000 * c.SF : 200000 * c.SF;
    let HEAD_RADIUS = RADIUS * (simple ? 3 : 2);
    let HEAD_HEIGHT = HEIGHT * (simple ? 0.2 : 0.05);
    let EMISSIVE_COL = simple ? 0x770000 : 0x330000;
    let geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    let material = new THREE.MeshPhongMaterial({color: 0xff0000, emissive: EMISSIVE_COL});
    let mesh = new THREE.Mesh(geometry, material);

    let arrowHeadGeo = new THREE.CylinderGeometry(0, HEAD_RADIUS, HEAD_HEIGHT, 32);
    let arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    return mesh;
  },

  viewAxis: function () {
    let HEIGHT = 70000000 * c.SF;
    let HEAD_HEIGHT = HEIGHT * 0.2;
    let RADIUS = 2000000 * c.SF;
    let geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    let material = new THREE.MeshPhongMaterial({color: 0x00ff00, emissive: 0x007700});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = HEIGHT * 0.5 + c.SIMPLE_EARTH_RADIUS + HEAD_HEIGHT;

    let arrowHeadGeo = new THREE.CylinderGeometry(RADIUS * 3, 0, HEAD_HEIGHT, 32);
    let arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
    arrowHeadMesh.position.y = -HEIGHT * 0.5 - HEAD_HEIGHT * 0.5;
    mesh.add(arrowHeadMesh);

    let pivot = new THREE.Object3D();
    pivot.add(mesh);
    return pivot;
  }
}