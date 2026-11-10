import { createExpeditionSuit } from "./expedition-suit.js";

export function createSuitForPawn(pawn, { id = `${pawn.id}-expedition-suit`, name } = {}) {
  if (!pawn?.id) throw new Error("A valid pawn is required to create its expedition suit.");
  return createExpeditionSuit({ id, ownerPawnId: pawn.id, name });
}
