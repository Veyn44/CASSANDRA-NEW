/** Applies smooth world-space movement with axis-separated collision checks. */
export function moveEntity(entity, delta, world) {
  const length = Math.hypot(entity.velocityX, entity.velocityY);
  if (length > 1) {
    entity.velocityX /= length;
    entity.velocityY /= length;
  }

  const dx = entity.velocityX * entity.speed * delta;
  const dy = entity.velocityY * entity.speed * delta;
  const nextX = entity.x + dx;
  const nextY = entity.y + dy;

  if (!world.isBlocked(nextX, entity.y)) entity.x = nextX;
  if (!world.isBlocked(entity.x, nextY)) entity.y = nextY;

  entity.isMoving = Math.abs(entity.velocityX) + Math.abs(entity.velocityY) > 0.01;
}
