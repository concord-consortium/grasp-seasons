import {sunrayAngle, angleToDay} from './solar-system-data.js';

export default class ScriptingAPI {
  constructor(seasonsComponent) {
    this._seasons = seasonsComponent;
  }

  getSimState() {
    return this._seasons.state.sim;
  }

  setSimState(newSimState) {
    this._seasons.setSimState(newSimState, undefined, true);
  }

  onSimStateChange(callback) {
    this._seasons.dispatch.on('simState.change', callback);
  }

  getSunrayAngle() {
    let state = this.getSimState();
    return sunrayAngle(state.day, state.earthTilt, state.lat);
  }
}
