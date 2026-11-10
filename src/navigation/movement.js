/** Move an entity through the world using precise circular collision bodies. */
export function moveEntity(entity, delta, world, pawns = []) {
  const length = Math.hypot(entity.velocityX, entity.velocityY);
  const inputX = length > 1 ? entity.velocityX / length : entity.velocityX;
  const inputY = length > 1 ? entity.velocityY / length : entity.velocityY;
  const dx = inputX * entity.speed * delta;
  const dy = inputY * entity.speed * delta;
  const distance = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(distance / Math.max(0.04, entity.radius * 0.45)));
  const stepX = dx / steps;
  const stepY = dy / steps;

  for (let step = 0; step < steps; step += 1) {
    const nextX = entity.x + stepX;
    if (canOccupy(entity, nextX, entity.y, world, pawns)) entity.x = nextX;
    const nextY = entity.y + stepY;
    if (canOccupy(entity, entity.x, nextY, world, pawns)) entity.y = nextY;
  }
  entity.isMoving = Math.abs(inputX) + Math.abs(inputY) > 0.01;
}

function canOccupy(entity, x, y, world, pawns) {
  if (world.isCircleBlocked(x, y, entity.radius)) return false;
  for (const other of pawns) {
    if (other === entity) continue;
    const minDistance = entity.radius + other.radius;
    if ((x - other.x) ** 2 + (y - other.y) ** 2 < minDistance ** 2) return false;
  }
  return true;
}
