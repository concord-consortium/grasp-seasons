// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './canvas-view.jsx' was resolved to '/Users... Remove this comment to see the full error message
import CanvasView from './canvas-view.jsx';
import EarthView from '../views/earth-view.js';

export default class EarthViewComp extends CanvasView {
  ExternalView: any;
  externalView: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.ExternalView = EarthView;
  }

  componentDidMount() {
    super.componentDidMount();
    this.externalView.on('props.change', (newProps: any) => {
      this.props.onSimStateChange(newProps);
    });
    this.externalView.on('camera.change', () => {
      this.props.onCameraChange();
    });
  }
  toggleGridlines(gridlines: any){
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
