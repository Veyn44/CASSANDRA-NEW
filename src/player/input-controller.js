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
    this.cameraReturnTimeout = null;

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
        return;
      }
      if (event.button === 0 && this.commander.drafted) {
        this.updateAim(event);
        if (this.commander.attack()) this.showAttackFeedback();
      }
    };
    this.onPointerMove = (event) => {
      this.updateAim(event);
      if (!this.dragging || !this.lastPointer) return;
      this.camera.panByScreenDelta(
        event.clientX - this.lastPointer.x,
        event.clientY - this.lastPointer.y,
        this.renderer.tileSize
      );
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.scheduleCameraReturn();
    };
    this.onPointerUp = (event) => {
      if (event.button === 1) {
        this.dragging = false;
        this.lastPointer = null;
        this.scheduleCameraReturn();
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
    document.querySelector("#center-button").addEventListener("click", () => {
      this.camera.centerOn(this.commander);
      this.syncDraftUI();
    });
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
    if (key === "f" && !event.repeat) this.toggleDraft();
    if (key === "escape") {
      this.clock.setPaused(true);
      this.syncPauseUI();
      this.syncSpeedUI();
    }
    this.keys.add(key);
  }

  toggleDraft() {
    this.commander.drafted = !this.commander.drafted;
    this.commander.velocityX = 0;
    this.commander.velocityY = 0;
    this.keys.delete("w");
    this.keys.delete("a");
    this.keys.delete("s");
    this.keys.delete("d");

    window.clearTimeout(this.cameraReturnTimeout);
    if (this.commander.drafted) {
      this.camera.centerOn(this.commander);
    } else {
      // Leave the camera where it is; the pawn returns to autonomous idle.
      this.camera.manual = true;
    }
    this.syncDraftUI();
  }

  scheduleCameraReturn() {
    window.clearTimeout(this.cameraReturnTimeout);
    if (!this.commander.drafted) return;
    this.cameraReturnTimeout = window.setTimeout(() => {
      if (this.commander.drafted) this.camera.centerOn(this.commander);
    }, 1800);
  }

  updateAim(event) {
    if (!this.commander.drafted) return;
    const rect = this.canvas.getBoundingClientRect();
    const tile = this.renderer.tileSize * this.camera.zoom;
    const mouseWorldX = this.camera.x + (event.clientX - rect.left - rect.width / 2) / tile;
    const mouseWorldY = this.camera.y + (event.clientY - rect.top - rect.height / 2) / tile;
    this.commander.aimAngle = Math.atan2(
      mouseWorldY - this.commander.y,
      mouseWorldX - this.commander.x
    );
  }

  showAttackFeedback() {
    const toast = document.querySelector("#toast");
    toast.textContent = "MELEE ATTACK";
    toast.classList.add("visible");
    window.clearTimeout(this.toastTimeout);
    this.toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 420);
  }

  update() {
    if (!this.commander.drafted) {
      this.commander.velocityX = 0;
      this.commander.velocityY = 0;
      return;
    }
    const x = Number(this.keys.has("d")) - Number(this.keys.has("a"));
    const y = Number(this.keys.has("s")) - Number(this.keys.has("w"));
    this.commander.velocityX = x;
    this.commander.velocityY = y;
  }

  togglePause() {
    this.clock.togglePause();
    this.syncPauseUI();
    this.syncSpeedUI();
  }

  syncDraftUI() {
    const button = document.querySelector("#draft-button");
    const state = document.querySelector("#unit-state");
    button?.classList.toggle("active", this.commander.drafted);
    button?.setAttribute("aria-pressed", String(this.commander.drafted));
    button?.querySelector("span") && (button.querySelector("span").textContent = this.commander.drafted ? "ON" : "OFF");
    state.textContent = this.commander.drafted ? "DRAFTED" : "AUTONOMOUS";
    state.classList.toggle("drafted", this.commander.drafted);
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
    window.clearTimeout(this.toastTimeout);
    window.clearTimeout(this.cameraReturnTimeout);
  }
}
