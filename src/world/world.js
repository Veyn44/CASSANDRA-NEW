const WIDTH = 64;
const HEIGHT = 40;

export function createWorld() {
  const blocked = new Set();
  const modules = [
    { id: "habitat", name: "Habitat module", x: 19, y: 17, width: 4, height: 3, kind: "habitat" },
    { id: "mining-rig", name: "Mining rig", x: 27, y: 18, width: 3, height: 3, kind: "industry" },
    { id: "storage", name: "Storage", x: 23, y: 22, width: 3, height: 2, kind: "storage" },
  ];
  const rocks = [
    [8, 8, 5, 3], [37, 7, 7, 4], [48, 15, 5, 7],
    [6, 27, 8, 5], [39, 29, 9, 4], [29, 5, 3, 2],
    [13, 17, 2, 4], [53, 30, 4, 3],
  ];
  for (const [x, y, width, height] of rocks) {
    for (let row = y; row < y + height; row += 1) {
      for (let col = x; col < x + width; col += 1) blocked.add(key(col, row));
    }
  }
  return {
    width: WIDTH, height: HEIGHT, blocked, modules,
    isBlocked(x, y) {
      const col = Math.floor(x);
      const row = Math.floor(y);
      if (col < 0 || row < 0 || col >= WIDTH || row >= HEIGHT) return true;
      if (blocked.has(key(col, row))) return true;
      return modules.some((module) =>
        col >= module.x && col < module.x + module.width &&
        row >= module.y && row < module.y + module.height
      );
    },
    isCircleBlocked(x, y, radius) {
      if (x - radius < 0 || y - radius < 0 || x + radius > WIDTH || y + radius > HEIGHT) return true;
      const minX = Math.floor(x - radius);
      const maxX = Math.floor(x + radius);
      const minY = Math.floor(y - radius);
      const maxY = Math.floor(y + radius);
      for (let row = minY; row <= maxY; row += 1) {
        for (let col = minX; col <= maxX; col += 1) {
          const blockedTile = blocked.has(key(col, row)) || modules.some((module) =>
            col >= module.x && col < module.x + module.width &&
            row >= module.y && row < module.y + module.height
          );
          if (!blockedTile) continue;
          const nearestX = Math.max(col, Math.min(x, col + 1));
          const nearestY = Math.max(row, Math.min(y, row + 1));
          if ((x - nearestX) ** 2 + (y - nearestY) ** 2 < radius ** 2) return true;
        }
      }
      return false;
    },
  };
}
function key(x, y) { return `${x},${y}`; }
