import { BODY_PART_BASE_HP } from "../physical/body-parts.js";

// Each expedition-suit section starts at exactly half the matching body-part HP.
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
      },
    ])
  );
}
