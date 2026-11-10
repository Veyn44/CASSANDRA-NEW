import {
  PROFESSION_BASE_AP,
  PROFESSION_AP_PER_MASTERY_STAR,
  PROFESSION_EFFICIENCY_PER_LEVEL,
  PROFESSION_IDS,
  PROFESSION_MAX_LEVEL,
  PROFESSION_XP_PER_LEVEL,
} from "./definitions.js";

export function createProfessionProgression() {
  return Object.fromEntries(
    PROFESSION_IDS.map((professionId) => [
      professionId,
      {
        level: 1,
        xp: 0,
        xpToNextLevel: PROFESSION_XP_PER_LEVEL,
        masteryStars: 0,
        baseAP: PROFESSION_BASE_AP,
      },
    ])
  );
}

export function getProfessionEfficiency(profession) {
  if (!profession) return 0;
  return profession.level * PROFESSION_EFFICIENCY_PER_LEVEL;
}

export function getProfessionAP(profession) {
  if (!profession) return 0;
  return profession.baseAP + profession.masteryStars * PROFESSION_AP_PER_MASTERY_STAR;
}

export function addProfessionXP(professions, professionId, amount) {
  const current = professions?.[professionId];
  if (!current || !Number.isFinite(amount) || amount <= 0) {
    return { professions, levelsGained: 0 };
  }

  const nextProfessions = { ...professions };
  const nextProfession = { ...current };
  let remainingXP = amount;
  let levelsGained = 0;

  while (remainingXP > 0 && nextProfession.level < PROFESSION_MAX_LEVEL) {
    const neededXP = nextProfession.xpToNextLevel - nextProfession.xp;
    if (remainingXP < neededXP) {
      nextProfession.xp += remainingXP;
      remainingXP = 0;
    } else {
      remainingXP -= neededXP;
      nextProfession.level += 1;
      nextProfession.xp = 0;
      levelsGained += 1;
    }
  }

  if (nextProfession.level >= PROFESSION_MAX_LEVEL) {
    nextProfession.level = PROFESSION_MAX_LEVEL;
    nextProfession.xp = 0;
  }

  nextProfessions[professionId] = nextProfession;
  return { professions: nextProfessions, levelsGained };
}
