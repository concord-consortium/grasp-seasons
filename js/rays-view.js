import $ from 'jquery';
window.$ = $;
import {EARTH_TILT, DAY_NUMBER_BY_MONTH} from './solar-system-data.js';

const DARK_BLUE = '#6E9CEF';
const LIGHT_BLUE = '#99ADF1';
const LIGHT_GREEN = '#84A44A';
const DARK_GREEN = '#4C7F19';
const RAY_COLOR = '#D8D8AC';
const SKY_FRACTION = 0.8;

const DEFAULT_PROPS = {
  day: 0,
  lat: 0,
  earthTilt: true
};

const RAD_2_DEG = 180 / Math.PI;

export default class {
  constructor(canvasEl, props = DEFAULT_PROPS) {
    this.canvas = canvasEl;
    this.ctx = this.canvas.getContext('2d');

    this.props = {};
    this.setProps(props);
  }

  setProps(newProps) {
    let oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);

    if (this.props.day !== oldProps.day ||
      this.props.earthTilt !== oldProps.earthTilt ||
      this.props.lat !== oldProps.lat) {
      this._drawRaysView();
    }
  }

  getNoonSolarAltitude() {
    // Angle of tilt axis, looked at from above (i.e., projected onto xy plane).
    // June solstice = 0, September equinox = pi/2, December solstice = pi, March equinox = 3pi/2.
    let tiltAxisZRadians = 2 * Math.PI * (this.props.day - DAY_NUMBER_BY_MONTH.JUN) / 365;
    // How much is a given latitude tilted up (+) or down (-) toward the ecliptic?
    // -23.5 degrees on June solstice, 0 degrees at equinoxes, +23.5 degrees on December solstice.
    let orbitalTiltDegrees = this.props.earthTilt ? EARTH_TILT * RAD_2_DEG : 0;
    let effectiveTiltDegrees = -Math.cos(tiltAxisZRadians) * orbitalTiltDegrees;
    return 90 - (this.props.lat + effectiveTiltDegrees);
  }

  _drawRaysView() {
    let solarAngle = this.getNoonSolarAltitude();
    let width = $(this.canvas).width();
    let height = $(this.canvas).height();
    // Update canvas attributes (they can be undefined if canvas size is set using CSS).
    this.canvas.width = width;
    this.canvas.height = height;
    let skyHeight = SKY_FRACTION * height;
    let groundHeight = height - skyHeight;

    let skyGradient = this.ctx.createLinearGradient(0, 0, 0, 1);
    skyGradient.addColorStop(0, DARK_BLUE);
    skyGradient.addColorStop(1, LIGHT_BLUE);

    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, width, skyHeight);

    let groundGradient = this.ctx.createLinearGradient(0, 0, 0, 1);
    groundGradient.addColorStop(0, LIGHT_GREEN);
    groundGradient.addColorStop(1, DARK_GREEN);

    this.ctx.fillStyle = groundGradient;
    this.ctx.fillRect(0, skyHeight, width, groundHeight);

    if (solarAngle < 0 || solarAngle > 180) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, width, height);
      return;
    }

    // Longest possible line.
    let maxLength = Math.sqrt(skyHeight * skyHeight + width * width);
    let NUM_BEAMS = 10;
    let x;
    let dx = width / (NUM_BEAMS + 1) / Math.sin(solarAngle * Math.PI / 180);
    let lineRotationRadians = (90 - solarAngle) * (Math.PI / 180);

    this.ctx.strokeStyle = RAY_COLOR;
    this.ctx.fillStyle = RAY_COLOR;

    // Could be +/- Infinity when solarAngle is 0
    if (isFinite(dx)) {
      for (x = dx / 2; x < width; x += dx) {
        this.ctx.save();
        this.ctx.translate(x, skyHeight);
        this._drawLine(lineRotationRadians, 5, maxLength);
        this._drawArrow(lineRotationRadians);
        this.ctx.restore();
      }
    }

    let dy = Math.abs(width / (NUM_BEAMS + 1) / Math.cos(solarAngle * Math.PI / 180));
    let yInitial = solarAngle < 90 ? (dy / 2) : (((x - width) / dx) * dy);
    let xEdge = solarAngle < 90 ? 0 : width;
    if (isFinite(dy)) {
      for (let y = skyHeight - yInitial; y > 0; y -= dy) {
        this.ctx.save();
        this.ctx.translate(xEdge, y);
        this._drawLine(lineRotationRadians, 0, maxLength);
        this.ctx.restore();
      }
    }
  }
  
  _drawLine(angle, lengthAdjustment, maxLength) {
    this.ctx.save();

    this.ctx.rotate(angle);
    this.ctx.lineWidth = 4;

    this.ctx.beginPath();
    this.ctx.moveTo(0, -lengthAdjustment);
    this.ctx.lineTo(0, -maxLength);
    this.ctx.stroke();

    this.ctx.restore();
  }
  
  _drawArrow(angle) {
    this.ctx.save();

    this.ctx.rotate(angle);
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-10, -20);
    this.ctx.lineTo(0, -16);
    this.ctx.lineTo(10, -20);
    this.ctx.lineTo(0, 0);
    this.ctx.fill();

    this.ctx.restore();
  }
}
