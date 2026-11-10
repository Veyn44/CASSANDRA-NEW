/** Shared simulation clock. All gameplay systems consume scaled simulation delta. */
export class GameClock {
  constructor() {
    this.paused = false;
    this.speed = 1;
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
  }

  togglePause() {
    this.paused = !this.paused;
    return this.paused;
  }

  setSpeed(speed) {
    this.speed = Math.max(0, Math.min(3, Number(speed) || 0));
    this.paused = this.speed === 0;
  }
}
