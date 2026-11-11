import { meleeAttack } from "../definitions/expedition/common/melee-attack.js";

export function createDefaultActionRegistry() {
  const { ActionRegistry } = registryModule;
  const registry = new ActionRegistry();
  registry.register(meleeAttack);
  return registry;
}

import * as registryModule from "./action-registry.js";
