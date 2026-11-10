import { createExpeditionSuitParts, EXPEDITION_SUIT_BASE_MAX_HP } from "./expedition-suit-parts.js";

export const EXPEDITION_SUIT_STATES = Object.freeze({
  STORED: "stored",
  EQUIPPED: "equipped",
  DROPPED: "dropped",
});

export function createExpeditionSuit({ id, ownerPawnId, name = "Expedition Suit" }) {
  if (!id) throw new Error("Expedition suit requires an id.");
  if (!ownerPawnId) throw new Error("Expedition suit requires an owner pawn id.");

  return {
    id,
    name,
    ownerPawnId,
    state: EXPEDITION_SUIT_STATES.STORED,
    location: { type: "station", stationId: null },
    parts: createExpeditionSuitParts(),
    maxHp: EXPEDITION_SUIT_BASE_MAX_HP,
    get currentHp() {
      return Object.values(this.parts).reduce((total, part) => total + part.hp, 0);
    },
  };
}
