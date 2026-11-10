import { endStrategicDay, setStrategicDay } from "../core/strategic-calendar.js";

export class InputController {
  constructor(canvas, pawns, camera, clock, renderer, calendar) {
    this.canvas = canvas;
    this.pawns = pawns;
    this.commander = pawns[0];
    this.camera = camera;
    this.clock = clock;
    this.renderer = renderer;
    this.calendar = calendar;
    this.devMode = false;
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
    document.querySelector("#pawn-info-button").addEventListener("click", () => {
      const pawn = this.pawns.find((item) => item.id === this.selectedPawnId) || this.commander;
      this.syncInfoModal(pawn);
      document.querySelector("#pawn-info-modal").hidden = false;
    });
    document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => {
      button.closest(".modal-backdrop").hidden = true;
    }));
    document.querySelector("#settings-modal").addEventListener("click", (event) => {
      if (event.target.id === "settings-modal") event.currentTarget.hidden = true;
    });
    document.querySelector("#pawn-info-modal").addEventListener("click", (event) => {
      if (event.target.id === "pawn-info-modal") event.currentTarget.hidden = true;
    });
    document.querySelector("#dev-mode-toggle").addEventListener("click", () => this.toggleDevMode());
    document.querySelector("#set-day-button").addEventListener("click", () => this.setDayFromDevTools());
    document.querySelector("#end-day-button").addEventListener("click", () => this.endDayFromDevTools());
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
        else this.clock.setSpeed(Number(button.dataset.speed));
        this.syncPauseUI();
        this.syncSpeedUI();
      });
    });
    document.querySelector("#crew-command-bar").addEventListener("click", (event) => {
      const button = event.target.closest("[data-order]");
      const card = event.target.closest(".crew-card");
      if (card && !card.classList.contains("empty-slot")) {
        const selected = this.pawns.find((item) => item.id === card.dataset.pawnId);
        if (selected && this.clock.paused) {
          this.selectedPawnId = selected.id;
          this.syncSelectedPawn();
        }
      }
      if (!button || !this.clock.paused) return;
      const pawn = this.pawns.find((item) => item.id === button.dataset.pawnId);
      if (!pawn) return;
      pawn.commandOrder = button.dataset.order;
      pawn.commandRevision += 1;
      this.selectedPawnId = pawn.id;
      this.syncCommandBar();
      this.syncSelectedPawn();
    });
    this.syncCommandBar();
    this.syncSelectedPawn();
    this.syncDraftUI();
    this.syncPauseUI();
    this.syncDevModeUI();
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", " "].includes(key)) event.preventDefault();
    if (key === " " && !event.repeat) this.togglePause();
    if (key === "f" && !event.repeat && !this.clock.paused) this.toggleDraft();
    if (key === "escape" && !event.repeat) {
      const settings = document.querySelector("#settings-modal");
      settings.hidden = !settings.hidden;
      if (!settings.hidden) {
        this.attackHeld = false;
        this.keys.clear();
      }
    }
    this.keys.add(key);
  }

  toggleDevMode() {
    this.devMode = !this.devMode;
    this.syncDevModeUI();
  }

  syncDevModeUI() {
    const button = document.querySelector("#dev-mode-toggle");
    const panel = document.querySelector("#dev-tools-panel");
    button.textContent = this.devMode ? "DEV MODE · ON" : "DEV MODE · OFF";
    button.setAttribute("aria-pressed", String(this.devMode));
    panel.hidden = !this.devMode;
    document.querySelector("#dev-day-input").value = String(this.calendar.day);
  }

  setDayFromDevTools() {
    if (!this.devMode) return;
    const input = document.querySelector("#dev-day-input");
    const nextDay = Number(input.value);
    if (!Number.isInteger(nextDay) || nextDay < 1 || nextDay > 365) {
      this.showToast("DAY MUST BE BETWEEN 1 AND 365");
      input.value = String(this.calendar.day);
      return;
    }
    setStrategicDay(this.calendar, nextDay);
    this.showToast(`CALENDAR SET TO DAY ${String(nextDay).padStart(3, "0")} · AGE UNCHANGED`);
  }

  endDayFromDevTools() {
    if (!this.devMode) return;
    const { day, agedPawns } = endStrategicDay(this.calendar, this.pawns);
    document.querySelector("#dev-day-input").value = String(this.calendar.day);
    for (const pawn of this.pawns) {
      if (pawn.id === this.selectedPawnId) this.syncInfoModal(pawn);
    }
    this.showToast(agedPawns.length
      ? `END DAY · BIRTHDAY: ${agedPawns.map((pawn) => pawn.name).join(", ")}`
      : `END DAY · DAY ${String(day).padStart(3, "0")}`);
  }

  showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(this.toastTimeout);
    this.toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 1500);
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

  showAttackFeedback() { this.showToast("MELEE ATTACK"); }

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
    if (x !== 0 || y !== 0) this.camera.centerOn(this.commander);
    this.tryAttack();
  }

  togglePause() {
    this.clock.togglePause();
    this.attackHeld = false;
    if (this.clock.paused) {
      this.commander.velocityX = 0;
      this.commander.velocityY = 0;
    }
    this.syncPauseUI();
    this.syncSpeedUI();
    this.syncCommandBar();
    if (!this.clock.paused) {
      this.selectedPawnId = this.commander.id;
      this.syncSelectedPawn();
    }
  }

  syncSelectedPawn() {
    const pawn = this.pawns.find((item) => item.id === this.selectedPawnId) || this.commander;
    const setText = (id, value) => { const node = document.querySelector(id); if (node) node.textContent = value; };
    const setBar = (id, value) => { const node = document.querySelector(id); if (node) node.style.width = `${Math.max(0, Math.min(100, value))}%`; };
    setText("#selected-name", pawn.name.toUpperCase());
    setText("#selected-role", `Human · Age ${pawn.age}`);
    setText("#unit-state", pawn.drafted ? "DRAFTED" : "AUTONOMOUS");
    setText("#selected-health", `${pawn.health} / ${pawn.maxHealth}`);
    setText("#selected-stamina", `${pawn.stamina} / ${pawn.maxStamina}`);
    setText("#selected-carry", `${pawn.carriedWeight} / ${pawn.carryCapacity} kg`);
    setText("#selected-weapon", pawn.weapon?.name || "UNARMED");
    setText("#selected-order", pawn.commandOrder.toUpperCase());
    setBar("#selected-health-bar", pawn.health / pawn.maxHealth * 100);
    setBar("#selected-stamina-bar", pawn.stamina / pawn.maxStamina * 100);
    setBar("#selected-carry-bar", pawn.carriedWeight / pawn.carryCapacity * 100);
    const portrait = document.querySelector("#selected-portrait span");
    if (portrait) portrait.textContent = pawn.name.slice(0, 1).toUpperCase();
    const info = document.querySelector("#pawn-info-modal");
    if (info && !info.hidden) this.syncInfoModal(pawn);
    document.querySelectorAll(".crew-card[data-pawn-id]").forEach((card) => card.classList.toggle("selected-pawn", card.dataset.pawnId === pawn.id));
  }

  syncInfoModal(pawn) {
    const values = {
      "#info-title": pawn.name.toUpperCase(),
      "#info-age": `${pawn.age} YEARS`,
      "#info-birthday": `DAY ${String(pawn.birthdayDay).padStart(3, "0")}`,
      "#info-health": `${pawn.health} / ${pawn.maxHealth}`,
      "#info-stamina": `${pawn.stamina} / ${pawn.maxStamina}`,
      "#info-carry": `${pawn.carriedWeight} / ${pawn.carryCapacity} kg`,
      "#info-weapon": pawn.weapon?.name || "UNARMED",
      "#info-order": pawn.commandOrder.toUpperCase(),
      "#info-position": `${pawn.x.toFixed(2)}, ${pawn.y.toFixed(2)}`
    };
    for (const [selector, value] of Object.entries(values)) {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    }
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
    document.querySelector("#speed-label").textContent = `${this.clock.speed}×`;
    document.querySelectorAll("[data-speed]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.speed) === (Number(button.dataset.speed) === 0 ? 0 : this.clock.speed));
    });
    document.querySelector("#pause-button").classList.toggle("paused", this.clock.paused);
  }

  syncCommandBar() {
    const bar = document.querySelector("#crew-command-bar");
    bar.classList.toggle("commands-enabled", this.clock.paused);
    bar.querySelectorAll("[data-order]").forEach((button) => {
      const pawn = this.pawns.find((item) => item.id === button.dataset.pawnId);
      button.disabled = !this.clock.paused || !pawn;
      button.classList.toggle("selected", pawn?.commandOrder === button.dataset.order);
    });
    bar.querySelectorAll(".crew-card").forEach((card) => {
      const pawn = this.pawns.find((item) => item.id === card.dataset.pawnId);
      const order = card.querySelector(".crew-order");
      if (pawn && order) order.textContent = pawn.commandOrder.toUpperCase();
      if (pawn) {
        const health = card.querySelector(".crew-bar.health i");
        const carry = card.querySelector(".crew-bar.carry i");
        if (health) health.style.width = `${pawn.health / pawn.maxHealth * 100}%`;
        if (carry) carry.style.width = `${pawn.carriedWeight / pawn.carryCapacity * 100}%`;
      }
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
