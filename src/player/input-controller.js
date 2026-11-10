export class InputController {
  constructor(canvas, commander, camera, clock, renderer) {
    this.canvas = canvas;
    this.commander = commander;
    this.camera = camera;
    this.clock = clock;
    this.renderer = renderer;
    this.keys = new Set();
    this.dragging = false;
    this.lastPointer = null;
    this.onKeyDown = (event) => this.handleKeyDown(event);
    this.onKeyUp = (event) => this.keys.delete(event.key.toLowerCase());
    this.onWheel = (event) => {
      event.preventDefault();
      this.camera.setZoom(this.camera.zoom * (event.deltaY < 0 ? 1.1 : 0.9));
    };
    this.onPointerDown = (event) => {
      if (event.button === 1) {
        this.dragging = true;
        this.lastPointer = { x: event.clientX, y: event.clientY };
        event.preventDefault();
      }
    };
    this.onPointerMove = (event) => {
      if (!this.dragging || !this.lastPointer) return;
      const rect = this.canvas.getBoundingClientRect();
      const scale = this.renderer.tileSize * this.camera.zoom;
      this.camera.targetX -= (event.clientX - this.lastPointer.x) / scale;
      this.camera.targetY -= (event.clientY - this.lastPointer.y) / scale;
      this.camera.x = this.camera.targetX;
      this.camera.y = this.camera.targetY;
      this.camera.panX = 0;
      this.camera.panY = 0;
      this.lastPointer = { x: event.clientX, y: event.clientY };
    };
    this.onPointerUp = (event) => {
      if (event.button === 1) {
        this.dragging = false;
        this.lastPointer = null;
      }
    };

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    canvas.addEventListener("wheel", this.onWheel, { passive: false });
    canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    document.querySelector("#pause-button").addEventListener("click", () => this.togglePause());
    document.querySelector("#grid-button").addEventListener("click", () => {
      this.renderer.showGrid = !this.renderer.showGrid;
      document.querySelector("#grid-button").classList.toggle("active", this.renderer.showGrid);
      document.querySelector("#grid-button span").textContent = this.renderer.showGrid ? "ON" : "OFF";
    });
    document.querySelector("#center-button").addEventListener("click", () => this.camera.centerOn(this.commander));
    document.querySelectorAll("[data-speed]").forEach((button) => {
      button.addEventListener("click", () => {
        this.clock.setSpeed(Number(button.dataset.speed));
        this.syncPauseUI();
        this.syncSpeedUI();
      });
    });
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", " "].includes(key)) event.preventDefault();
    if (key === " " && !event.repeat) this.togglePause();
    if (key === "escape") this.clock.setPaused(true);
    this.keys.add(key);
  }

  update() {
    const x = Number(this.keys.has("d")) - Number(this.keys.has("a"));
    const y = Number(this.keys.has("s")) - Number(this.keys.has("w"));
    this.commander.velocityX = x;
    this.commander.velocityY = y;
    if (x || y) this.camera.panX = this.camera.panY = 0;
  }

  togglePause() {
    this.clock.togglePause();
    this.syncPauseUI();
    this.syncSpeedUI();
  }

  syncPauseUI() {
    document.querySelector("#pause-overlay").hidden = !this.clock.paused;
    document.querySelector("#pause-button").textContent = this.clock.paused ? "▶" : "Ⅱ";
  }

  syncSpeedUI() {
    document.querySelector("#speed-label").textContent = this.clock.paused ? "Ⅱ" : `${this.clock.speed}×`;
    document.querySelectorAll("[data-speed]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.speed) === (this.clock.paused ? 0 : this.clock.speed));
    });
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
  }
}
