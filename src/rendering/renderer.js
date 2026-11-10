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
    this.drawTerrain(ctx, left, top, right, bottom, tile);
    this.drawGrid(ctx, left, top, right, bottom, tile, width, height);
    this.drawModules(ctx, left, top, tile);
    this.drawCommander(ctx, left, top, tile, elapsed);
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

  drawCommander(ctx, left, top, tile, elapsed) {
    const x = (this.commander.x - left) * tile;
    const y = (this.commander.y - top) * tile;
    const radius = Math.max(5, tile * 0.27);
    const attackProgress = this.commander.attackTimer > 0
      ? 1 - this.commander.attackTimer / 0.2
      : 0;

    ctx.save();
    ctx.translate(x, y);

    // Short forward jab: deliberately simple, with no arm or hand sprite yet.
    if (this.commander.attackTimer > 0) {
      const reach = radius * (1.25 + Math.sin(attackProgress * Math.PI) * 0.85);
      ctx.save();
      ctx.rotate(this.commander.rotation);
      ctx.strokeStyle = `rgba(225,248,245,${0.8 * (1 - attackProgress)})`;
      ctx.lineWidth = Math.max(2, radius * 0.22);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(radius * 0.55, 0);
      ctx.lineTo(reach, 0);
      ctx.stroke();
      ctx.fillStyle = `rgba(101,214,209,${0.22 * (1 - attackProgress)})`;
      ctx.beginPath();
      ctx.arc(reach, 0, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = this.commander.drafted ? "rgba(101,214,209,0.22)" : "rgba(101,214,209,0.12)";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 2.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.commander.drafted ? "#78eee4" : "#65d6d1";
    ctx.strokeStyle = this.commander.drafted ? "#f0fffc" : "#d1fffa";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // The dark inner core is the pawn's visible facing indicator.
    ctx.rotate(this.commander.rotation);
    ctx.fillStyle = "#10252b";
    ctx.beginPath();
    ctx.arc(radius * 0.43, 0, radius * 0.34, 0, Math.PI * 2);
    ctx.fill();

    if (this.commander.drafted) {
      ctx.strokeStyle = "rgba(120,238,228,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.55 + Math.sin(elapsed * 5) * 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }
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
