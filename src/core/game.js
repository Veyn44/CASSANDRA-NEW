import { GameClock } from "./game-clock.js";
import { Camera } from "../camera/camera.js";
import { createCommander } from "../entities/pawns/commander.js";
import { createWorld } from "../world/world.js";
import { InputController } from "../player/input-controller.js";
import { Renderer } from "../rendering/renderer.js";

export function createGame({ canvas }) {
  const clock = new GameClock();
  const world = createWorld();
  const commander = createCommander({ x: 24.5, y: 20.5 });
  const camera = new Camera();
  const renderer = new Renderer(canvas, world, commander, camera);
  const input = new InputController(canvas, commander, camera, clock, renderer);

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
    commander.update(delta, world);
    camera.follow(commander, delta);
    renderer.render(elapsed, clock.paused);

    document.querySelector("#clock-readout").textContent = formatClock(elapsed);
    document.querySelector("#coords-readout").textContent =
      `X ${String(Math.floor(commander.x)).padStart(3, "0")} · Y ${String(Math.floor(commander.y)).padStart(3, "0")}`;
    document.querySelector("#camera-readout").textContent = `ZOOM ${Math.round(camera.zoom * 100)}%`;
    document.querySelector("#unit-state").textContent = clock.paused ? "PAUSED" : commander.isMoving ? "MOVING" : "READY";

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

  return { start, destroy, clock, world, commander, camera };
}

function formatClock(seconds) {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
}
