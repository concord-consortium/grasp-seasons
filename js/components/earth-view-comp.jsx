import React from 'react';
import CanvasView from './canvas-view.jsx';
import EarthView from '../earth-view.js';

export default class EarthViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = EarthView;
  }

  onCameraChange(callback) {
    this.externalView.on('camera.change', callback);
  }

  getCameraEarthVec() {
    return this.externalView.getCameraEarthVec();
  }
}
