import $ from 'jquery';
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

    this._interactions = []
  }

  registerInteraction(int) {
    this._interactions.push(int);
  }

  checkInteraction() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    for (let i = 0; i < this._interactions.length; i++) {
      let int = this._interactions[i];
      if (int._started) {
        int.stepHandler();
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
        if (int._active) {
          this._setInteractionActive(int, i, false);
        }
      }
    }

    if (anyInteractionActive) {
      this.controls.enableRotate = false;
    } else {
      this.controls.enableRotate = true;
    }
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

  _setInteractionActive(int, idx, v) {
    int._active = v;
    int.activationChangeHandler(v);
    let $elem = $(this.domElement);
    let namespace = `interaction-${idx}`;
    if (v) {
      $elem.on(`mousedown.${namespace} touchstart.${namespace}`, () => {
        int._started = true;
      });
      $elem.on(`mouseup.${namespace} touchend.${namespace} touchcancel.${namespace}`, () => {
        int._started = false;
      });
    } else {
      $elem.off(`.${namespace}`);
    }
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
