import $ from 'jquery';
import BaseInteraction from './base-interaction.js';
import {earthEllipseLocationByDay} from '../solar-system-data.js';

export default class extends BaseInteraction {
  constructor(view) {
    super(view);

    this.earth = view.earth;
    let day0Pos = earthEllipseLocationByDay(0);
    // Base angle for further calculations in _getXZPlanPos.
    this._atan2Day0Pos = Math.atan2(day0Pos.z, day0Pos.x);

    this.registerInteraction({
      test: () => {
        return this.isUserPointing(this.earth.earthObject);
      },
      activationChangeHandler: (isActive) => {
        this.earth.setHighlighted(isActive);
        document.body.style.cursor = isActive ? 'move' : '';
      },
      stepHandler: () => {
        let coords = this._getXZPlanPos();
        let angleDiff = this._atan2Day0Pos - Math.atan2(coords.z, coords.x);
        let newDay = angleDiff / (Math.PI * 2) * 364;
        if (newDay < 0) newDay += 364;
        this.dispatch.emit('day.change', newDay);
      }
    });
  }

  // Projects mouse position on XZ plane.
  _getXZPlanPos() {
    let v = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    v.unproject(this.camera);
    v.sub(this.camera.position);
    v.normalize();
    let distance = -this.camera.position.y / v.y;
    v.multiplyScalar(distance);
    let result = this.camera.position.clone();
    result.add(v);
    return result;
  }
}
