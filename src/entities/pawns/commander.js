import { moveEntity } from "../../navigation/movement.js";

export function createCommander({ x, y }) {
  return {
    id: "commander",
    name: "Commander",
    x, y,
    radius: 0.28,
    speed: 4.2,
    rotation: -Math.PI / 2,
    aimAngle: -Math.PI / 2,
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
    drafted: false,
    health: 100,
    maxHealth: 100,\n    stamina: 100,\n    maxStamina: 100,\n    carryCapacity: 30,\n    carriedWeight: 0,\n    weapon: null,
    commandOrder: "hold",
    commandRevision: 0,
    attackTimer: 0,
    attackCooldown: 0,
    update(delta, world) {
      moveEntity(this, delta, world);
      const angleDifference = Math.atan2(
        Math.sin(this.aimAngle - this.rotation),
        Math.cos(this.aimAngle - this.rotation)
      );
      const maxTurn = 9.5 * delta;
      this.rotation += Math.max(-maxTurn, Math.min(maxTurn, angleDifference));
      this.attackTimer = Math.max(0, this.attackTimer - delta);
      this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    },
    attack() {
      if (!this.drafted || this.attackCooldown > 0) return false;
      this.attackTimer = 0.2;
      this.attackCooldown = 1;
      return true;
    },
  };
}
