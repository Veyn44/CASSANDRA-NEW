/** Simulation pause and time scale are independent controls. */
export class GameClock {
  constructor() {
    this.paused = false;
    this.speed = 1;
  }
  setPaused(paused) { this.paused = Boolean(paused); }
  togglePause() { this.paused = !this.paused; return this.paused; }
  setSpeed(speed) {
    const nextSpeed = Number(speed);
    if (Number.isFinite(nextSpeed) && nextSpeed > 0) this.speed = Math.max(0.25, Math.min(3, nextSpeed));
  }
}
