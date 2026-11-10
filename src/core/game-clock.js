/** Shared simulation clock. All gameplay systems consume scaled simulation delta. */
export class GameClock {
  constructor() {
    this.paused = false;
    this.speed = 1;
    this.lastSpeed = 1;
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
    if (!this.paused && this.speed === 0) this.speed = this.lastSpeed;
  }

  togglePause() {
    this.setPaused(!this.paused);
    return this.paused;
  }

  setSpeed(speed) {
    const nextSpeed = Math.max(0, Math.min(3, Number(speed) || 0));
    if (nextSpeed === 0) {
      if (this.speed > 0) this.lastSpeed = this.speed;
      this.speed = 0;
      this.paused = true;
      return;
    }
    this.speed = nextSpeed;
    this.lastSpeed = nextSpeed;
    this.paused = false;
  }
}
