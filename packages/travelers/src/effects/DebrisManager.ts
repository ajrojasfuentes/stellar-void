export class DebrisManager {
  private debris: any[] = [];
  private colorStr: string;

  public setColor(color: string): void { this.colorStr = color; }
  public getColor(): string { return this.colorStr; }

  constructor(colorStr: string) {
    this.colorStr = colorStr;
  }

  update(chance: number, visX: number, visY: number, vx: number, vy: number) {
    if (Math.random() < chance) {
      // Calculate normalized velocity to emit debris in the opposite direction
      const speed = Math.hypot(vx, vy) || 1;
      const nx = vx / speed;
      const ny = vy / speed;
      
      const spread = (Math.random() - 0.5) * 1.5;
      
      let dColor = this.colorStr;
      if (this.colorStr === "255, 100, 50") {
        const roll = Math.random();
        if (roll > 0.92) dColor = "255, 255, 255"; // White spark
        else if (roll > 0.6) dColor = "255, 180, 50"; // Yellowish orange
        else if (roll > 0.3) dColor = "255, 80, 20"; // Reddish orange
        else dColor = "255, 30, 0"; // Deep red
      }
      
      this.debris.push({
        rx: visX,
        ry: visY,
        life: 1,
        colorStr: dColor,
        // Stronger ejection force
        vx: -nx * (Math.random() * 3.5 + 1.0) - (ny * spread * 2),
        vy: -ny * (Math.random() * 3.5 + 1.0) + (nx * spread * 2)
      });
    }

    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.rx += d.vx;
      d.ry += d.vy;
      d.life -= 0.03; // Live longer
      if (d.life <= 0) {
        this.debris[i] = this.debris[this.debris.length - 1];
        this.debris.pop();
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, opacity: number) {
    for (const d of this.debris) {
      ctx.beginPath();
      // Calculate random apparent size based on some pseudo-randomness or just draw them slightly larger
      // Let's use a fixed larger size 2.2, with glow based on life
      ctx.arc(d.rx, d.ry, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.colorStr || this.colorStr}, ${d.life * opacity})`;
      ctx.fill();
    }
  }
}
