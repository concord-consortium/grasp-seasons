import models from './models.js';
import * as data from './data.js';

export default class {

  constructor(canvasEl) {
    var width = canvasEl.clientWidth;
    var height = canvasEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.earthOrbitalRadius * 10);
    this.renderer = new THREE.WebGLRenderer({canvas: canvasEl, antialias: true});
    this.renderer.setSize(width, height);

    this.controls = new THREE.OrbitControls(this.camera, canvasEl);
    this.controls.noPan = true;
    this.controls.noZoom = true;
    this.controls.rotateSpeed = 0.5;

    this.controls.addEventListener('change', function () {
      if (this.onCameraChange) {
        var camVec = this.camera.position.clone().sub(this.earthPos.position).normalize();
        this.onCameraChange(camVec);
      }
    }.bind(this));

    this._initScene();
    this._setInitialCamPos();

    this.setDay(0);
    this.setEarthTilt(true);
    this.render();
  }

  _initScene() {
    this.scene.add(models.stars());
    this.scene.add(models.ambientLight());
    this.scene.add(models.sunLight());
    this.scene.add(models.sunOnlyLight());
    this.scene.add(models.orbit());
    this.scene.add(models.sun());

    this.earth = models.earth();
    this.earthAxis = models.earthAxis();
    this.earth.add(this.earthAxis);

    this.earthPos = new THREE.Object3D();
    this.earthPos.add(models.grid({size: data.earthOrbitalRadius / 8, steps: 15}));
    this.earthPos.add(this.earth);
    this.scene.add(this.earthPos);
  }

  _setInitialCamPos() {
    this.camera.position.x = -128207750 / data.scaleFactor;
    this.camera.position.y = 5928580 / data.scaleFactor;
    this.camera.position.z = 24799310 / data.scaleFactor;
  }

  setDay(day) {
    var pos = data.earthEllipseLocationByDay(day);

    if (this.day != null) {
      var angle = Math.atan2(this.earthPos.position.z, this.earthPos.position.x) - Math.atan2(pos.z, pos.x);
      // Make sure that earth maintains its rotation.
      this.earth.rotateY(angle);
      // Update camera position, rotate it and adjust its orbit length.
      this.rotateCam(angle);
      var oldOrbitLength = new THREE.Vector2(this.earthPos.position.x, this.earthPos.position.z).length();
      var newOrbitLength = new THREE.Vector2(pos.x, pos.z).length();
      this.camera.position.x *= newOrbitLength / oldOrbitLength;
      this.camera.position.z *= newOrbitLength / oldOrbitLength;
    }

    this.earthPos.position.x = pos.x;
    this.earthPos.position.z = pos.z;

    // Set camera target to new position too.
    this.controls.target.x = pos.x;
    this.controls.target.z = pos.z;
    this.controls.update();

    this.day = day;
  }

  setEarthTilt(tilt) {
    this.earth.rotation.z = tilt ? 0.41 : 0; // 0.41 rad = 23.5 deg
  }

  rotateCam(angle) {
    var p = this.camera.position;
    var newZ = p.z * Math.cos(angle) - p.x * Math.sin(angle);
    var newX = p.z * Math.sin(angle) + p.x * Math.cos(angle);
    this.camera.position.x = newX;
    this.camera.position.z = newZ;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}
