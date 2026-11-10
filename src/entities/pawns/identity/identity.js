// Minimal personal identity shared by all pawn constructors.
export function createPawnIdentity({ name, age, birthdayDay } = {}) {
  return {
    name,
    age: Number.isInteger(age) ? age : randomInt(18, 50),
    birthdayDay: Number.isInteger(birthdayDay) ? clamp(birthdayDay, 1, 365) : randomInt(1, 365),
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
