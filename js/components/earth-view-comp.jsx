import React from 'react';
import CanvasView from './canvas-view.jsx';
import EarthView from '../earth-view.js';

export default class EarthViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = EarthView;
  }

  componentDidMount() {
    super.componentDidMount();
    this.externalView.on('latitude.change', (newLat) => {
      this.props.onLocationChange({lat: newLat});
    });
    this.externalView.on('longitude.change', (newLong) => {
      this.props.onLocationChange({long: newLong});
    });
  }

  onCameraChange(callback) {
    this.externalView.on('camera.change', callback);
  }

  getCameraEarthVec() {
    return this.externalView.getCameraEarthVec();
  }
}
