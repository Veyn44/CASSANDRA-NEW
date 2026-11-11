export function validateAction(action, context = {}) {
  if (!action) return { valid: false, reason: "Action not found." };
  if (!context.context || !action.contexts.includes(context.context)) {
    return { valid: false, reason: "Action is not available in this context." };
  }
  if (action.target === "required" && context.target == null) {
    return { valid: false, reason: "This action requires a target." };
  }
  if (typeof action.canExecute === "function" && action.canExecute(context) !== true) {
    return { valid: false, reason: "Action requirements are not met." };
  }
  if (action.cost && typeof context.canAfford === "function" && !context.canAfford(action.cost)) {
    return { valid: false, reason: "Insufficient resources for this action." };
  }
  return { valid: true, reason: null };
}
