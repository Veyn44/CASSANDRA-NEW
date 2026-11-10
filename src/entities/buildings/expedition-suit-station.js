export function createExpeditionSuitStation({
  id,
  assignedPawnId = null,
  x = null,
  y = null,
}) {
  if (!id) throw new Error("Expedition Suit Station requires an id.");

  return {
    id,
    kind: "expedition-suit-station",
    assignedPawnId,
    storedSuitId: null,
    x,
    y,
  };
}
