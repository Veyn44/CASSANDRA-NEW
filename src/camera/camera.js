export class Camera {
  constructor() {
    this.x = 24.5;
    this.y = 20.5;
    this.zoom = 1;
    this.targetX = this.x;
    this.targetY = this.y;
    this.manual = false;
  }

  follow(target, delta, enabled = true) {
    if (enabled && !this.manual) {
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

  panByScreenDelta(deltaX, deltaY, tileSize) {
    const scale = tileSize * this.zoom;
    this.manual = true;
    this.targetX -= deltaX / scale;
    this.targetY -= deltaY / scale;
    this.x = this.targetX;
    this.y = this.targetY;
  }

  centerOn(target) {
    this.manual = false;
    this.targetX = target.x;
    this.targetY = target.y;
  }
}
