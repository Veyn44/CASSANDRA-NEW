import { ActionRegistry } from "./action-registry.js";
import { meleeAttack } from "../definitions/expedition/common/melee-attack.js";

export function createDefaultActionRegistry() {
  const registry = new ActionRegistry();
  registry.register(meleeAttack);
  return registry;
}
