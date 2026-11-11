export class ActionRegistry {
  constructor() {
    this.actions = new Map();
  }

  register(action) {
    if (!action || typeof action.id !== "string" || !action.id.trim()) {
      throw new TypeError("An action must have a non-empty id.");
    }
    if (this.actions.has(action.id)) {
      throw new Error(`Action already registered: ${action.id}`);
    }
    if (typeof action.execute !== "function") {
      throw new TypeError(`Action ${action.id} must define execute(context).`);
    }
    const contexts = Array.isArray(action.contexts) ? action.contexts : [action.context];
    if (!contexts.length || contexts.some((value) => typeof value !== "string" || !value)) {
      throw new TypeError(`Action ${action.id} must define at least one context.`);
    }
    this.actions.set(action.id, Object.freeze({ ...action, contexts: Object.freeze([...contexts]) }));
    return this.actions.get(action.id);
  }

  getAction(id) {
    return this.actions.get(id) || null;
  }

  getActionsByContext(context) {
    return [...this.actions.values()].filter((action) => action.contexts.includes(context));
  }

  getActionsByCategory(category) {
    return [...this.actions.values()].filter((action) => action.category === category);
  }

  getAvailableActions(context, actionContext = {}) {
    return this.getActionsByContext(context).filter((action) => {
      if (typeof action.canExecute !== "function") return true;
      return action.canExecute(actionContext) === true;
    });
  }
}
