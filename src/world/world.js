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
  };
}
function key(x, y) { return `${x},${y}`; }
