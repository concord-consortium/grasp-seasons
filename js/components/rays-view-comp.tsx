import React from 'react';
import CanvasView from './canvas-view.jsx';
import GroundRaysView from '../views/ground-rays-view.js';
import SpaceRaysView from '../views/space-rays-view.js';

const VIEW = {
  ground: GroundRaysView,
  space: SpaceRaysView
};

export default class RaysViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = VIEW[props.type];
  }

  rafCallback(timestamp) {
    // Do nothing on requestAnimationFrame callback.
    // This view is re-rendered only when properties are changed.
  }
}
