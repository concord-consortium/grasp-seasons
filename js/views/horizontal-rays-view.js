import VerticalRaysView from './vertical-rays-view';

const DEG_2_RAD = Math.PI / 180;
const GROUND_FRACTION = 0.5;
const NUM_BEAMS = 8;
const RAYS_ANGLE = 90 * DEG_2_RAD;
const SKY_COLOR = '#000';

export default class extends VerticalRaysView {
  render() {
    this.drawSky(SKY_COLOR);
    this.drawGround(this.solarAngle, GROUND_FRACTION);
    this.drawPolarNightOverlay();
    this.drawRays();
    this.drawDistanceBetweenRays();
  }

  drawRays() {
    this.ctx.save();
    this.ctx.strokeStyle = this.props.sunrayColor;
    this.ctx.fillStyle = this.props.sunrayColor;
    let solarAngle = this.solarAngle;
    let width = this.width;
    let height = this.height;
    let rayLength = width * 2;
    let cutOffHeight = null;
    let south = null;
    if (this.polarNight) {
      // cutOffHeight is a point where ground intersects the right boundary of the model.
      // Don't render it below or above it. Polar night case is different for south and north.
      cutOffHeight = height * GROUND_FRACTION + width * 0.5 * Math.tan(solarAngle);
      south = solarAngle > 180 * DEG_2_RAD;
    }
    for (let i = 0; i < NUM_BEAMS; i++) {
      let coords = this.rayCoords(i);
      if (cutOffHeight !== null && (south && coords.y < cutOffHeight || !south && coords.y > cutOffHeight)) {
        continue;
      }
      this.drawRay(coords.x, coords.y, rayLength);
    }
    this.ctx.restore();
  }

  drawRay(x, y, len) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.drawLine(RAYS_ANGLE, 5, len);
    this.drawArrow(RAYS_ANGLE);
    this.ctx.restore();
  }

  drawDistanceBetweenRays() {
    if (this.props.sunrayDistMarker && !this.polarNight) {
      let solarAngle = this.solarAngle;
      let idx = Math.floor(NUM_BEAMS / 2) - 1;
      let ray1 = this.rayCoords(idx);
      let ray2 = this.rayCoords(idx + 1);
      this.drawRaysDistMarker(ray1.x, ray1.y, length(ray1, ray2), solarAngle);
    }
  }

  rayCoords(idx) {
    let dy = this.height / NUM_BEAMS;
    let y = dy * 0.5 + idx * dy;
    let x;
    if (this.polarNight) {
      x = 0;
    } else {
      // Use trigonometry to calculate point where rays touch the ground. You can imagine a triangle
      // defined by the ground rotation origin, the ground edge and ray Y coordinate.
      let positionShift = (y - this.height * GROUND_FRACTION) / Math.tan(this.solarAngle);
      positionShift = Math.max(-this.width * 0.5, Math.min(this.width * 0.5, positionShift));
      x = this.width * 0.5 + positionShift;
    }
    return {x, y};
  }
}

function length(a, b) {
  let x = a.x - b.x;
  let y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
}
