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

	var _viewsManagerJs = __webpack_require__(1);

	var _viewsManagerJs2 = _interopRequireDefault(_viewsManagerJs);

	var state = {
	  day: 0,
	  earthTilt: true,
	  earthRotation: false,
	  lat: 0,
	  long: 0
	};
	var view = new _viewsManagerJs2['default'](state);

	view.earthView.on('latitude.change', function (newLat) {
	  setState({ lat: newLat });
	});
	view.earthView.on('longitude.change', function (newLong) {
	  setState({ long: newLong });
	});

	var ui = {
	  $daySlider: $('#day-slider'),
	  $earthRotation: $('#earth-rotation'),
	  $earthTilt: $('#earth-tilt'),
	  $latSlider: $('#latitude-slider'),
	  $longSlider: $('#longitude-slider')
	};

	function setState(newState) {
	  state = $.extend(state, newState);
	  view.setProps(newState);
	  updateUI();
	}

	function updateUI() {
	  ui.$daySlider.slider('value', state.day);
	  ui.$earthRotation.prop('checked', state.earthRotation);
	  ui.$earthTilt.prop('checked', state.earthTilt);
	  ui.$latSlider.slider('value', state.lat);
	  ui.$longSlider.slider('value', state.long);
	}

	ui.$daySlider.slider({
	  min: 0,
	  max: 364,
	  step: 1
	}).on('slide', function (e, ui) {
	  setState({ day: ui.value });
	});

	ui.$earthRotation.on('change', function () {
	  setState({ earthRotation: this.checked });
	});

	ui.$earthTilt.on('change', function () {
	  setState({ earthTilt: this.checked });
	});

	ui.$latSlider.slider({
	  min: -90,
	  max: 90,
	  step: 1
	}).on('slide', function (e, ui) {
	  setState({ lat: ui.value });
	});

	ui.$longSlider.slider({
	  min: -180,
	  max: 180,
	  step: 1
	}).on('slide', function (e, ui) {
	  setState({ long: ui.value });
	});

	updateUI();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _earthViewJs = __webpack_require__(2);

	var _earthViewJs2 = _interopRequireDefault(_earthViewJs);

	var _orbitViewJs = __webpack_require__(10);

	var _orbitViewJs2 = _interopRequireDefault(_orbitViewJs);

	var _default = (function () {
	  var _class = function _default(props) {
	    _classCallCheck(this, _class);

	    this.earthView = new _earthViewJs2['default'](document.getElementById('earth-view'), props);
	    this.orbitView = new _orbitViewJs2['default'](document.getElementById('orbit-view'), props);

	    // Export views to global namespace, so we can play with them using console.
	    window.earthView = this.earthView;
	    window.orbitView = this.orbitView;

	    this._syncCameraAndViewAxis();
	    this._startAnimation();
	  };

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(props) {
	      this.earthView.setProps(props);
	      this.orbitView.setProps(props);
	    }
	  }, {
	    key: '_syncCameraAndViewAxis',

	    // When earth view camera is changed, we need to update view axis in the orbit view.
	    value: function _syncCameraAndViewAxis() {
	      var _this = this;

	      var sync = function sync() {
	        var camVec = _this.earthView.getCameraEarthVec();
	        _this.orbitView.setViewAxis(camVec);
	      };
	      // Initial sync.
	      sync();
	      // When earth view camera is changed, we need to update view axis in the orbit view.
	      this.earthView.on('camera.change', sync);
	    }
	  }, {
	    key: '_startAnimation',
	    value: function _startAnimation() {
	      var _this2 = this;

	      var anim = function anim(timestamp) {
	        _this2.earthView.render(timestamp);
	        _this2.orbitView.render(timestamp);
	        requestAnimationFrame(anim);
	      };
	      requestAnimationFrame(anim);
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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _eventemitter2 = __webpack_require__(7);

	var _eventemitter22 = _interopRequireDefault(_eventemitter2);

	var _modelsModelsJs = __webpack_require__(8);

	var _modelsModelsJs2 = _interopRequireDefault(_modelsModelsJs);

	var _modelsLatitudeLineJs = __webpack_require__(9);

	var _modelsLatitudeLineJs2 = _interopRequireDefault(_modelsLatitudeLineJs);

	var _modelsLatLongMarkerJs = __webpack_require__(3);

	var _modelsLatLongMarkerJs2 = _interopRequireDefault(_modelsLatLongMarkerJs);

	var _dataJs = __webpack_require__(5);

	var data = _interopRequireWildcard(_dataJs);

	var _utilsJs = __webpack_require__(6);

	var DEG_2_RAD = Math.PI / 180;
	var RAD_2_DEG = 180 / Math.PI;

	var EARTH_TILT = 0.41; // 23.5 deg

	var DEF_PROPERTIES = {
	  day: 0,
	  earthTilt: true,
	  earthRotation: false,
	  lat: 0,
	  long: 0
	};

	var _default = (function () {
	  var _class = function _default(canvasEl) {
	    var _this = this;

	    var props = arguments[1] === undefined ? DEF_PROPERTIES : arguments[1];

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

	    this.raycaster = new THREE.Raycaster();
	    this.mouse = new THREE.Vector2(-1, -1);
	    this._enableMousePicking();

	    this.dispatch = new _eventemitter22['default']();

	    this.controls.addEventListener('change', function () {
	      _this.dispatch.emit('camera.change');
	    });

	    this._initScene();
	    this._setInitialCamPos();

	    this.props = {};
	    this.setProps(props);

	    this.render();
	  };

	  _createClass(_class, [{
	    key: 'getCameraEarthVec',

	    // Normalized vector pointing from camera to earth.
	    value: function getCameraEarthVec() {
	      return this.camera.position.clone().sub(this.earthPos.position).normalize();
	    }
	  }, {
	    key: 'getEarthTilt',
	    value: function getEarthTilt() {
	      return this.earthTiltPivot.rotation.z;
	    }
	  }, {
	    key: 'getEarthRotation',
	    value: function getEarthRotation() {
	      return this.earth.rotation.y;
	    }
	  }, {
	    key: 'setProps',
	    value: function setProps(newProps) {
	      var oldProps = $.extend(this.props);
	      this.props = $.extend(this.props, newProps);

	      if (this.props.day !== oldProps.day) this._updateDay();
	      if (this.props.earthTilt !== oldProps.earthTilt) this._updateEarthTilt();
	      if (this.props.lat !== oldProps.lat || this.props.long !== oldProps.long) this._updateLatLong();
	    }
	  }, {
	    key: 'on',

	    // Delegate #on to EventEmitter object.
	    value: function on() {
	      this.dispatch.on.apply(this.dispatch, arguments);
	    }
	  }, {
	    key: 'render',
	    value: function render(timestamp) {
	      this._animate(timestamp);
	      this._interactivityHandler();
	      this.renderer.render(this.scene, this.camera);
	      this.controls.update();
	    }
	  }, {
	    key: '_updateDay',
	    value: function _updateDay() {
	      var day = this.props.day;
	      var pos = data.earthEllipseLocationByDay(day);

	      if (this._prevDay != null) {
	        var angle = Math.atan2(this.earthPos.position.z, this.earthPos.position.x) - Math.atan2(pos.z, pos.x);
	        // Make sure that earth maintains its rotation.
	        this._rotateEarth(angle);
	        // Update camera position, rotate it and adjust its orbit length.
	        this._rotateCam(angle);
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

	      this._prevDay = day;
	    }
	  }, {
	    key: '_updateEarthTilt',
	    value: function _updateEarthTilt() {
	      this.earthTiltPivot.rotation.z = this.props.earthTilt ? EARTH_TILT : 0;
	    }
	  }, {
	    key: '_updateLatLong',
	    value: function _updateLatLong() {
	      this.latLine.setLat(this.props.lat);
	      this.latLongMarker.setLatLong(this.props.lat, this.props.long);
	    }
	  }, {
	    key: '_rotateEarth',

	    // Rotates earth around its own axis.
	    value: function _rotateEarth(angleDiff) {
	      this.earth.rotation.y += angleDiff;
	    }
	  }, {
	    key: '_rotateCam',

	    // Rotates camera around the sun.
	    value: function _rotateCam(angle) {
	      var p = this.camera.position;
	      var newZ = p.z * Math.cos(angle) - p.x * Math.sin(angle);
	      var newX = p.z * Math.sin(angle) + p.x * Math.cos(angle);
	      this.camera.position.x = newX;
	      this.camera.position.z = newZ;
	    }
	  }, {
	    key: '_initScene',
	    value: function _initScene() {
	      this.scene.add(_modelsModelsJs2['default'].stars());
	      this.scene.add(_modelsModelsJs2['default'].ambientLight());
	      this.scene.add(_modelsModelsJs2['default'].sunLight());
	      this.scene.add(_modelsModelsJs2['default'].sunOnlyLight());
	      this.scene.add(_modelsModelsJs2['default'].orbit());
	      this.scene.add(_modelsModelsJs2['default'].sun());

	      this.earth = _modelsModelsJs2['default'].earth();
	      this.earthAxis = _modelsModelsJs2['default'].earthAxis();
	      this.latLine = new _modelsLatitudeLineJs2['default']();
	      this.latLongMarker = new _modelsLatLongMarkerJs2['default']();
	      this.earth.add(this.earthAxis);
	      this.earth.add(this.latLine.rootObject);
	      this.earth.add(this.latLongMarker.rootObject);

	      this.earthTiltPivot = new THREE.Object3D();
	      this.earthTiltPivot.add(this.earth);
	      this.earthPos = new THREE.Object3D();
	      this.earthPos.add(_modelsModelsJs2['default'].grid({ size: data.earthOrbitalRadius / 8, steps: 15 }));
	      this.earthPos.add(this.earthTiltPivot);
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
	    key: '_animate',
	    value: function _animate(timestamp) {
	      if (!this.props.earthRotation) {
	        this._prevFrame = null;
	        return;
	      }
	      var progress = this._prevFrame ? timestamp - this._prevFrame : 0;
	      var angleDiff = progress * 0.0001 * Math.PI;
	      this.earth.rotation.y += angleDiff;
	      this._prevFrame = timestamp;
	    }
	  }, {
	    key: '_enableMousePicking',
	    value: function _enableMousePicking() {
	      var _this2 = this;

	      var onMouseMove = function onMouseMove(event) {
	        var pos = (0, _utilsJs.mousePosNormalized)(event, _this2.renderer.domElement);
	        _this2.mouse.x = pos.x;
	        _this2.mouse.y = pos.y;
	      };
	      $(this.renderer.domElement).on('mousemove', onMouseMove);
	    }
	  }, {
	    key: '_interactivityHandler',
	    value: function _interactivityHandler() {
	      this.raycaster.setFromCamera(this.mouse, this.camera);

	      if (this._isLatDragging) {
	        var coords = this._getPointerLatLong();
	        if (coords != null) {
	          // coords can be equal to null if user isn't pointing earth anymore.
	          this.setProps({ lat: coords.lat });
	          this.dispatch.emit('latitude.change', coords.lat);
	        }
	        return;
	      } else if (this._isLatLongDragging) {
	        var coords = this._getPointerLatLong();
	        if (coords != null) {
	          // coords can be equal to null if user isn't pointing earth anymore.
	          this.setProps({ lat: coords.lat, long: coords.long });
	          this.dispatch.emit('latitude.change', coords.lat);
	          this.dispatch.emit('longitude.change', coords.long);
	        }
	        return;
	      }

	      if (this._isUserPointing(this.latLongMarker.mesh)) {
	        this._setLatLongDraggingEnabled(true);
	      } else if (this._isUserPointing(this.latLine.mesh)) {
	        this._setLatDraggingEnabled(true);
	      } else {
	        this._setLatLongDraggingEnabled(false);
	        this._setLatDraggingEnabled(false);
	      }
	    }
	  }, {
	    key: '_isUserPointing',
	    value: function _isUserPointing(mesh) {
	      this.raycaster.setFromCamera(this.mouse, this.camera);
	      var intersects = this.raycaster.intersectObject(mesh);
	      if (intersects.length > 0) {
	        return intersects;
	      } else {
	        return false;
	      }
	    }
	  }, {
	    key: '_setLatDraggingEnabled',
	    value: function _setLatDraggingEnabled(v) {
	      var _this3 = this;

	      if (this._isLatDraggingEnabled === v) return; // exit, nothing has changed
	      this._isLatDraggingEnabled = v;
	      this.latLongMarker.setHighlighted(v);
	      this.latLine.setHighlighted(v);
	      this.controls.noRotate = v;
	      var $elem = $(this.renderer.domElement);
	      if (v) {
	        var _$elem = $(this.renderer.domElement);
	        _$elem.on('mousedown.latDragging touchstart.latDragging', function () {
	          _this3._isLatDragging = true;
	        });
	        _$elem.on('mouseup.latDragging touchend.latDragging touchcancel.latDragging', function () {
	          _this3._isLatDragging = false;
	        });
	      } else {
	        $elem.off('.latDragging');
	      }
	    }
	  }, {
	    key: '_setLatLongDraggingEnabled',
	    value: function _setLatLongDraggingEnabled(v) {
	      var _this4 = this;

	      if (this._isLatLongDraggingEnabled === v) return; // exit, nothing has changed
	      this._isLatLongDraggingEnabled = v;
	      this.latLongMarker.setHighlighted(v);
	      this.controls.noRotate = v;
	      var $elem = $(this.renderer.domElement);
	      if (v) {
	        $elem.on('mousedown.latLongDragging touchstart.latLongDragging', function () {
	          _this4._isLatLongDragging = true;
	        });
	        $elem.on('mouseup.latLongDragging touchend.latLongDragging touchcancel.latLongDragging', function () {
	          _this4._isLatLongDragging = false;
	        });
	      } else {
	        $elem.off('.latLongDragging');
	      }
	    }
	  }, {
	    key: '_getPointerLatLong',

	    // Returns longitude and latitude pointed by cursor or null if pointer doesn't intersect with earth model.
	    value: function _getPointerLatLong() {
	      var intersects = this._isUserPointing(this.earth);
	      if (!intersects) {
	        // Pointer does not intersect with earth, return null.
	        return null;
	      }
	      // Calculate vector pointing from Earth center to intersection point.
	      var intVec = intersects[0].point;
	      intVec.sub(this.earthPos.position);
	      // Take into account earth tilt and rotation.
	      intVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.getEarthTilt());
	      intVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), -this.getEarthRotation());

	      // Latitude calculations.
	      var xzVec = new THREE.Vector3(intVec.x, 0, intVec.z);
	      var lat = intVec.angleTo(xzVec) * RAD_2_DEG;
	      // .angleTo returns always positive number.
	      if (intVec.y < 0) lat *= -1;
	      // Longitude calculations.
	      var xVec = new THREE.Vector3(1, 0, 0);
	      var long = xVec.angleTo(xzVec) * RAD_2_DEG;
	      if (intVec.z > 0) long *= -1;
	      return { lat: lat, long: long };
	    }
	  }]);

	  return _class;
	})();

	exports['default'] = _default;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _constantsJs = __webpack_require__(4);

	var c = _interopRequireWildcard(_constantsJs);

	var _utilsJs = __webpack_require__(6);

	var DEG_2_RAD = Math.PI / 180;
	var DEF_COLOR = 0xffffff;
	var HIGHLIGHT_COLOR = 0xff0000;

	var LatLongMarker = (function () {
	  function LatLongMarker() {
	    _classCallCheck(this, LatLongMarker);

	    var geometry = new THREE.SphereGeometry(200000 * c.SF, 32, 32);
	    var material = new THREE.MeshBasicMaterial({ color: DEF_COLOR });
	    var mesh = new THREE.Mesh(geometry, material);
	    mesh.position.x = c.EARTH_RADIUS;
	    var pivot = new THREE.Object3D();
	    pivot.add(mesh);

	    this.rootObject = pivot;
	    this.mesh = mesh;
	    this.material = material;
	  }

	  _createClass(LatLongMarker, [{
	    key: 'setLatLong',
	    value: function setLatLong(lat, long) {
	      if (lat != null) {
	        lat = lat * DEG_2_RAD;
	        this.rootObject.rotation.z = lat;
	      }
	      if (long != null) {
	        long = long * DEG_2_RAD;
	        this.rootObject.rotation.y = long;
	      }
	    }
	  }, {
	    key: 'setHighlighted',
	    value: function setHighlighted(v) {
	      this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
	    }
	  }]);

	  return LatLongMarker;
	})();

	exports['default'] = LatLongMarker;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _dataJs = __webpack_require__(5);

	var data = _interopRequireWildcard(_dataJs);

	var SF = 1 / data.scaleFactor;
	exports.SF = SF;
	var EARTH_RADIUS = 7000000 * SF;
	exports.EARTH_RADIUS = EARTH_RADIUS;
	var SIMPLE_EARTH_RADIUS = 10000000 * SF;
	exports.SIMPLE_EARTH_RADIUS = SIMPLE_EARTH_RADIUS;
	var SUN_RADIUS = 15000000 * SF;
	exports.SUN_RADIUS = SUN_RADIUS;

/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports) {

	// Mouse position in pixels.
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mousePos = mousePos;
	exports.mousePosNormalized = mousePosNormalized;

	function mousePos(event, targetElement) {
	  var $targetElement = $(targetElement);
	  var parentX = $targetElement.offset().left;
	  var parentY = $targetElement.offset().top;
	  return { x: event.pageX - parentX, y: event.pageY - parentY };
	}

	// Normalized mouse position [-1, 1].

	function mousePosNormalized(event, targetElement) {
	  var pos = mousePos(event, targetElement);
	  var $targetElement = $(targetElement);
	  var parentWidth = $targetElement.width();
	  var parentHeight = $targetElement.height();
	  pos.x = pos.x / parentWidth * 2 - 1;
	  pos.y = -(pos.y / parentHeight) * 2 + 1;
	  return pos;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter2
	 * https://github.com/hij1nx/EventEmitter2
	 *
	 * Copyright (c) 2013 hij1nx
	 * Licensed under the MIT license.
	 */
	;!function(undefined) {

	  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	  };
	  var defaultMaxListeners = 10;

	  function init() {
	    this._events = {};
	    if (this._conf) {
	      configure.call(this, this._conf);
	    }
	  }

	  function configure(conf) {
	    if (conf) {

	      this._conf = conf;

	      conf.delimiter && (this.delimiter = conf.delimiter);
	      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
	      conf.wildcard && (this.wildcard = conf.wildcard);
	      conf.newListener && (this.newListener = conf.newListener);

	      if (this.wildcard) {
	        this.listenerTree = {};
	      }
	    }
	  }

	  function EventEmitter(conf) {
	    this._events = {};
	    this.newListener = false;
	    configure.call(this, conf);
	  }

	  //
	  // Attention, function return type now is array, always !
	  // It has zero elements if no any matches found and one or more
	  // elements (leafs) if there are matches
	  //
	  function searchListenerTree(handlers, type, tree, i) {
	    if (!tree) {
	      return [];
	    }
	    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
	        typeLength = type.length, currentType = type[i], nextType = type[i+1];
	    if (i === typeLength && tree._listeners) {
	      //
	      // If at the end of the event(s) list and the tree has listeners
	      // invoke those listeners.
	      //
	      if (typeof tree._listeners === 'function') {
	        handlers && handlers.push(tree._listeners);
	        return [tree];
	      } else {
	        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
	          handlers && handlers.push(tree._listeners[leaf]);
	        }
	        return [tree];
	      }
	    }

	    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
	      //
	      // If the event emitted is '*' at this part
	      // or there is a concrete match at this patch
	      //
	      if (currentType === '*') {
	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
	          }
	        }
	        return listeners;
	      } else if(currentType === '**') {
	        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
	        if(endReached && tree._listeners) {
	          // The next element has a _listeners, add it to the handlers.
	          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
	        }

	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            if(branch === '*' || branch === '**') {
	              if(tree[branch]._listeners && !endReached) {
	                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
	              }
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            } else if(branch === nextType) {
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
	            } else {
	              // No match on this one, shift into the tree but not in the type array.
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            }
	          }
	        }
	        return listeners;
	      }

	      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
	    }

	    xTree = tree['*'];
	    if (xTree) {
	      //
	      // If the listener tree will allow any match for this part,
	      // then recursively explore all branches of the tree
	      //
	      searchListenerTree(handlers, type, xTree, i+1);
	    }

	    xxTree = tree['**'];
	    if(xxTree) {
	      if(i < typeLength) {
	        if(xxTree._listeners) {
	          // If we have a listener on a '**', it will catch all, so add its handler.
	          searchListenerTree(handlers, type, xxTree, typeLength);
	        }

	        // Build arrays of matching next branches and others.
	        for(branch in xxTree) {
	          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
	            if(branch === nextType) {
	              // We know the next element will match, so jump twice.
	              searchListenerTree(handlers, type, xxTree[branch], i+2);
	            } else if(branch === currentType) {
	              // Current node matches, move into the tree.
	              searchListenerTree(handlers, type, xxTree[branch], i+1);
	            } else {
	              isolatedBranch = {};
	              isolatedBranch[branch] = xxTree[branch];
	              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
	            }
	          }
	        }
	      } else if(xxTree._listeners) {
	        // We have reached the end and still on a '**'
	        searchListenerTree(handlers, type, xxTree, typeLength);
	      } else if(xxTree['*'] && xxTree['*']._listeners) {
	        searchListenerTree(handlers, type, xxTree['*'], typeLength);
	      }
	    }

	    return listeners;
	  }

	  function growListenerTree(type, listener) {

	    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	    //
	    // Looks for two consecutive '**', if so, don't add the event at all.
	    //
	    for(var i = 0, len = type.length; i+1 < len; i++) {
	      if(type[i] === '**' && type[i+1] === '**') {
	        return;
	      }
	    }

	    var tree = this.listenerTree;
	    var name = type.shift();

	    while (name) {

	      if (!tree[name]) {
	        tree[name] = {};
	      }

	      tree = tree[name];

	      if (type.length === 0) {

	        if (!tree._listeners) {
	          tree._listeners = listener;
	        }
	        else if(typeof tree._listeners === 'function') {
	          tree._listeners = [tree._listeners, listener];
	        }
	        else if (isArray(tree._listeners)) {

	          tree._listeners.push(listener);

	          if (!tree._listeners.warned) {

	            var m = defaultMaxListeners;

	            if (typeof this._events.maxListeners !== 'undefined') {
	              m = this._events.maxListeners;
	            }

	            if (m > 0 && tree._listeners.length > m) {

	              tree._listeners.warned = true;
	              console.error('(node) warning: possible EventEmitter memory ' +
	                            'leak detected. %d listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit.',
	                            tree._listeners.length);
	              console.trace();
	            }
	          }
	        }
	        return true;
	      }
	      name = type.shift();
	    }
	    return true;
	  }

	  // By default EventEmitters will print a warning if more than
	  // 10 listeners are added to it. This is a useful default which
	  // helps finding memory leaks.
	  //
	  // Obviously not all Emitters should be limited to 10. This function allows
	  // that to be increased. Set to zero for unlimited.

	  EventEmitter.prototype.delimiter = '.';

	  EventEmitter.prototype.setMaxListeners = function(n) {
	    this._events || init.call(this);
	    this._events.maxListeners = n;
	    if (!this._conf) this._conf = {};
	    this._conf.maxListeners = n;
	  };

	  EventEmitter.prototype.event = '';

	  EventEmitter.prototype.once = function(event, fn) {
	    this.many(event, 1, fn);
	    return this;
	  };

	  EventEmitter.prototype.many = function(event, ttl, fn) {
	    var self = this;

	    if (typeof fn !== 'function') {
	      throw new Error('many only accepts instances of Function');
	    }

	    function listener() {
	      if (--ttl === 0) {
	        self.off(event, listener);
	      }
	      fn.apply(this, arguments);
	    }

	    listener._origin = fn;

	    this.on(event, listener);

	    return self;
	  };

	  EventEmitter.prototype.emit = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	      if (!this._events.newListener) { return false; }
	    }

	    // Loop through the *_all* functions and invoke them.
	    if (this._all) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	      for (i = 0, l = this._all.length; i < l; i++) {
	        this.event = type;
	        this._all[i].apply(this, args);
	      }
	    }

	    // If there is no 'error' event listener then throw.
	    if (type === 'error') {

	      if (!this._all &&
	        !this._events.error &&
	        !(this.wildcard && this.listenerTree.error)) {

	        if (arguments[1] instanceof Error) {
	          throw arguments[1]; // Unhandled 'error' event
	        } else {
	          throw new Error("Uncaught, unspecified 'error' event.");
	        }
	        return false;
	      }
	    }

	    var handler;

	    if(this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    }
	    else {
	      handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	      this.event = type;
	      if (arguments.length === 1) {
	        handler.call(this);
	      }
	      else if (arguments.length > 1)
	        switch (arguments.length) {
	          case 2:
	            handler.call(this, arguments[1]);
	            break;
	          case 3:
	            handler.call(this, arguments[1], arguments[2]);
	            break;
	          // slower
	          default:
	            var l = arguments.length;
	            var args = new Array(l - 1);
	            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	            handler.apply(this, args);
	        }
	      return true;
	    }
	    else if (handler) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

	      var listeners = handler.slice();
	      for (var i = 0, l = listeners.length; i < l; i++) {
	        this.event = type;
	        listeners[i].apply(this, args);
	      }
	      return (listeners.length > 0) || !!this._all;
	    }
	    else {
	      return !!this._all;
	    }

	  };

	  EventEmitter.prototype.on = function(type, listener) {

	    if (typeof type === 'function') {
	      this.onAny(type);
	      return this;
	    }

	    if (typeof listener !== 'function') {
	      throw new Error('on only accepts instances of Function');
	    }
	    this._events || init.call(this);

	    // To avoid recursion in the case that type == "newListeners"! Before
	    // adding it to the listeners, first emit "newListeners".
	    this.emit('newListener', type, listener);

	    if(this.wildcard) {
	      growListenerTree.call(this, type, listener);
	      return this;
	    }

	    if (!this._events[type]) {
	      // Optimize the case of one listener. Don't need the extra array object.
	      this._events[type] = listener;
	    }
	    else if(typeof this._events[type] === 'function') {
	      // Adding the second element, need to change to array.
	      this._events[type] = [this._events[type], listener];
	    }
	    else if (isArray(this._events[type])) {
	      // If we've already got an array, just append.
	      this._events[type].push(listener);

	      // Check for listener leak
	      if (!this._events[type].warned) {

	        var m = defaultMaxListeners;

	        if (typeof this._events.maxListeners !== 'undefined') {
	          m = this._events.maxListeners;
	        }

	        if (m > 0 && this._events[type].length > m) {

	          this._events[type].warned = true;
	          console.error('(node) warning: possible EventEmitter memory ' +
	                        'leak detected. %d listeners added. ' +
	                        'Use emitter.setMaxListeners() to increase limit.',
	                        this._events[type].length);
	          console.trace();
	        }
	      }
	    }
	    return this;
	  };

	  EventEmitter.prototype.onAny = function(fn) {

	    if (typeof fn !== 'function') {
	      throw new Error('onAny only accepts instances of Function');
	    }

	    if(!this._all) {
	      this._all = [];
	    }

	    // Add the function to the event listener collection.
	    this._all.push(fn);
	    return this;
	  };

	  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	  EventEmitter.prototype.off = function(type, listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('removeListener only takes instances of Function');
	    }

	    var handlers,leafs=[];

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	    }
	    else {
	      // does not use listeners(), so no side effect of creating _events[type]
	      if (!this._events[type]) return this;
	      handlers = this._events[type];
	      leafs.push({_listeners:handlers});
	    }

	    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	      var leaf = leafs[iLeaf];
	      handlers = leaf._listeners;
	      if (isArray(handlers)) {

	        var position = -1;

	        for (var i = 0, length = handlers.length; i < length; i++) {
	          if (handlers[i] === listener ||
	            (handlers[i].listener && handlers[i].listener === listener) ||
	            (handlers[i]._origin && handlers[i]._origin === listener)) {
	            position = i;
	            break;
	          }
	        }

	        if (position < 0) {
	          continue;
	        }

	        if(this.wildcard) {
	          leaf._listeners.splice(position, 1);
	        }
	        else {
	          this._events[type].splice(position, 1);
	        }

	        if (handlers.length === 0) {
	          if(this.wildcard) {
	            delete leaf._listeners;
	          }
	          else {
	            delete this._events[type];
	          }
	        }
	        return this;
	      }
	      else if (handlers === listener ||
	        (handlers.listener && handlers.listener === listener) ||
	        (handlers._origin && handlers._origin === listener)) {
	        if(this.wildcard) {
	          delete leaf._listeners;
	        }
	        else {
	          delete this._events[type];
	        }
	      }
	    }

	    return this;
	  };

	  EventEmitter.prototype.offAny = function(fn) {
	    var i = 0, l = 0, fns;
	    if (fn && this._all && this._all.length > 0) {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++) {
	        if(fn === fns[i]) {
	          fns.splice(i, 1);
	          return this;
	        }
	      }
	    } else {
	      this._all = [];
	    }
	    return this;
	  };

	  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

	  EventEmitter.prototype.removeAllListeners = function(type) {
	    if (arguments.length === 0) {
	      !this._events || init.call(this);
	      return this;
	    }

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

	      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	        var leaf = leafs[iLeaf];
	        leaf._listeners = null;
	      }
	    }
	    else {
	      if (!this._events[type]) return this;
	      this._events[type] = null;
	    }
	    return this;
	  };

	  EventEmitter.prototype.listeners = function(type) {
	    if(this.wildcard) {
	      var handlers = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
	      return handlers;
	    }

	    this._events || init.call(this);

	    if (!this._events[type]) this._events[type] = [];
	    if (!isArray(this._events[type])) {
	      this._events[type] = [this._events[type]];
	    }
	    return this._events[type];
	  };

	  EventEmitter.prototype.listenersAny = function() {

	    if(this._all) {
	      return this._all;
	    }
	    else {
	      return [];
	    }

	  };

	  if (true) {
	     // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return EventEmitter;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // CommonJS
	    exports.EventEmitter2 = EventEmitter;
	  }
	  else {
	    // Browser global.
	    window.EventEmitter2 = EventEmitter;
	  }
	}();


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _dataJs = __webpack_require__(5);

	var data = _interopRequireWildcard(_dataJs);

	var _constantsJs = __webpack_require__(4);

	var c = _interopRequireWildcard(_constantsJs);

	exports['default'] = {
	  stars: function stars() {
	    var geometry = new THREE.SphereGeometry(350000000 * c.SF, 32, 32);
	    var material = new THREE.MeshBasicMaterial();
	    material.map = THREE.ImageUtils.loadTexture('images/milky_way.jpg', null, function (texture) {
	      texture.minFilter = THREE.LinearFilter;
	    });
	    material.side = THREE.BackSide;
	    return new THREE.Mesh(geometry, material);
	  },

	  ambientLight: function ambientLight() {
	    return new THREE.AmbientLight(0x111111);
	  },

	  sunLight: function sunLight() {
	    return new THREE.PointLight(0xffffff, 1.2, 0);
	  },

	  // Light that affects only sun object (due to radius settings).
	  sunOnlyLight: function sunOnlyLight() {
	    var light = new THREE.PointLight(0xffffff, 1, c.SUN_RADIUS * 5);
	    light.position.y = c.SUN_RADIUS * 4;
	    return light;
	  },

	  sun: function sun() {
	    var geometry = new THREE.SphereGeometry(15000000 * c.SF, 32, 32);
	    var material = new THREE.MeshPhongMaterial({ emissive: 0x999900 });
	    var mesh = new THREE.Mesh(geometry, material);
	    return mesh;
	  },

	  earth: function earth(params) {
	    var simple = params && params.simple;
	    var RADIUS = simple ? c.SIMPLE_EARTH_RADIUS : c.EARTH_RADIUS;
	    var COLORS = simple ? { color: 0x5555ff, emissive: 0x000044 } : {};
	    var geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
	    var material = new THREE.MeshPhongMaterial(COLORS);
	    if (!simple) {
	      material.map = THREE.ImageUtils.loadTexture('images/earth.jpg', null, function (texture) {
	        texture.minFilter = THREE.LinearFilter;
	      });
	    }
	    return new THREE.Mesh(geometry, material);
	  },

	  latLongMarker: function latLongMarker() {},

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
	      size: 50000000 * c.SF,
	      height: 10000 * c.SF
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
	    var HEIGHT = simple ? 70000000 * c.SF : 17000000 * c.SF;
	    var RADIUS = simple ? 700000 * c.SF : 200000 * c.SF;
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
	    var HEIGHT = 30000000 * c.SF;
	    var RADIUS = 700000 * c.SF;
	    var geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
	    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00, emissive: 0x009900 });
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
	};
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _constantsJs = __webpack_require__(4);

	var c = _interopRequireWildcard(_constantsJs);

	var DEG_2_RAD = Math.PI / 180;
	var DEF_COLOR = 0xffffff;
	var HIGHLIGHT_COLOR = 0xff0000;

	var LatitudeLine = (function () {
	  function LatitudeLine() {
	    _classCallCheck(this, LatitudeLine);

	    var geometry = new THREE.TorusGeometry(c.EARTH_RADIUS, c.EARTH_RADIUS * 0.005, 16, 100);
	    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
	    var mesh = new THREE.Mesh(geometry, material);
	    mesh.rotation.x = Math.PI * 0.5;

	    this.rootObject = mesh;
	    this.mesh = mesh;
	    this.material = material;
	  }

	  _createClass(LatitudeLine, [{
	    key: 'setLat',
	    value: function setLat(lat) {
	      if (lat != null) {
	        this.rootObject.position.y = c.EARTH_RADIUS * Math.sin(lat * DEG_2_RAD);
	        this.rootObject.scale.x = Math.cos(lat * DEG_2_RAD);
	        this.rootObject.scale.y = Math.cos(lat * DEG_2_RAD);
	      }
	    }
	  }, {
	    key: 'setHighlighted',
	    value: function setHighlighted(v) {
	      this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
	    }
	  }]);

	  return LatitudeLine;
	})();

	exports['default'] = LatitudeLine;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _modelsModelsJs = __webpack_require__(8);

	var _modelsModelsJs2 = _interopRequireDefault(_modelsModelsJs);

	var _dataJs = __webpack_require__(5);

	var data = _interopRequireWildcard(_dataJs);

	var DEF_PROPERTIES = {
	  day: 0,
	  earthTilt: true
	};

	var _default = (function () {
	  var _class = function _default(canvasEl) {
	    var props = arguments[1] === undefined ? DEF_PROPERTIES : arguments[1];

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

	    this.props = {};
	    this.setProps(props);

	    this.render();
	  };

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(newProps) {
	      var oldProps = $.extend(this.props);
	      this.props = $.extend(this.props, newProps);

	      if (this.props.day !== oldProps.day) this._updateDay();
	      if (this.props.earthTilt !== oldProps.earthTilt) this._updateEarthTilt();
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
	  }, {
	    key: '_updateDay',
	    value: function _updateDay() {
	      var day = this.props.day;
	      var pos = data.earthEllipseLocationByDay(day);
	      this.earthPos.position.x = pos.x;
	      this.earthPos.position.z = pos.z;
	    }
	  }, {
	    key: '_updateEarthTilt',
	    value: function _updateEarthTilt() {
	      this.earth.rotation.z = this.props.earthTilt ? 0.41 : 0; // 0.41 rad = 23.5 deg
	    }
	  }, {
	    key: '_initScene',
	    value: function _initScene() {
	      this.scene.add(_modelsModelsJs2['default'].stars());
	      this.scene.add(_modelsModelsJs2['default'].ambientLight());
	      this.scene.add(_modelsModelsJs2['default'].sunLight());
	      this.scene.add(_modelsModelsJs2['default'].sunOnlyLight());
	      this.scene.add(_modelsModelsJs2['default'].grid());
	      this.scene.add(_modelsModelsJs2['default'].orbit());
	      this._addLabels();
	      this.scene.add(_modelsModelsJs2['default'].sun());

	      this.earth = _modelsModelsJs2['default'].earth({ simple: true });
	      this.earthPos = new THREE.Object3D();
	      this.earthAxis = _modelsModelsJs2['default'].earthAxis({ simple: true });
	      this.viewAxis = _modelsModelsJs2['default'].viewAxis();
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
	      var juneLbl = _modelsModelsJs2['default'].label('Jun');
	      juneLbl.position.x = data.earthOrbitalRadius * 1.05;
	      juneLbl.rotateZ(-Math.PI * 0.5);

	      var decLbl = _modelsModelsJs2['default'].label('Dec');
	      decLbl.position.x = -data.earthOrbitalRadius * 1.05;
	      decLbl.rotateZ(Math.PI * 0.5);

	      var sepLbl = _modelsModelsJs2['default'].label('Sep');
	      sepLbl.position.z = -data.earthOrbitalRadius * 1.05;

	      var marLbl = _modelsModelsJs2['default'].label('Mar');
	      marLbl.position.z = data.earthOrbitalRadius * 1.05;
	      marLbl.rotateZ(Math.PI);

	      this.scene.add(juneLbl);
	      this.scene.add(decLbl);
	      this.scene.add(sepLbl);
	      this.scene.add(marLbl);
	    }
	  }]);

	  return _class;
	})();

	exports['default'] = _default;
	module.exports = exports['default'];

/***/ }
/******/ ]);