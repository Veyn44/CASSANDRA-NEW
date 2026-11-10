import { createGame } from "./core/game.js";

const canvas = document.querySelector("#game-canvas");
const game = createGame({ canvas });

game.start();

window.addEventListener("pagehide", () => game.destroy(), { once: true });
