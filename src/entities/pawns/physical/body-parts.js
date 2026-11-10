// Base anatomy for a pawn. Values are design defaults, not final balance.
export const BODY_PART_BASE_HP = Object.freeze({
  head: 30,
  torso: 40,
  leftArm: 20,
  rightArm: 20,
  leftLeg: 20,
  rightLeg: 20,
});

export const PAWN_BASE_MAX_HP = Object.values(BODY_PART_BASE_HP).reduce(
  (total, hp) => total + hp,
  0
);

export function createBodyParts() {
  return Object.fromEntries(
    Object.entries(BODY_PART_BASE_HP).map(([part, maxHp]) => [
      part,
      {
        hp: maxHp,
        maxHp,
        bodyType: null,
        status: null,
      },
    ])
  );
}
