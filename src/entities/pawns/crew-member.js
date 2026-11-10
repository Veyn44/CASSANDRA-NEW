import { moveEntity } from "../../navigation/movement.js";

export function createCrewMember({ id, name, x, y, color = "#e6b95f" }) {
  return {
    id, name, x, y, color,
    radius: 0.28,
    speed: 3.8,
    rotation: Math.PI / 2,
    aimAngle: Math.PI / 2,
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
    drafted: false,
    health: 100,
    maxHealth: 100,
    commandOrder: "hold",
    commandRevision: 0,
    attackTimer: 0,
    attackCooldown: 0,
    update(delta, world) {
      moveEntity(this, delta, world);
      const difference = Math.atan2(
        Math.sin(this.aimAngle - this.rotation),
        Math.cos(this.aimAngle - this.rotation)
      );
      const maxTurn = 9.5 * delta;
      this.rotation += Math.max(-maxTurn, Math.min(maxTurn, difference));
      this.attackTimer = Math.max(0, this.attackTimer - delta);
      this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    },
  };
}
