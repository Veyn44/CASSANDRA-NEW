export class Camera {
  constructor() {
    this.x = 24.5;
    this.y = 20.5;
    this.zoom = 1;
    this.targetX = this.x;
    this.targetY = this.y;
    this.panX = 0;
    this.panY = 0;
  }

  follow(target, delta) {
    if (this.panX || this.panY) {
      this.targetX += this.panX * delta;
      this.targetY += this.panY * delta;
    } else {
      this.targetX = target.x;
      this.targetY = target.y;
    }
    const smoothing = 1 - Math.exp(-8 * delta);
    this.x += (this.targetX - this.x) * smoothing;
    this.y += (this.targetY - this.y) * smoothing;
  }

  setZoom(value) {
    this.zoom = Math.max(0.55, Math.min(2.2, value));
  }

  centerOn(target) {
    this.targetX = target.x;
    this.targetY = target.y;
    this.panX = 0;
    this.panY = 0;
  }
}
