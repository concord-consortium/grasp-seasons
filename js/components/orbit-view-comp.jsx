import React from 'react';
import CanvasView from './canvas-view.jsx';
import OrbitView from '../views/orbit-view.js';

export default class OrbitViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = OrbitView;
  }

  setViewAxis(vec) {
    this.externalView.setViewAxis(vec);
  }
}
