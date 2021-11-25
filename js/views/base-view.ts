// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jque... Remove this comment to see the full error message
import $ from 'jquery';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import EventEmitter from 'eventemitter2';
import models from '../models/common-models.js';
import Earth from '../models/earth.js';
import SunEarthLine from '../models/sun-earth-line.js';
import * as data from '../solar-system-data.js';

import t from '../translate';

const DEF_PROPERTIES = {
  day: 0,
  earthTilt: true,
  earthRotation: 4.94,
  sunEarthLine: true
};

export default class {
  _interactionHandler: any;
  camera: any;
  controls: any;
  dispatch: any;
  earth: any;
  earthAxis: any;
  lang: any;
  months: any;
  props: any;
  renderer: any;
  scene: any;
  sunEarthLine: any;
  type: any;
  constructor(parentEl: any, props = DEF_PROPERTIES, modelType = 'unknown') {
    let width = parentEl.clientWidth;
    let height = parentEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.EARTH_ORBITAL_RADIUS * 100);
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(width, height);
    parentEl.appendChild(this.renderer.domElement);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'lang' does not exist on type '{ day: num... Remove this comment to see the full error message
    this.lang = props.lang;

    this.months = t("~MONTHS_MIXED", this.lang);

    // Type is passed to 3D models.
    this.type = modelType;
    this._initScene();
    this._setInitialCamPos();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.rotateSpeed = 0.5;

    // @ts-expect-error ts-migrate(2351) FIXME: This expression is not constructable.
    this.dispatch = new EventEmitter();

    this.props = {};
    this.setProps(props);

    this._interactionHandler = null;

    // Emit events when camera is changed.
    this.controls.addEventListener('change', () => {
      this.dispatch.emit('camera.change');
    });
    this.controls.addEventListener('start', () => {
      this.dispatch.emit('camera.changeStart');
    });
    this.controls.addEventListener('end', () => {
      this.dispatch.emit('camera.changeEnd');
    });
  }

  setProps(newProps: any) {
    let oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);
    this.lang = newProps.lang;
    this.months = t("~MONTHS_MIXED", this.lang);
    // Iterate over all the properties and call update handles for ones that have been changed.
    for (let key of Object.keys(this.props)) {
      if (this.props[key] !== oldProps[key]) {
        // Transform property name to name of the function that handles its update. For example:
        // earthTilt -> _updateEarthTilt.
        let funcName = `_update${key[0].toUpperCase()}${key.substr(1)}`;
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (typeof this[funcName] === 'function') {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          this[funcName]();
        }
      }
    }
  }

  lockCameraRotation(isLocked: any) {
    if (isLocked) {
      this.controls.rotateSpeed = 0;
    }
    else {
      this.controls.rotateSpeed = 0.5;
    }
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  // Rotates camera around the sun.
  rotateCam(angle: any) {
    this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.controls.update();
  }

  render(timestamp: any) {
    this.controls.update();
    if (this._interactionHandler) {
      this._interactionHandler.checkInteraction();
    }
    this.renderer.render(this.scene, this.camera);
  }

  // Resizes canvas to fill its parent.
  resize() {
    let $parent = $(this.renderer.domElement).parent();
    let newWidth = $parent.width();
    let newHeight = $parent.height();
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }

  registerInteractionHandler(handler: any) {
    this._interactionHandler = handler;
  }

  // Called automatically when 'day' property is updated.
  _updateDay() {
    this.earth.setPositionFromDay(this.props.day);
    this.sunEarthLine.setEarthPos(this.earth.position);
  }

  // Called automatically when 'earthTilt' property is updated.
  _updateEarthTilt() {
    this.earth.setTilted(this.props.earthTilt);
  }

  _updateEarthRotation() {
    this.earth.rotation = this.props.earthRotation;
  }

  _updateSunEarthLine() {
    let mesh = this.sunEarthLine.rootObject;
    if (this.props.sunEarthLine && !mesh.parent) {
      this.scene.add(mesh);
    } else if (!this.props.sunEarthLine && mesh.parent) {
      this.scene.remove(mesh);
    }
  }

  _updateLang() {
    this.lang = this.props.lang;
  }

  _initScene() {
    let basicProps = {type: this.type};

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    this.scene.add(models.stars(basicProps));
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    this.scene.add(models.ambientLight(basicProps));
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    this.scene.add(models.sunLight(basicProps));
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    this.scene.add(models.sunOnlyLight(basicProps));
    this.scene.add(models.grid(basicProps));
    this.scene.add(models.orbit(basicProps));
    this.scene.add(models.sun(basicProps));

    this.earth = new Earth(basicProps);
    this.earthAxis = models.earthAxis(basicProps);
    this.earth.earthObject.add(this.earthAxis);
    this.scene.add(this.earth.rootObject);

    this.sunEarthLine = new SunEarthLine(basicProps);
    this.scene.add(this.sunEarthLine.rootObject);
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;
  }
}
