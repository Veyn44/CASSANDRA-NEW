// One shared strategic calendar. Time advances only through an explicit day transition.
export function createStrategicCalendar({ year = 2084, day = 1 } = {}) {
  return {
    year: Number.isInteger(year) ? year : 2084,
    day: Number.isInteger(day) ? Math.max(1, Math.min(365, day)) : 1,
  };
}

export function setStrategicDay(calendar, day) {
  const nextDay = Number(day);
  if (!Number.isInteger(nextDay) || nextDay < 1 || nextDay > 365) return false;
  calendar.day = nextDay;
  return true;
}

// Returns the new calendar date and pawns whose age increased.
// Setting the date is intentionally separate and never changes pawn age.
export function endStrategicDay(calendar, pawns) {
  if (calendar.day === 365) {
    calendar.day = 1;
    calendar.year += 1;
  } else {
    calendar.day += 1;
  }

  const agedPawns = [];
  for (const pawn of pawns) {
    if (pawn.birthdayDay === calendar.day) {
      pawn.age += 1;
      agedPawns.push(pawn);
    }
  }
  return { year: calendar.year, day: calendar.day, agedPawns };
}
