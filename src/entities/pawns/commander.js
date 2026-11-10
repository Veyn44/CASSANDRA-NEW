import { moveEntity } from "../../navigation/movement.js";

export function createCommander({ x, y }) {
  return {
    id: "commander",
    name: "Commander",
    x,
    y,
    radius: 0.28,
    speed: 4.2,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
    update(delta, world) {
      moveEntity(this, delta, world);
    },
  };
}
