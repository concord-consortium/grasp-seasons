// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './canvas-view.jsx' was resolved to '/Users... Remove this comment to see the full error message
import CanvasView from './canvas-view.jsx';
import OrbitView from '../views/orbit-view.js';

export default class OrbitViewComp extends CanvasView {
  ExternalView: any;
  _startAngle: any;
  externalView: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.ExternalView = OrbitView;
  }

  componentDidMount() {
    super.componentDidMount();
    this.externalView.on('props.change', (newProps: any) => {
      this.props.onSimStateChange(newProps);
    });
    this._setupLogging();
  }

  setViewAxis(vec: any) {
    this.externalView.setViewAxis(vec);
  }

  toggleCameraModel(show: any) {
    this.externalView.toggleCameraModel(show);
  }

  getEarthPosition(){
    return this.externalView.getEarthPosition();
  }

  lockCameraRotation(lock: any){
    this.externalView.lockCameraRotation(lock);
  }

  _setupLogging() {
    this.externalView.on('camera.changeStart', () => {
      this._startAngle = this.externalView.getCameraAngle();
    });
    this.externalView.on('camera.changeEnd', () => {
      this.props.log('OrbitViewAngleChanged', {
        value: this.externalView.getCameraAngle(),
        prevValue: this._startAngle
      });
    });
  }
}
