import { GameClock } from "./game-clock.js";
import { createStrategicCalendar } from "./strategic-calendar.js";
import { Camera } from "../camera/camera.js";
import { createCommander } from "../entities/pawns/commander.js";
import { createCrewMember } from "../entities/pawns/crew-member.js";
import { createSuitForPawn } from "../entities/pawns/equipment/suit-factory.js";
import { createWorld } from "../world/world.js";
import { InputController } from "../player/input-controller.js";
import { Renderer } from "../rendering/renderer.js";
import { createDefaultActionRegistry } from "../actions/registry/default-actions.js";
import { ActionExecutor } from "../actions/execution/action-executor.js";

export function createGame({ canvas }) {
  const clock = new GameClock();
  const calendar = createStrategicCalendar();
  const world = createWorld();
  const commander = createCommander({ x: 24.5, y: 20.5 });
  // New Game starts with one basic suit so the commander can leave the outpost.
  commander.expeditionSuit = createSuitForPawn(commander, { id: "suit-commander-basic" });
  commander.expeditionSuit.state = "equipped";
  commander.expeditionSuit.location = { type: "pawn", pawnId: commander.id };

  const mira = createCrewMember({
    id: "crew-02",
    name: "Mira",
    x: 21.5,
    y: 24.5,
    color: "#e6b95f",
  });
  // Mira is the initial target dummy for weapon and damage balance testing.
  mira.expeditionSuit = createSuitForPawn(mira, {
    id: "suit-mira-basic",
    name: "Basic Expedition Suit",
  });
  mira.expeditionSuit.state = "equipped";
  mira.expeditionSuit.location = { type: "pawn", pawnId: mira.id };

  const crew = [commander, mira];
  const camera = new Camera();
  const renderer = new Renderer(canvas, world, crew, camera);
  const actionRegistry = createDefaultActionRegistry();
  const actionExecutor = new ActionExecutor(actionRegistry);
  const input = new InputController(canvas, crew, camera, clock, renderer, calendar);

  let frameId = 0;
  let previousTime = 0;
  let elapsed = 0;
  let running = false;

  function frame(timestamp) {
    if (!running) return;
    const realDelta = previousTime ? Math.min((timestamp - previousTime) / 1000, 0.05) : 0;
    previousTime = timestamp;
    const delta = clock.paused ? 0 : realDelta * clock.speed;
    elapsed += delta;

    input.update(delta);
    if (!clock.paused) {
      for (const pawn of crew) pawn.update(delta, world, crew);
    }
    camera.follow(commander, delta, commander.drafted && !camera.manual);
    renderer.render(elapsed, clock.paused, timestamp / 1000);

    document.querySelector("#clock-readout").textContent = formatClock(elapsed);
    document.querySelector("#calendar-readout").textContent = formatCalendar(calendar);
    document.querySelector("#coords-readout").textContent =
      `X ${String(Math.floor(commander.x)).padStart(3, "0")} · Y ${String(Math.floor(commander.y)).padStart(3, "0")}`;
    document.querySelector("#camera-readout").textContent = `ZOOM ${Math.round(camera.zoom * 100)}%`;
    document.querySelector("#unit-state").textContent = commander.drafted ? "DRAFTED" : "AUTONOMOUS";
    frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    frameId = requestAnimationFrame(frame);
  }
  function destroy() {
    running = false;
    cancelAnimationFrame(frameId);
    input.destroy();
  }
  return { start, destroy, clock, calendar, world, commander, crew, camera, actionRegistry, actionExecutor };
}

function formatClock(seconds) {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
}
function formatCalendar(calendar) {
  return `DAY ${String(calendar.day).padStart(3, "0")} · YEAR ${calendar.year}`;
}
