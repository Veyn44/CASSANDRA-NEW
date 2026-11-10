import { EXPEDITION_SUIT_STATES } from "../../entities/pawns/equipment/expedition-suit.js";

function requireSuit(suit) {
  if (!suit?.id) throw new Error("A valid expedition suit is required.");
}

export function assignSuitStation(station, pawn) {
  if (!station?.id || !pawn?.id) throw new Error("A valid station and pawn are required.");
  if (station.storedSuitId) throw new Error("A station holding a suit cannot be reassigned.");
  station.assignedPawnId = pawn.id;
  pawn.expeditionSuitStationId = station.id;
  return true;
}

export function storeSuit(pawn, station, suit) {
  requireSuit(suit);
  if (!pawn?.id || station?.assignedPawnId !== pawn.id) return false;
  if (suit.ownerPawnId !== pawn.id || suit.state !== EXPEDITION_SUIT_STATES.EQUIPPED) return false;
  if (pawn.expeditionSuit?.id !== suit.id || station.storedSuitId) return false;

  pawn.expeditionSuit = null;
  station.storedSuitId = suit.id;
  suit.state = EXPEDITION_SUIT_STATES.STORED;
  suit.location = { type: "station", stationId: station.id };
  return true;
}

export function retrieveSuit(pawn, station, suit) {
  requireSuit(suit);
  if (!pawn?.id || station?.assignedPawnId !== pawn.id) return false;
  if (suit.ownerPawnId !== pawn.id || suit.state !== EXPEDITION_SUIT_STATES.STORED) return false;
  if (station.storedSuitId !== suit.id || pawn.expeditionSuit) return false;

  station.storedSuitId = null;
  pawn.expeditionSuit = suit;
  suit.state = EXPEDITION_SUIT_STATES.EQUIPPED;
  suit.location = { type: "pawn", pawnId: pawn.id };
  return true;
}

export function dropSuitOnDeath(pawn, suit, corpseId) {
  requireSuit(suit);
  if (!pawn?.id || suit.ownerPawnId !== pawn.id || pawn.expeditionSuit?.id !== suit.id) return false;

  pawn.expeditionSuit = null;
  suit.state = EXPEDITION_SUIT_STATES.DROPPED;
  suit.location = { type: "corpse", corpseId, pawnId: pawn.id };
  return true;
}

export function recoverDroppedSuit(suit, pawn, corpseId) {
  requireSuit(suit);
  if (!pawn?.id || suit.ownerPawnId !== pawn.id || suit.state !== EXPEDITION_SUIT_STATES.DROPPED) return false;
  if (suit.location?.type !== "corpse" || suit.location.corpseId !== corpseId) return false;

  suit.state = EXPEDITION_SUIT_STATES.EQUIPPED;
  suit.location = { type: "pawn", pawnId: pawn.id };
  pawn.expeditionSuit = suit;
  return true;
}
