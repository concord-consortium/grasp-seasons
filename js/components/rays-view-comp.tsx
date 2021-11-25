// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './canvas-view.jsx' was resolved to '/Users... Remove this comment to see the full error message
import CanvasView from './canvas-view.jsx';
import GroundRaysView from '../views/ground-rays-view.js';
import SpaceRaysView from '../views/space-rays-view.js';

const VIEW = {
  ground: GroundRaysView,
  space: SpaceRaysView
};

export default class RaysViewComp extends CanvasView {
  ExternalView: any;
  constructor(props: any) {
    super(props);
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this.ExternalView = VIEW[props.type];
  }

  rafCallback(timestamp: any) {
    // Do nothing on requestAnimationFrame callback.
    // This view is re-rendered only when properties are changed.
  }
}
