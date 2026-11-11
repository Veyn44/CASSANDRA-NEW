import { validateAction } from "./action-validation.js";

export class ActionExecutor {
  constructor(registry) {
    this.registry = registry;
  }

  execute(actionId, context = {}) {
    const action = this.registry.getAction(actionId);
    const validation = validateAction(action, context);
    if (!validation.valid) return { success: false, reason: validation.reason };

    if (action.cost && typeof context.payCost === "function") {
      context.payCost(action.cost);
    }

    const result = action.execute(context);
    if (result === false) {
      return { success: false, reason: "Action could not be completed." };
    }
    return { success: true, result };
  }
}
