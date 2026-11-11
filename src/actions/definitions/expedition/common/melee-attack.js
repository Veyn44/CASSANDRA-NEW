export const meleeAttack = Object.freeze({
  id: "expedition.melee-attack",
  name: "Melee Attack",
  contexts: ["expedition"],
  category: "common",
  group: "combat",
  target: "optional",
  canExecute({ actor, gameState }) {
    return Boolean(actor?.drafted && !gameState?.clock?.paused && !gameState?.camera?.manual && actor.attackCooldown <= 0);
  },
  execute({ actor }) {
    return actor.attack();
  },
});
