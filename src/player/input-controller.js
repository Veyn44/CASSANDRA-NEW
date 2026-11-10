export class InputController {
  constructor(canvas, pawns, camera, clock, renderer) {
    this.canvas = canvas;
    this.pawns = pawns;
    this.commander = pawns[0];
    this.camera = camera;
    this.clock = clock;
    this.renderer = renderer;
    this.keys = new Set();
    this.dragging = false;
    this.lastPointer = null;
    this.attackHeld = false;
    this.selectedPawnId = this.commander.id;
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
      if (event.button === 0 && this.commander.drafted && !this.clock.paused && !this.camera.manual) {
        this.attackHeld = true;
        this.updateAim(event);
        this.tryAttack();
      }
    };
    this.onPointerMove = (event) => {
      if (this.commander.drafted && !this.clock.paused && !this.camera.manual) this.updateAim(event);
      if (!this.dragging || !this.lastPointer) return;
      this.camera.panByScreenDelta(
        event.clientX - this.lastPointer.x,
        event.clientY - this.lastPointer.y,
        this.renderer.tileSize
      );
      this.lastPointer = { x: event.clientX, y: event.clientY };
    };
    this.onPointerUp = (event) => {
      if (event.button === 0) this.attackHeld = false;
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
    window.addEventListener("blur", () => { this.attackHeld = false; this.keys.clear(); });
    document.querySelector("#pause-button").addEventListener("click", () => this.togglePause());
    document.querySelector("#draft-button").addEventListener("click", () => this.toggleDraft());
    document.querySelector("#grid-button").addEventListener("click", () => {
      this.renderer.showGrid = !this.renderer.showGrid;
      document.querySelector("#grid-button").classList.toggle("active", this.renderer.showGrid);
      document.querySelector("#grid-button span").textContent = this.renderer.showGrid ? "ON" : "OFF";
    });
    document.querySelector("#center-button").addEventListener("click", () => this.camera.centerOn(this.commander));
    document.querySelectorAll("[data-speed]").forEach((button) => {
      button.addEventListener("click", () => {
        if (Number(button.dataset.speed) === 0) this.clock.setPaused(true);
        else { this.clock.setSpeed(Number(button.dataset.speed)); this.clock.setPaused(false); }
        this.syncPauseUI();
        this.syncSpeedUI();
      });
    });
    document.querySelector("#crew-command-bar").addEventListener("click", (event) => {
      const button = event.target.closest("[data-order]");
      if (!button || !this.clock.paused) return;
      const pawn = this.pawns.find((item) => item.id === button.dataset.pawnId);
      if (!pawn) return;
      pawn.commandOrder = button.dataset.order;
      pawn.commandRevision += 1;
      this.selectedPawnId = pawn.id;
      this.syncCommandBar();
    });
    this.syncCommandBar();
    this.syncDraftUI();
    this.syncPauseUI();
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", " "].includes(key)) event.preventDefault();
    if (key === " " && !event.repeat) this.togglePause();
    if (key === "f" && !event.repeat && !this.clock.paused) this.toggleDraft();
    if (key === "escape") {
      this.clock.setPaused(true);
      this.syncPauseUI();
      this.syncSpeedUI();
    }
    this.keys.add(key);
  }

  toggleDraft() {
    if (this.clock.paused) return;
    this.commander.drafted = !this.commander.drafted;
    this.commander.velocityX = 0;
    this.commander.velocityY = 0;
    this.keys.delete("w"); this.keys.delete("a"); this.keys.delete("s"); this.keys.delete("d");
    this.attackHeld = false;
    if (this.commander.drafted) this.camera.centerOn(this.commander);
    this.syncDraftUI();
  }

  updateAim(event) {
    const rect = this.canvas.getBoundingClientRect();
    const tile = this.renderer.tileSize * this.camera.zoom;
    const mouseWorldX = this.camera.x + (event.clientX - rect.left - rect.width / 2) / tile;
    const mouseWorldY = this.camera.y + (event.clientY - rect.top - rect.height / 2) / tile;
    this.commander.aimAngle = Math.atan2(mouseWorldY - this.commander.y, mouseWorldX - this.commander.x);
  }

  tryAttack() {
    if (!this.attackHeld || this.clock.paused || !this.commander.drafted || this.camera.manual) return;
    if (this.commander.attack()) this.showAttackFeedback();
  }

  showAttackFeedback() {
    const toast = document.querySelector("#toast");
    toast.textContent = "MELEE ATTACK";
    toast.classList.add("visible");
    window.clearTimeout(this.toastTimeout);
    this.toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 420);
  }

  update() {
    if (this.clock.paused || !this.commander.drafted) {
      this.commander.velocityX = 0;
      this.commander.velocityY = 0;
      this.attackHeld = false;
      return;
    }
    const x = Number(this.keys.has("d")) - Number(this.keys.has("a"));
    const y = Number(this.keys.has("s")) - Number(this.keys.has("w"));
    this.commander.velocityX = x;
    this.commander.velocityY = y;
    if (x !== 0 || y !== 0) {
      // Any fresh WASD input restores direct camera follow without toggling Draft.
      this.camera.centerOn(this.commander);
    }
    this.tryAttack();
  }

  togglePause() {
    this.clock.togglePause();
    this.attackHeld = false;
    this.keys.clear();
    if (this.clock.paused) {
      this.commander.velocityX = 0;
      this.commander.velocityY = 0;
    }
    this.syncPauseUI();
    this.syncSpeedUI();
    this.syncCommandBar();
  }

  syncDraftUI() {
    const button = document.querySelector("#draft-button");
    const state = document.querySelector("#unit-state");
    button?.classList.toggle("active", this.commander.drafted);
    button?.setAttribute("aria-pressed", String(this.commander.drafted));
    const label = button?.querySelector("span");
    if (label) label.textContent = this.commander.drafted ? "ON" : "OFF";
    state.textContent = this.commander.drafted ? "DRAFTED" : "AUTONOMOUS";
    state.classList.toggle("drafted", this.commander.drafted);
  }

  syncPauseUI() {
    const paused = this.clock.paused;
    const status = document.querySelector("#game-status");
    status.textContent = paused ? "PAUSED" : "LIVE";
    status.classList.toggle("paused", paused);
    document.querySelector("#pause-button").textContent = paused ? "▶" : "Ⅱ";
    document.querySelector("#pause-button").setAttribute("aria-label", paused ? "Resume" : "Pause");
  }

  syncSpeedUI() {
    document.querySelector("#speed-label").textContent = this.clock.paused ? "Ⅱ" : `${this.clock.speed}×`;
    document.querySelectorAll("[data-speed]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.speed) === (this.clock.paused ? 0 : this.clock.speed));
    });
  }

  syncCommandBar() {
    const bar = document.querySelector("#crew-command-bar");
    bar.classList.toggle("commands-enabled", this.clock.paused);
    bar.querySelectorAll("[data-order]").forEach((button) => {
      const pawn = this.pawns.find((item) => item.id === button.dataset.pawnId);
      button.disabled = !this.clock.paused;
      button.classList.toggle("selected", pawn?.commandOrder === button.dataset.order);
    });
    bar.querySelectorAll(".crew-card").forEach((card) => {
      const pawn = this.pawns.find((item) => item.id === card.dataset.pawnId);
      const order = card.querySelector(".crew-order");
      if (pawn && order) order.textContent = pawn.commandOrder.toUpperCase();
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
  }
}
