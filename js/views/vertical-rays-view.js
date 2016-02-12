import $ from 'jquery';
import {SUMMER_SOLSTICE, sunrayAngle} from '../solar-system-data.js';

const DEG_2_RAD = Math.PI / 180;

const DARK_BLUE = '#6E9CEF';
const LIGHT_BLUE = '#99ADF1';
const LIGHT_GREEN = '#84A44A';
const DARK_GREEN = '#4C7F19';
const DIST_MARKER_COLOR = '#87C2E8';

const GROUND_FRACTION = 0.2;
const DIST_MARKER_HEIGHT_FRACTION = 0.1;
const NUM_BEAMS = 10;

const DEFAULT_PROPS = {
  day: 0,
  lat: 0,
  earthTilt: true,
  sunrayColor: '#D8D8AC',
  sunrayDistMarker: false
};

export default class {
  constructor(parentEl, props = DEFAULT_PROPS) {
    this.canvas = document.createElement('canvas');
    parentEl.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.props = {};
    this.setProps(props);

    this.resize();
  }

  setProps(newProps) {
    let oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);

    if (this.props.day !== oldProps.day ||
      this.props.earthTilt !== oldProps.earthTilt ||
      this.props.lat !== oldProps.lat ||
      this.props.sunrayColor !== oldProps.sunrayColor ||
      this.props.sunrayDistMarker !== oldProps.sunrayDistMarker) {
      this.render();
    }
  }

  get solarAngle() {
    return sunrayAngle(this.props.day, this.props.earthTilt, this.props.lat) * DEG_2_RAD;
  }

  get polarNight() {
    let solarAngle = this.solarAngle;
    return solarAngle < 0 || solarAngle > 180 * DEG_2_RAD;
  }

  render() {
    this.drawSky();
    this.drawGround(0, GROUND_FRACTION);
    this.drawPolarNightOverlay();
    this.drawRays();
    this.drawDistanceBetweenRays();
  }

  drawRays() {
    let solarAngle = this.solarAngle;
    if (solarAngle < 0 || solarAngle > 180 * DEG_2_RAD) return;

    let width = this.width;
    let height = this.height;
    let groundHeight = GROUND_FRACTION * height;
    let skyHeight = height - groundHeight;

    // Longest possible line.
    let maxLength = Math.sqrt(skyHeight * skyHeight + width * width);
    let x;
    let dx = raysXDiff(solarAngle, width);
    let lineRotationRadians = 90 * DEG_2_RAD - solarAngle;

    this.ctx.save();
    this.ctx.strokeStyle = this.props.sunrayColor;
    this.ctx.fillStyle = this.props.sunrayColor;

    // Could be +/- Infinity when solarAngle is 0
    if (isFinite(dx)) {
      let idx = 0;
      for (x = dx / 2; x < width; x += dx, idx += 1) {
        this.ctx.save();
        this.ctx.translate(x, skyHeight);
        this.drawLine(lineRotationRadians, 5, maxLength);
        this.drawArrow(lineRotationRadians);
        this.ctx.restore();
      }
    }

    let dy = Math.abs(width / (NUM_BEAMS + 1) / Math.cos(solarAngle));
    let yInitial = solarAngle < 90 * DEG_2_RAD ? (dy / 2) : (((x - width) / dx) * dy);
    let xEdge = solarAngle < 90 * DEG_2_RAD ? 0 : width;
    if (isFinite(dy)) {
      for (let y = skyHeight - yInitial; y > 0; y -= dy) {
        this.ctx.save();
        this.ctx.translate(xEdge, y);
        this.drawLine(lineRotationRadians, 0, maxLength);
        this.ctx.restore();
      }
    }
    this.ctx.restore();
  }

  drawDistanceBetweenRays() {
    if (this.props.sunrayDistMarker && !this.polarNight) {
      let dx = raysXDiff(this.solarAngle, this.width);
      let numOfVisibleRays = Math.floor((this.width - dx / 2) / dx) + 1;
      let middleRayX = dx * 0.5 + dx * (Math.floor(numOfVisibleRays / 2) - 1);
      this.drawRaysDistMarker(middleRayX, this.height * (1 - GROUND_FRACTION), dx);
    }
  }

  // Resize canvas to fill its parent.
  resize() {
    let $parent = $(this.canvas).parent();
    this.width = $parent.width();
    this.height = $parent.height();
    // Update canvas attributes (they can be undefined if canvas size is set using CSS).
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.render();
  }

  drawSky() {
    if (!this.skyGradient) {
      this.skyGradient = this.ctx.createLinearGradient(0, 0, 0, 1);
      this.skyGradient.addColorStop(0, DARK_BLUE);
      this.skyGradient.addColorStop(1, LIGHT_BLUE);
    }
    this.ctx.save();
    this.ctx.fillStyle = this.skyGradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  drawGround(angle, groundFraction) {
    if (!this.groundGradient) {
      this.groundGradient = this.ctx.createLinearGradient(0, 0, 0, 1);
      this.groundGradient.addColorStop(0, LIGHT_GREEN);
      this.groundGradient.addColorStop(1, DARK_GREEN);
    }
    this.ctx.save();
    this.ctx.translate(this.width * 0.5,  this.height * (1 - groundFraction));
    this.ctx.rotate(angle);
    this.ctx.fillStyle = this.groundGradient;
    this.ctx.fillRect(-this.width, 0, this.width * 2, this.height);
    this.ctx.restore();
  }

  drawPolarNightOverlay() {
    if (this.solarAngle < 0 || this.solarAngle > 180 * DEG_2_RAD) {
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.restore();
    }
  }
  
  drawLine(angle, lengthAdjustment, length) {
    this.ctx.save();
    this.ctx.lineWidth = 4;
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -lengthAdjustment);
    this.ctx.lineTo(0, -length);
    this.ctx.stroke();
    this.ctx.restore();
  }
  
  drawArrow(angle, scaleX=1, scaleY=1) {
    this.ctx.save();
    this.ctx.lineWidth = 1;
    this.ctx.rotate(angle);
    this.ctx.scale(scaleX, scaleY);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-10, -20);
    this.ctx.lineTo(0, -16);
    this.ctx.lineTo(10, -20);
    this.ctx.lineTo(0, 0);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawRaysDistMarker(x, y, len, angle=0) {
    let height = DIST_MARKER_HEIGHT_FRACTION * this.height;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = DIST_MARKER_COLOR;
    this.ctx.fillStyle = DIST_MARKER_COLOR;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, height);
    this.ctx.moveTo(len, 0);
    this.ctx.lineTo(len, height);
    this.ctx.moveTo(0, 0.5 * height);
    this.ctx.lineTo(len, 0.5 * height);
    this.ctx.stroke();
    this.ctx.translate(0, 0.5 * height);
    this.drawArrow(Math.PI / 2, 0.9, 0.7);
    this.ctx.translate(len, 0);
    this.drawArrow(-Math.PI / 2, 0.9, 0.7);
    this.ctx.restore();
  }
}

function raysXDiff(solarAngle, width) {
  return width / (NUM_BEAMS + 1) / Math.sin(solarAngle);
}
