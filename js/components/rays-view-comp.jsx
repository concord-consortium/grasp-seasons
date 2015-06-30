import React from 'react';
import CanvasView from './canvas-view.jsx';
import RaysView from '../rays-view.js';

export default class RaysViewComp extends CanvasView {
  constructor(props) {
    super(props);
    this.ExternalView = RaysView;
  }
}
