import $ from 'jquery';
import {SUMMER_SOLSTICE, sunrayAngle} from '../solar-system-data.js';

const DARK_BLUE = '#6E9CEF';
const LIGHT_BLUE = '#99ADF1';
const LIGHT_GREEN = '#84A44A';
const DARK_GREEN = '#4C7F19';
const DIST_MARKER_COLOR = '#87C2E8';
const SKY_FRACTION = 0.8;

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
      this._drawRaysView();
    }
  }

  // Resizes canvas to fill its parent.
  resize() {
    let $parent = $(this.canvas).parent();
    this.width = $parent.width();
    this.height = $parent.height();
    // Update canvas attributes (they can be undefined if canvas size is set using CSS).
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this._drawRaysView();
  }

  _drawRaysView() {
    let solarAngle = sunrayAngle(this.props.day, this.props.earthTilt, this.props.lat);
    let width = this.width;
    let height = this.height;
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

    this.ctx.strokeStyle = this.props.sunrayColor;
    this.ctx.fillStyle = this.props.sunrayColor;

    // Could be +/- Infinity when solarAngle is 0
    if (isFinite(dx)) {
      let idx = 0;
      for (x = dx / 2; x < width; x += dx, idx += 1) {
        //this.ctx.fillStyle = idx == middleVisBeam || idx == middleVisBeam - 1 ? 'red' : this.props.sunrayColor;
        this.ctx.save();
        this.ctx.translate(x, skyHeight);
        this._drawLine(lineRotationRadians, 5, maxLength);
        this._drawArrow(lineRotationRadians);
        this.ctx.restore();
      }

      if (this.props.sunrayDistMarker) {
        let numOfVisBeams = Math.floor((width - dx / 2) / dx) + 1;
        let middleVisBeam1 = dx / 2 + dx * (Math.floor(numOfVisBeams / 2) - 1);
        let middleVisBeam2 = middleVisBeam1 + dx;
        this._drawRaysDistMarker(middleVisBeam1, middleVisBeam2, skyHeight, 0.5 * groundHeight);
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
  
  _drawArrow(angle, scaleX=1, scaleY=1) {
    this.ctx.save();

    this.ctx.rotate(angle);
    this.ctx.scale(scaleX, scaleY);
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

  _drawRaysDistMarker(x1, x2, y, height) {
    this.ctx.save();

    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = DIST_MARKER_COLOR;
    this.ctx.fillStyle = DIST_MARKER_COLOR;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y);
    this.ctx.lineTo(x1, y + height);
    this.ctx.moveTo(x2, y);
    this.ctx.lineTo(x2, y + height);
    this.ctx.moveTo(x1, y + 0.5 * height);
    this.ctx.lineTo(x2, y + 0.5 * height);
    this.ctx.stroke();

    this.ctx.translate(x1, y + 0.5 * height);
    this._drawArrow(Math.PI / 2, 0.9, 0.7);
    this.ctx.translate(x2 - x1, 0);
    this._drawArrow(-Math.PI / 2, 0.9, 0.7);

    this.ctx.restore();
  }
}
