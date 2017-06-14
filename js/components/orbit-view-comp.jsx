import React from 'react';
import CanvasView from './canvas-view.jsx';
import OrbitView from '../views/orbit-view.js';

export default class OrbitViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = OrbitView;
  }

  componentDidMount() {
    super.componentDidMount();
    this.externalView.on('props.change', (newProps) => {
      this.props.onSimStateChange(newProps);
    });
    this._setupLogging();
  }

  setViewAxis(vec) {
    this.externalView.setViewAxis(vec);
  }

  toggleCameraModel(show) {
    this.externalView.toggleCameraModel(show);
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
