/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _earthViewJs = __webpack_require__(1);

	var _earthViewJs2 = _interopRequireDefault(_earthViewJs);

	var _orbitViewJs = __webpack_require__(4);

	var _orbitViewJs2 = _interopRequireDefault(_orbitViewJs);

	var earthView = new _earthViewJs2['default'](document.getElementById('earth-view'));
	var orbitView = new _orbitViewJs2['default'](document.getElementById('orbit-view'));

	earthView.onCameraChange = function (camVec) {
	  orbitView.setViewAxis(camVec);
	};

	function anim() {
	  requestAnimationFrame(anim);
	  earthView.render();
	  orbitView.render();
	}
	anim();

	$('#day-slider').slider({
	  min: 0,
	  max: 364,
	  step: 1
	}).on('slide', function (e, ui) {
	  earthView.setDay(ui.value);
	  orbitView.setDay(ui.value);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _modelsJs = __webpack_require__(2);

	var _modelsJs2 = _interopRequireDefault(_modelsJs);

	var _dataJs = __webpack_require__(3);

	var data = _interopRequireWildcard(_dataJs);

	var _default = (function () {
	  var _class = function _default(canvasEl) {
	    _classCallCheck(this, _class);

	    var width = canvasEl.clientWidth;
	    var height = canvasEl.clientHeight;
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.earthOrbitalRadius * 10);
	    this.renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true });
	    this.renderer.setSize(width, height);

	    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
	    this.controls.noPan = true;
	    this.controls.noZoom = true;
	    this.controls.rotateSpeed = 0.5;

	    this.controls.addEventListener('change', (function () {
	      if (this.onCameraChange) {
	        var camVec = this.camera.position.clone().sub(this.earthPos.position).normalize();
	        this.onCameraChange(camVec);
	      }
	    }).bind(this));

	    this._initScene();
	    this._setInitialCamPos();

	    this.setDay(0);
	    this.setEarthTilt(true);
	    this.render();
	  };

	  _createClass(_class, [{
	    key: '_initScene',
	    value: function _initScene() {
	      this.scene.add(_modelsJs2['default'].stars());
	      this.scene.add(_modelsJs2['default'].ambientLight());
	      this.scene.add(_modelsJs2['default'].sunLight());
	      this.scene.add(_modelsJs2['default'].sunOnlyLight());
	      this.scene.add(_modelsJs2['default'].orbit());
	      this.scene.add(_modelsJs2['default'].sun());

	      this.earth = _modelsJs2['default'].earth();
	      this.earthAxis = _modelsJs2['default'].earthAxis();
	      this.earth.add(this.earthAxis);

	      this.earthPos = new THREE.Object3D();
	      this.earthPos.add(_modelsJs2['default'].grid({ size: data.earthOrbitalRadius / 8, steps: 15 }));
	      this.earthPos.add(this.earth);
	      this.scene.add(this.earthPos);
	    }
	  }, {
	    key: '_setInitialCamPos',
	    value: function _setInitialCamPos() {
	      this.camera.position.x = -128207750 / data.scaleFactor;
	      this.camera.position.y = 5928580 / data.scaleFactor;
	      this.camera.position.z = 24799310 / data.scaleFactor;
	    }
	  }, {
	    key: 'setDay',
	    value: function setDay(day) {
	      var pos = data.earthEllipseLocationByDay(day);

	      if (this.day != null) {
	        var angle = Math.atan2(this.earthPos.position.z, this.earthPos.position.x) - Math.atan2(pos.z, pos.x);
	        // Make sure that earth maintains its rotation.
	        this.earth.rotateY(angle);
	        // Update camera position, rotate it and adjust its orbit length.
	        this.rotateCam(angle);
	        var oldOrbitLength = new THREE.Vector2(this.earthPos.position.x, this.earthPos.position.z).length();
	        var newOrbitLength = new THREE.Vector2(pos.x, pos.z).length();
	        this.camera.position.x *= newOrbitLength / oldOrbitLength;
	        this.camera.position.z *= newOrbitLength / oldOrbitLength;
	      }

	      this.earthPos.position.x = pos.x;
	      this.earthPos.position.z = pos.z;

	      // Set camera target to new position too.
	      this.controls.target.x = pos.x;
	      this.controls.target.z = pos.z;
	      this.controls.update();

	      this.day = day;
	    }
	  }, {
	    key: 'setEarthTilt',
	    value: function setEarthTilt(tilt) {
	      this.earth.rotation.z = tilt ? 0.41 : 0; // 0.41 rad = 23.5 deg
	    }
	  }, {
	    key: 'rotateCam',
	    value: function rotateCam(angle) {
	      var p = this.camera.position;
	      var newZ = p.z * Math.cos(angle) - p.x * Math.sin(angle);
	      var newX = p.z * Math.sin(angle) + p.x * Math.cos(angle);
	      this.camera.position.x = newX;
	      this.camera.position.z = newZ;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.renderer.render(this.scene, this.camera);
	      this.controls.update();
	    }
	  }]);

	  return _class;
	})();

	exports['default'] = _default;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _dataJs = __webpack_require__(3);

	var data = _interopRequireWildcard(_dataJs);

	var sf = 1 / data.scaleFactor;
	var SIMPLE_EARTH_RADIUS = 10000000 * sf;
	var SUN_RADIUS = 15000000 * sf;

	exports['default'] = {
	  stars: function stars() {
	    var geometry = new THREE.SphereGeometry(350000000 * sf, 32, 32);
	    var material = new THREE.MeshBasicMaterial();
	    material.map = THREE.ImageUtils.loadTexture('/images/milky_way.jpg');
	    material.side = THREE.BackSide;
	    var mesh = new THREE.Mesh(geometry, material);
	    return mesh;
	  },

	  ambientLight: function ambientLight() {
	    return new THREE.AmbientLight(0x111111);
	  },

	  sunLight: function sunLight() {
	    return new THREE.PointLight(0xffffff, 1, 0);
	  },

	  // Light that affects only sun object (due to radius settings).
	  sunOnlyLight: function sunOnlyLight() {
	    var light = new THREE.PointLight(0xffffff, 1, SUN_RADIUS * 5);
	    light.position.y = SUN_RADIUS * 4;
	    return light;
	  },

	  sun: function sun() {
	    var geometry = new THREE.SphereGeometry(15000000 * sf, 32, 32);
	    var material = new THREE.MeshPhongMaterial({ emissive: 0x999900 });
	    var mesh = new THREE.Mesh(geometry, material);
	    return mesh;
	  },

	  earth: function earth(params) {
	    var simple = params && params.simple;
	    var RADIUS = simple ? SIMPLE_EARTH_RADIUS : 7000000 * sf;
	    var COLORS = simple ? { color: 0x5555ff, emissive: 0x000044 } : {};
	    var geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
	    var material = new THREE.MeshPhongMaterial(COLORS);
	    if (!simple) {
	      material.map = THREE.ImageUtils.loadTexture('/images/earth.jpg');
	    }
	    var mesh = new THREE.Mesh(geometry, material);
	    return mesh;
	  },

	  orbit: function orbit() {
	    var curve = new THREE.EllipseCurve(data.sunFocus * 2, 0, // ax, aY
	    data.earthSemiMajorAxis * data.earthOrbitalRadius, data.earthOrbitalRadius, // xRadius, yRadius
	    0, 2 * Math.PI, // aStartAngle, aEndAngle
	    false // aClockwise
	    );
	    var path = new THREE.Path(curve.getPoints(150));
	    var geometry = path.createPointsGeometry(150);
	    var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
	    var mesh = new THREE.Line(geometry, material);
	    mesh.rotateX(Math.PI / 2);

	    return mesh;
	  },

	  label: function label(txt) {
	    var geometry = new THREE.TextGeometry(txt, {
	      size: 50000000 * sf,
	      height: 10000 * sf
	    });
	    var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
	    var mesh = new THREE.Mesh(geometry, material);
	    mesh.rotation.x = -Math.PI * 0.5;
	    return mesh;
	  },

	  grid: function grid(params) {
	    var steps = params && params.steps || 5;
	    var size = params && params.size || data.earthOrbitalRadius;
	    var step = size / steps;

	    var geometry = new THREE.Geometry();
	    var material = new THREE.LineBasicMaterial({ color: 0x005500 });

	    for (var i = -size; i <= size; i += step) {
	      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
	      geometry.vertices.push(new THREE.Vector3(size, 0, i));

	      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
	      geometry.vertices.push(new THREE.Vector3(i, 0, size));
	    }
	    return new THREE.Line(geometry, material, THREE.LinePieces);
	  },

	  earthAxis: function earthAxis(params) {
	    var simple = params && params.simple;
	    var HEIGHT = simple ? 70000000 * sf : 17000000 * sf;
	    var RADIUS = simple ? 700000 * sf : 200000 * sf;
	    var HEAD_RADIUS = simple ? 3 : 2;
	    var EMMSIVE_COL = simple ? 0xaa0000 : 0x330000;
	    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
	    var material = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: EMMSIVE_COL });
	    var mesh = new THREE.Mesh(geometry, material);

	    var arrowHeadGeo = new THREE.CylinderGeometry(0, RADIUS * HEAD_RADIUS, HEIGHT * 0.05, 32);
	    var arrowHeadMesh = new THREE.Mesh(arrowHeadGeo, material);
	    arrowHeadMesh.position.y = HEIGHT * 0.5;
	    mesh.add(arrowHeadMesh);

	    return mesh;
	  },

	  viewAxis: function viewAxis() {
	    var HEIGHT = 30000000 * sf;
	    var RADIUS = 700000 * sf;
	    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
	    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00, emissive: 0x009900 });
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
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.earthEllipseLocationByDay = earthEllipseLocationByDay;
	var AU = 149597870.691;
	var au2km = 149597870.7;
	var earthEccentricity = 0.01671123;

	var scaleFactor = 100000;
	exports.scaleFactor = scaleFactor;
	var earthOrbitalRadius = AU / scaleFactor;
	exports.earthOrbitalRadius = earthOrbitalRadius;
	var earthSemiMajorAxis = 1.00000261;
	exports.earthSemiMajorAxis = earthSemiMajorAxis;
	var sunFocus = earthEccentricity / earthSemiMajorAxis / 2 * au2km / scaleFactor;

	exports.sunFocus = sunFocus;
	var dayNumberByMonth = {
	  jan: 19,
	  feb: 50,
	  mar: 78, // mar 20 17:42
	  apr: 109,
	  may: 139,
	  jun: 171, // jun 21 17:16
	  jul: 200,
	  aug: 231,
	  sep: 265, // sep 23 09:04
	  oct: 292,
	  nov: 323,
	  dec: 355 // dec 22 05:30
	};

	exports.dayNumberByMonth = dayNumberByMonth;

	function earthEllipseLocationByDay(day) {
	  var index = (dayNumberByMonth.jun - day) / 365;
	  var z = 1 / earthSemiMajorAxis * Math.sin(index * 2 * Math.PI);
	  var x = earthSemiMajorAxis * Math.cos(index * 2 * Math.PI);

	  x = x * earthOrbitalRadius + sunFocus * 2;
	  z = z * earthOrbitalRadius;

	  return { x: x, z: z };
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _modelsJs = __webpack_require__(2);

	var _modelsJs2 = _interopRequireDefault(_modelsJs);

	var _dataJs = __webpack_require__(3);

	var data = _interopRequireWildcard(_dataJs);

	var _default = (function () {
	  var _class = function _default(canvasEl) {
	    _classCallCheck(this, _class);

	    var width = canvasEl.clientWidth;
	    var height = canvasEl.clientHeight;
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.earthOrbitalRadius * 100);
	    this.renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true });
	    this.renderer.setSize(width, height);

	    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
	    this.controls.noPan = true;
	    this.controls.noZoom = true;
	    this.controls.rotateSpeed = 0.5;

	    this._initScene();
	    this._setInitialCamPos();

	    this.setDay(0);
	    this.setEarthTilt(true);
	    this.render();
	  };

	  _createClass(_class, [{
	    key: '_initScene',
	    value: function _initScene() {
	      this.scene.add(_modelsJs2['default'].stars());
	      this.scene.add(_modelsJs2['default'].ambientLight());
	      this.scene.add(_modelsJs2['default'].sunLight());
	      this.scene.add(_modelsJs2['default'].sunOnlyLight());
	      this.scene.add(_modelsJs2['default'].grid());
	      this.scene.add(_modelsJs2['default'].orbit());
	      this._addLabels();
	      this.scene.add(_modelsJs2['default'].sun());

	      this.earth = _modelsJs2['default'].earth({ simple: true });
	      this.earthPos = new THREE.Object3D();
	      this.earthAxis = _modelsJs2['default'].earthAxis({ simple: true });
	      this.viewAxis = _modelsJs2['default'].viewAxis();
	      this.earth.add(this.earthAxis);
	      this.earthPos.add(this.earth);
	      this.earthPos.add(this.viewAxis);
	      this.scene.add(this.earthPos);
	    }
	  }, {
	    key: '_setInitialCamPos',
	    value: function _setInitialCamPos() {
	      this.camera.position.x = 0;
	      this.camera.position.y = 245232773 / data.scaleFactor;
	      this.camera.position.z = 228174616 / data.scaleFactor;
	      this.controls.update();
	    }
	  }, {
	    key: '_addLabels',
	    value: function _addLabels() {
	      var juneLbl = _modelsJs2['default'].label('Jun');
	      juneLbl.position.x = data.earthOrbitalRadius * 1.05;
	      juneLbl.rotateZ(-Math.PI * 0.5);

	      var decLbl = _modelsJs2['default'].label('Dec');
	      decLbl.position.x = -data.earthOrbitalRadius * 1.05;
	      decLbl.rotateZ(Math.PI * 0.5);

	      var sepLbl = _modelsJs2['default'].label('Sep');
	      sepLbl.position.z = -data.earthOrbitalRadius * 1.05;

	      var marLbl = _modelsJs2['default'].label('Mar');
	      marLbl.position.z = data.earthOrbitalRadius * 1.05;
	      marLbl.rotateZ(Math.PI);

	      this.scene.add(juneLbl);
	      this.scene.add(decLbl);
	      this.scene.add(sepLbl);
	      this.scene.add(marLbl);
	    }
	  }, {
	    key: 'setDay',
	    value: function setDay(day) {
	      var pos = data.earthEllipseLocationByDay(day);
	      this.earthPos.position.x = pos.x;
	      this.earthPos.position.z = pos.z;
	    }
	  }, {
	    key: 'setEarthTilt',
	    value: function setEarthTilt(tilt) {
	      this.earth.rotation.z = tilt ? 0.41 : 0; // 0.41 rad = 23.5 deg
	    }
	  }, {
	    key: 'setViewAxis',
	    value: function setViewAxis(vec3) {
	      this.viewAxis.lookAt(vec3);
	      this.viewAxis.rotateX(Math.PI * 0.5);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.renderer.render(this.scene, this.camera);
	    }
	  }]);

	  return _class;
	})();

	exports['default'] = _default;
	module.exports = exports['default'];

/***/ }
/******/ ]);