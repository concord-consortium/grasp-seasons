import React from 'react';
import CanvasView from './canvas-view.jsx';
import EarthView from '../views/earth-view.js';

export default class EarthViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = EarthView;
  }

  componentDidMount() {
    super.componentDidMount();
    this.externalView.on('props.change', (newProps) => {
      this.props.onSimStateChange(newProps);
    });
    this.externalView.on('camera.change', () => {
      this.props.onCameraChange();
    });
  }
  toggleGridlines(gridlines){
    this.externalView.toggleGridlines(gridlines);
  }

  getCameraEarthVec() {
    return this.externalView.getCameraEarthVec();
  }

  lookAtSubsolarPoint() {
    this.externalView.lookAtSubsolarPoint();
  }

  lookAtLatLongMarker() {
    this.externalView.lookAtLatLongMarker();
  }
}
