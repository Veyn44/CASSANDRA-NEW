import { moveEntity } from "../../navigation/movement.js";
import { createPawnIdentity } from "./identity/identity.js";
import { createBodyParts, PAWN_BASE_MAX_HP } from "./physical/body-parts.js";

export function createCommander({ x, y, age, birthdayDay }) {
  return {
    id: "commander",
    ...createPawnIdentity({ name: "Commander", age, birthdayDay }),
    x, y,
    bodyParts: createBodyParts(),
    secondaryWeapon: null,
    utilityItem: null,
    personalItems: Array.from({ length: 6 }, (_, index) => ({ slot: index + 1, item: null })),
    radius: 0.28,
    speed: 4.2,
    rotation: -Math.PI / 2,
    aimAngle: -Math.PI / 2,
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
    drafted: false,
    health: PAWN_BASE_MAX_HP,
    maxHealth: PAWN_BASE_MAX_HP,
    stamina: 100,
    maxStamina: 100,
    carryCapacity: 30,
    carriedWeight: 0,
    weapon: null,
    expeditionSuit: null,
    expeditionSuitStationId: null,
    commandOrder: "hold",
    commandRevision: 0,
    attackTimer: 0,
    attackCooldown: 0,
    update(delta, world, pawns = []) {
      moveEntity(this, delta, world, pawns);
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
