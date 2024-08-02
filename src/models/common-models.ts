import * as THREE from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { museo500FontDef } from './museo-500-regular';
import * as data from '../solar-system-data';
import * as c from './constants';
import { IModelParams } from '../types';

function addEdges(mesh: THREE.Mesh) {
  let geometry = new THREE.EdgesGeometry(mesh.geometry);
  let material = new THREE.LineBasicMaterial({color: 0x000000});
  let edges = new THREE.LineSegments(geometry, material);
  edges.scale.x = edges.scale.y = edges.scale.z = 1.02; // so edges are more visible
  mesh.add(edges);
}

export default {
  stars: function (params: IModelParams) {
    const SIZE = 4000000 * c.SF;
    const MIN_RADIUS = 500000000 * c.SF;
    const MAX_RADIUS = 3 * MIN_RADIUS;
    const geometry = new THREE.BufferGeometry();
    const vertexCount = 2000;
    const vertices = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      const vertex = new THREE.Vector3();
      const theta = 2 * Math.PI * Math.random();
      const u = Math.random() * 2 - 1;
      vertex.x = Math.sqrt(1 - u * u) * Math.cos(theta);
      vertex.y = Math.sqrt(1 - u * u) * Math.sin(theta);
      vertex.z = u;
      vertex.multiplyScalar((MAX_RADIUS - MIN_RADIUS) * Math.random() + MIN_RADIUS);
      vertices[i * 3] = vertex.x;
      vertices[i * 3 + 1] = vertex.y;
      vertices[i * 3 + 2] = vertex.z;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({size: SIZE, color: 0xffffee});
    const particles = new THREE.Points(geometry, material);
    return particles;
  },

  ambientLight: function (params: IModelParams) {
    return new THREE.AmbientLight(0x202020, 15);
  },

  sunLight: function (params: IModelParams) {
    return new THREE.PointLight(0xffffff, 4, 0, 0);
  },

  // Light that affects only sun object (due to radius settings).
  sunOnlyLight: function (params: IModelParams) {
    let light = new THREE.PointLight(0xffffff, 10, c.SUN_RADIUS * 5);
    light.position.y = c.SUN_RADIUS * 4;
    return light;
  },

  sun: function (params: IModelParams) {
    let radius = params.type === 'orbit-view' ? c.SIMPLE_SUN_RADIUS : c.SUN_RADIUS;
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshPhongMaterial({emissive: c.SUN_COLOR, color: 0x000000});
    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },

  earth: function (params: IModelParams) {
    let simple = params.type === 'orbit-view';
    let RADIUS = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;
    let COLORS = { specular: 0x252525 };//simple ? {color: 0x1286CD, emissive: 0x002135} : {specular: 0x252525};
    let geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    let material = new THREE.MeshPhongMaterial(COLORS);
    return new THREE.Mesh(geometry, material);
  },

  orbit: function (params: IModelParams) {
    let simple = params.type === 'orbit-view';
    let curve = new THREE.EllipseCurve(
      data.SUN_FOCUS * 2, 0, // ax, aY
      data.EARTH_SEMI_MAJOR_AXIS * data.EARTH_ORBITAL_RADIUS, data.EARTH_ORBITAL_RADIUS, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // no rotation
    );
    let geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(150));
    let material = new THREE.LineBasicMaterial({color: 0xffff00, transparent: true, opacity: simple ? 0.7 : 0.9, linewidth: 2});
    let mesh = new THREE.Line(geometry, material);
    mesh.rotateX(Math.PI / 2);

    return mesh;
  },

  label: function (txt: string, small: boolean) {
    // Load font in a sync way, using webpack raw-loader. Based on async THREE JS loader:
    // https://github.com/mrdoob/three.js/blob/ddab1fda4fd1e21babf65aa454fc0fe15bfabc33/src/loaders/FontLoader.js#L20
    let font = new Font(museo500FontDef as any);
    let SIZE = 16000000;
    let HEIGHT = 1000000;
    let SIZE_SMALL = SIZE / 2;
    let HEIGHT_SMALL = HEIGHT / 2;

    let COLOR = 0xffff00;
    let COLOR_SMALL = 0x999966;

    let geometry = new TextGeometry(txt, {
      size: small ? SIZE_SMALL * c.SF : SIZE * c.SF,
      height: small ? HEIGHT_SMALL * c.SF : HEIGHT * c.SF,
      font: font
    });
    let material = new THREE.LineBasicMaterial({color: small ? COLOR_SMALL : COLOR});
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

  grid: function (params: IModelParams) {
    const simple = params.type === 'orbit-view';
    const RAY_COUNT = 24;
    const DAY_COUNT = 365;
    const STEP = DAY_COUNT / RAY_COUNT;
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({color: 0xffff00, transparent: true, opacity: simple ? 0.4 : 0.6});
    const vertices = new Float32Array(2 * RAY_COUNT * 3);
    for (let i = 0; i < RAY_COUNT; ++i) {
      vertices[i * 6] = 0;
      vertices[i * 6 + 1] = 0;
      vertices[i * 6 + 2] = 0;
      const earthLoc = data.earthEllipseLocationByDay(i * STEP);
      vertices[i * 6 + 3] = earthLoc.x;
      vertices[i * 6 + 4] = earthLoc.y;
      vertices[i * 6 + 5] = earthLoc.z;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return new THREE.LineSegments(geometry, material);
  },

  earthAxis: function (params: IModelParams) {
    let simple = params.type === 'orbit-view';
    let HEIGHT = simple ? 35000000 * c.SF : 16000000 * c.SF;
    let RADIUS = simple ? 1200000 * c.SF : 120000 * c.SF;
    let HEAD_RADIUS = RADIUS * (simple ? 2.5 : 2.2);
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
    const DIST_FROM_EARTH = 60000000 * c.SF;
    const RADIUS = 6000000 * c.SF;
    const lensGeometry = new THREE.CylinderGeometry(RADIUS, RADIUS, 1.5 * RADIUS, 12);
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00, emissive: 0x007700});
    const lens = new THREE.Mesh(lensGeometry, material);
    lens.position.y = DIST_FROM_EARTH;
    addEdges(lens);

    const boxGeometry = new THREE.BoxGeometry(RADIUS * 3, RADIUS * 3, RADIUS * 3);
    const box = new THREE.Mesh(boxGeometry, material);
    box.position.y = RADIUS * 2;
    addEdges(box);
    lens.add(box);

    let pivot = new THREE.Object3D();
    pivot.add(lens);
    return pivot;
  },

  hiddenCameraSymbol: function () {
    return new THREE.Object3D();
  }
}
