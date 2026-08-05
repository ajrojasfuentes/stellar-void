export class TailManager {
  private maxLength: number;
  
  constructor(maxLength: number = 300) {
    this.maxLength = maxLength;
  }

  draw(ctx: CanvasRenderingContext2D, opacity: number, colorStr: string, particle: any, pData: any, scaleFactor: number = 1) {
    if (!pData.history || pData.history.length <= 1) return;

    let usedFrames = 1;
    for (let i = pData.history.length - 1; i >= 0; i--) {
      const pt = pData.history[i];
      const dist = Math.hypot(pt.x - particle.position.x, pt.y - particle.position.y);
      if (dist <= this.maxLength * scaleFactor) {
        usedFrames++;
      } else {
        break;
      }
    }
    
    const len = Math.min(usedFrames, pData.history.length);
    const startIdx = pData.history.length - len;
    
    const oldestPt = pData.history[startIdx];
    const tailEndX = oldestPt.x - particle.position.x;
    const tailEndY = oldestPt.y - particle.position.y;
    
    let endColor = colorStr;
    let coreColor = colorStr;
    
    // Special red-to-bright-orange gradient for the Meteor
    if (colorStr === "255, 100, 50") {
      endColor = "255, 10, 0"; // Dark red at tail end
      coreColor = "255, 180, 50"; // Bright orange/yellow core
    }

    // Faint center axis line for complex trajectories (orbital path)
    if (pData.trajectory === "sinusoidal" && pData.baseSpeed) {
      const speed = pData.baseSpeed;
      const nx = pData.baseVx / speed;
      const ny = pData.baseVy / speed;
      
      const axisLen = 160 * scaleFactor; 
      
      // Since physical velocity is straight, the axis is the pure history of the particle
      const axisX = 0;
      const axisY = 0;
      
      const gradAxis = ctx.createLinearGradient(axisX, axisY, axisX - nx * axisLen, axisY - ny * axisLen);
      gradAxis.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.2})`); 
      gradAxis.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(axisX, axisY); 
      ctx.lineTo(axisX - nx * axisLen, axisY - ny * axisLen);
      ctx.strokeStyle = gradAxis;
      ctx.lineWidth = 1.2 * scaleFactor;
      ctx.shadowBlur = 8 * scaleFactor; 
      ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.25})`;
      ctx.stroke();
      ctx.restore();
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Build renderable point array 
    const points: {x: number, y: number, progress: number, scale: number}[] = [];
    for (let i = startIdx; i < pData.history.length; i++) {
      const pt = pData.history[i];
      let rx = pt.x - particle.position.x;
      let ry = pt.y - particle.position.y;
      
      let scale = 1;
      
      if (pData.trajectory === "sinusoidal" && pData.baseSpeed) {
        // Mathematical reconstruction anchored in space
        const distToPt = Math.hypot(rx, ry);
        const framesAgo = distToPt / pData.baseSpeed;
        const hTime = pData.time - (framesAgo * pData.sinFreq);
        
        const hOffset = Math.sin(hTime) * pData.sinAmp;
        rx += pData.perpX * hOffset;
        ry += pData.perpY * hOffset;
        
        const z = Math.cos(hTime);
        scale = 0.4 + ((z + 1) / 2) * 0.6;
      }
      
      const progress = (i - startIdx) / len; 
      points.push({ x: rx, y: ry, progress, scale });
    }
    
    // Append the current head position 
    let headRx = 0, headRy = 0;
    let headScale = 1;
    if (pData.trajectory === "sinusoidal" && pData.time !== undefined) {
      headRx = pData.visOffsetX || 0;
      headRy = pData.visOffsetY || 0;
      const z = Math.cos(pData.time);
      headScale = 0.4 + ((z + 1) / 2) * 0.6;
    }
    points.push({ x: headRx, y: headRy, progress: 1.0, scale: headScale });

    // Polygon builder function (for tapered tails)
    const buildPolygon = (maxWidth: number) => {
      const lefts = [];
      const rights = [];
      
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        let nx = 0, ny = 0;
        if (i < points.length - 1) {
          const next = points[i + 1];
          const dx = next.x - p.x;
          const dy = next.y - p.y;
          const dlen = Math.hypot(dx, dy) || 1;
          nx = -dy / dlen;
          ny = dx / dlen;
        } else if (i > 0) {
          const prev = points[i - 1];
          const dx = p.x - prev.x;
          const dy = p.y - prev.y;
          const dlen = Math.hypot(dx, dy) || 1;
          nx = -dy / dlen;
          ny = dx / dlen;
        }
        
        const width = maxWidth * p.progress * p.scale * scaleFactor;
        lefts.push({ x: p.x + nx * width, y: p.y + ny * width });
        rights.push({ x: p.x - nx * width, y: p.y - ny * width });
      }
      
      ctx.beginPath();
      if (lefts.length > 0) {
        ctx.moveTo(lefts[0].x, lefts[0].y);
        for (let i = 1; i < lefts.length; i++) ctx.lineTo(lefts[i].x, lefts[i].y);
        ctx.lineTo(rights[rights.length - 1].x, rights[rights.length - 1].y);
        for (let i = rights.length - 2; i >= 0; i--) ctx.lineTo(rights[i].x, rights[i].y);
        ctx.closePath();
      }
    };

    // Linear gradients for the full tail fill
    const gradOuter = ctx.createLinearGradient(tailEndX, tailEndY, 0, 0);
    gradOuter.addColorStop(0, `rgba(${endColor}, 0)`);
    gradOuter.addColorStop(1, `rgba(${coreColor}, ${opacity * 0.08})`); 
    
    const gradInner = ctx.createLinearGradient(tailEndX, tailEndY, 0, 0);
    gradInner.addColorStop(0, `rgba(${endColor}, 0)`);
    gradInner.addColorStop(1, `rgba(${coreColor}, ${opacity * 0.5})`); 

    // Outer Glow (original max width was 18, radius 9)
    buildPolygon(9);
    ctx.save();
    ctx.shadowBlur = 16 * scaleFactor;
    ctx.shadowColor = `rgba(${coreColor}, ${opacity * 0.4})`;
    ctx.fillStyle = gradOuter;
    ctx.fill();
    ctx.restore();

    // Intense Core (original max width was 6, radius 3)
    buildPolygon(3);
    ctx.save();
    ctx.shadowBlur = 8 * scaleFactor;
    ctx.shadowColor = `rgba(${coreColor}, ${opacity * 0.8})`;
    ctx.fillStyle = gradInner;
    ctx.fill();
    ctx.restore();
  }
}
