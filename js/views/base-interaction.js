import $ from 'jquery';
import THREE from 'three';
import {mousePosNormalized} from '../utils.js';

export default class {
  constructor(view) {
    this.view = view;
    this.domElement = view.renderer.domElement;
    this.camera = view.camera;
    this.controls = view.controls;
    this.dispatch = view.dispatch;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-2, -2); // intentionally out of view, which is limited to [-1, 1] x [-1, 1]
    this._followMousePosition();

    this._interactions = [];
    this._interactionStartTime = null;
    this._firstValue = this._lastValue = null;
  }

  // Interaction handler interface:
  // - test
  // - step
  // - setActive
  // - actionName
  registerInteraction(int) {
    this._interactions.push(int);
  }

  checkInteraction() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    for (let i = 0; i < this._interactions.length; i++) {
      let int = this._interactions[i];
      if (int._started) {
        int.step();
        return;
      }
    }

    let anyInteractionActive = false;
    for (let i = 0; i < this._interactions.length; i++) {
      let int = this._interactions[i];
      if (!anyInteractionActive && int.test()) {
        this._setInteractionActive(int, i, true);
        anyInteractionActive = true;
      } else {
        this._setInteractionActive(int, i, false);
      }
    }

    this.controls.enableRotate = !anyInteractionActive;
  }

  isUserPointing(mesh) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      return intersects;
    } else {
      return false;
    }
  }

  updateLogValue(value) {
    if (this._firstValue === null) this._firstValue = value;
    this._lastValue = value;
  }

  _setInteractionActive(int, idx, v) {
    if (int._active === v) return;
    int._active = v;
    int.setActive(v);
    let $elem = $(this.domElement);
    let namespace = `interaction-${idx}`;
    if (v) {
      $elem.on(`mousedown.${namespace} touchstart.${namespace}`, () => {
        int._started = true;
        this._interactionStartTime = Date.now();
      });
      $elem.on(`mouseup.${namespace} touchend.${namespace} touchcancel.${namespace}`, () => {
        int._started = false;
        const duration = (Date.now() - this._interactionStartTime) / 1000; // in seconds
        this._log(int.actionName, duration);
      });
    } else {
      $elem.off(`.${namespace}`);
    }
  }

  _log(actionName, duration) {
    this.dispatch.emit('log', actionName, {
      value: this._lastValue,
      prevValue: this._firstValue,
      duration
    });
    this._firstValue = this._lastValue = null;
  }

  _followMousePosition() {
    let onMouseMove = (event) => {
      let pos = mousePosNormalized(event, this.domElement);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    };
    $(this.domElement).on('mousemove touchmove', onMouseMove);
  }
}
