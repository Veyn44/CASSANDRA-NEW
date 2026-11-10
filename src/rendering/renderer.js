export class Renderer {
  constructor(canvas, world, commander, camera) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.world = world;
    this.commander = commander;
    this.camera = camera;
    this.tileSize = 32;
    this.showGrid = true;
    this.width = 0;
    this.height = 0;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  render(elapsed = 0) {
    const ctx = this.context;
    const width = this.width;
    const height = this.height;
    const tile = this.tileSize * this.camera.zoom;
    const left = this.camera.x - width / (2 * tile);
    const top = this.camera.y - height / (2 * tile);
    const right = left + width / tile;
    const bottom = top + height / tile;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0a1219";
    ctx.fillRect(0, 0, width, height);
    this.drawTerrain(ctx, left, top, right, bottom, tile, width, height);
    this.drawGrid(ctx, left, top, right, bottom, tile, width, height);
    this.drawModules(ctx, left, top, tile);
    this.drawCommander(ctx, tile, width, height);
    this.drawAmbientDetails(ctx, left, top, right, bottom, tile, elapsed);
  }

  drawTerrain(ctx, left, top, right, bottom, tile) {
    const minX = Math.max(0, Math.floor(left));
    const minY = Math.max(0, Math.floor(top));
    const maxX = Math.min(this.world.width, Math.ceil(right));
    const maxY = Math.min(this.world.height, Math.ceil(bottom));
    for (let y = minY; y < maxY; y += 1) {
      for (let x = minX; x < maxX; x += 1) {
        const px = (x - left) * tile;
        const py = (y - top) * tile;
        const noise = ((x * 17 + y * 31) % 7) * 1.2;
        ctx.fillStyle = `rgb(${15 + noise} ${25 + noise} ${31 + noise})`;
        ctx.fillRect(px, py, tile + 0.5, tile + 0.5);
        if (this.world.blocked.has(`${x},${y}`)) {
          ctx.fillStyle = "#26343b";
          ctx.fillRect(px + 1, py + 1, tile - 2, tile - 2);
          ctx.strokeStyle = "#40515a";
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 3, py + 3, tile - 6, tile - 6);
          ctx.fillStyle = "#52616a";
          ctx.fillRect(px + tile * 0.25, py + tile * 0.3, tile * 0.12, tile * 0.08);
        }
      }
    }
  }

  drawGrid(ctx, left, top, right, bottom, tile, width, height) {
    if (!this.showGrid || this.camera.zoom < 0.65) return;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(119,157,166,0.13)";
    ctx.lineWidth = 1;
    const startX = Math.max(0, Math.floor(left));
    const endX = Math.min(this.world.width, Math.ceil(right));
    const startY = Math.max(0, Math.floor(top));
    const endY = Math.min(this.world.height, Math.ceil(bottom));
    for (let x = startX; x <= endX; x += 1) {
      const px = Math.round((x - left) * tile) + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
    }
    for (let y = startY; y <= endY; y += 1) {
      const py = Math.round((y - top) * tile) + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
    }
    ctx.stroke();
  }

  drawModules(ctx, left, top, tile) {
    for (const module of this.world.modules) {
      const x = (module.x - left) * tile;
      const y = (module.y - top) * tile;
      const width = module.width * tile;
      const height = module.height * tile;
      ctx.fillStyle = module.kind === "industry" ? "#4a3c2b" : module.kind === "storage" ? "#34414b" : "#24434a";
      ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
      ctx.strokeStyle = module.kind === "industry" ? "#b38b55" : "#5b9da0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 3, y + 3, width - 6, height - 6);
      ctx.fillStyle = "#d5e1e3";
      ctx.font = `600 ${Math.max(8, 9 * this.camera.zoom)}px IBM Plex Mono, monospace`;
      ctx.fillText(module.name.toUpperCase(), x + 7, y + 16 * this.camera.zoom);
      ctx.fillStyle = "rgba(255,255,255,0.09)";
      ctx.fillRect(x + width * 0.18, y + height * 0.48, width * 0.64, 2);
    }
  }

  drawCommander(ctx, tile, width, height) {
    const x = width / 2;
    const y = height / 2;
    const radius = Math.max(5, tile * 0.27);
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(101,214,209,0.15)";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#65d6d1";
    ctx.strokeStyle = "#d1fffa";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#10252b";
    ctx.beginPath();
    ctx.arc(0, -radius * 0.15, radius * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawAmbientDetails(ctx, left, top, right, bottom, tile, elapsed) {
    const x = (31.5 - left) * tile;
    const y = (12.5 - top) * tile;
    if (x > -20 && y > -20 && x < this.width + 20 && y < this.height + 20) {
      ctx.strokeStyle = "rgba(213,169,107,0.35)";
      ctx.beginPath();
      ctx.arc(x, y, tile * (0.25 + Math.sin(elapsed * 1.5) * 0.025), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
