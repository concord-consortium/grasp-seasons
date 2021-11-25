import {sunrayAngle, angleToDay} from './solar-system-data.js';

export default class ScriptingAPI {
  _seasons: any;
  constructor(seasonsComponent: any) {
    this._seasons = seasonsComponent;
  }

  getSimState() {
    return this._seasons.state.sim;
  }

  setSimState(newSimState: any) {
    this._seasons.setSimState(newSimState, undefined, true);
  }

  onSimStateChange(callback: any) {
    this._seasons.dispatch.on('simState.change', callback);
  }

  getSunrayAngle() {
    let state = this.getSimState();
    return sunrayAngle(state.day, state.earthTilt, state.lat);
  }

  setPlayBtnDisabled(v: any) {
    this._seasons.setPlayBtnDisabled(v);
  }

  setRotatingBtnDisabled(v: any) {
    this._seasons.setRotatingBtnDisabled(v);
  }
}
