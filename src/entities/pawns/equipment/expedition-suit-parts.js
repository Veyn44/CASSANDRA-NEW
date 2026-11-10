import { BODY_PART_BASE_HP } from "../physical/body-parts.js";

// Suit protection has a fixed 50% of the matching base anatomy HP.
// Suit HP is independent and is never recalculated from current body-part HP.
export const EXPEDITION_SUIT_PART_BASE_HP = Object.freeze(
  Object.fromEntries(
    Object.entries(BODY_PART_BASE_HP).map(([part, hp]) => [part, hp / 2])
  )
);

export const EXPEDITION_SUIT_BASE_MAX_HP = Object.values(
  EXPEDITION_SUIT_PART_BASE_HP
).reduce((total, hp) => total + hp, 0);

export function createExpeditionSuitParts() {
  return Object.fromEntries(
    Object.entries(EXPEDITION_SUIT_PART_BASE_HP).map(([part, maxHp]) => [
      part,
      {
        hp: maxHp,
        maxHp,
        status: null,
        module: null,
      },
    ])
  );
}
