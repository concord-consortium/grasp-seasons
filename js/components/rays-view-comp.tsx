import CanvasView, { ICanvasProps } from './canvas-view';
import GroundRaysView from '../views/ground-rays-view';
import SpaceRaysView from '../views/space-rays-view';

const VIEW = {
  ground: GroundRaysView,
  space: SpaceRaysView
};

interface IProps extends ICanvasProps {
  type: keyof typeof VIEW;
}
export default class RaysViewComp extends CanvasView<IProps> {
  constructor(props: IProps) {
    super(props);
    this.ExternalView = VIEW[props.type];
  }

  rafCallback(timestamp: number) {
    // Do nothing on requestAnimationFrame callback.
    // This view is re-rendered only when properties are changed.
  }
}
