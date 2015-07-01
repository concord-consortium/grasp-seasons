import $ from 'jquery';
import BaseInteraction from './base-interaction.js';

const RAD_2_DEG = 180 / Math.PI;

export default class extends BaseInteraction {
  constructor(view) {
    super(view);

    this.latLongMarker = view.latLongMarker;
    this.latLine = view.latLine;
    this.earth = view.earth;

    this.registerInteraction({
      test: () => {
        return this.isUserPointing(this.latLongMarker.mesh);
      },
      activationChangeHandler: (isActive) => {
        this.latLongMarker.setHighlighted(isActive);
        document.body.style.cursor = isActive ? 'move' : '';
      },
      stepHandler: () => {
        let coords = this._getPointerLatLong();
        if (coords != null) {
          // coords can be equal to null if user isn't pointing earth anymore.
          this.dispatch.emit('props.change', {lat: coords.lat, long: coords.long});
        }
      }
    });
    this.registerInteraction({
      test: () => {
        return this.isUserPointing(this.latLine.mesh);
      },
      activationChangeHandler: (isActive) => {
        this.latLine.setHighlighted(isActive);
        this.latLongMarker.setHighlighted(isActive);
        document.body.style.cursor = isActive ? 'move' : '';
      },
      stepHandler: () => {
        let coords = this._getPointerLatLong();
        if (coords != null) {
          // coords can be equal to null if user isn't pointing earth anymore.
          this.dispatch.emit('props.change', {lat: coords.lat});
        }
      }
    });
  }

  _getPointerLatLong() {
    let intersects = this.isUserPointing(this.earth.earthObject);
    if (!intersects) {
      // Pointer does not intersect with earth, return null.
      return null;
    }
    // Calculate vector pointing from Earth center to intersection point.
    let intVec = intersects[0].point;
    intVec.sub(this.earth.position);
    // Take into account earth tilt and rotation.
    intVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.earth.tilt);
    intVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), -this.earth.overallRotation);

    // Latitude calculations.
    let xzVec = new THREE.Vector3(intVec.x, 0, intVec.z);
    let lat = intVec.angleTo(xzVec) * RAD_2_DEG;
    // .angleTo returns always positive number.
    if (intVec.y < 0) lat *= -1;
    // Longitude calculations.
    let xVec = new THREE.Vector3(1, 0, 0);
    let long = xVec.angleTo(xzVec) * RAD_2_DEG;
    if (intVec.z > 0) long *= -1;
    return {lat: lat, long: long};
  }
}
