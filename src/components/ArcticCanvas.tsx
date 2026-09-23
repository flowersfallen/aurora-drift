import React, { useEffect, useRef } from 'react';
import { TimeOfDay } from '../types';

interface ArcticCanvasProps {
  timeOfDay: TimeOfDay;
  isDiving: boolean;
  isCruising?: boolean;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  blinkSpeed: number;
}

export const ArcticCanvas: React.FC<ArcticCanvasProps> = ({ timeOfDay, isDiving, isCruising = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    // Initialize Stars
    let stars: Star[] = [];
    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 4500);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.7),
          radius: Math.random() * 1.5 + 0.4,
          baseAlpha: Math.random() * 0.7 + 0.3,
          blinkSpeed: Math.random() * 0.03 + 0.01,
        });
      }
    };
    initStars();

    // Initialize Snowflakes
    const snowCount = Math.min(120, Math.floor(width / 15));
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speed: Math.random() * 1.2 + 0.5,
        wind: Math.random() * 0.4 - 0.1,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    // Shooting star state for Quiet Midnight mode
    const shootingStar = {
      x: 0,
      y: 0,
      vx: 9,
      vy: 6,
      length: 80,
      speed: 12,
      life: 0,
      maxLife: 40,
      active: false,
      nextSpawn: 90, // First meteor shortly after entering night mode
    };

    // Parallax Layer 1: Seamless Glacial Mountain Ridge
    let mountainScroll = 0;
    const mountainRidge = [
      { dx: 0, dy: 50, snow: false },
      { dx: 130, dy: 125, snow: true },
      { dx: 260, dy: 65, snow: false },
      { dx: 420, dy: 155, snow: true },
      { dx: 570, dy: 80, snow: false },
      { dx: 720, dy: 135, snow: true },
      { dx: 870, dy: 70, snow: false },
      { dx: 1040, dy: 160, snow: true },
      { dx: 1220, dy: 90, snow: false },
      { dx: 1400, dy: 50, snow: false },
    ];
    const mountainPeriod = 1400;

    // Parallax Layer 2: Midground Floating Icebergs
    const icebergs = [
      { x: width * 0.15, yOffset: 25, w: 105, h: 44, speed: 1.3, bob: 0 },
      { x: width * 0.45, yOffset: 42, w: 140, h: 56, speed: 1.8, bob: 1.8 },
      { x: width * 0.80, yOffset: 28, w: 115, h: 48, speed: 1.4, bob: 3.4 },
      { x: width * 1.15, yOffset: 48, w: 130, h: 52, speed: 1.9, bob: 5.1 },
    ];

    // Parallax Layer 3: High-Speed Perspective Ocean Currents & Foaming Wavelets
    const waterCurrents: Array<{ x: number; yRatio: number; len: number; speedMult: number; opacity: number; amp: number }> = [];
    for (let i = 0; i < 32; i++) {
      waterCurrents.push({
        x: Math.random() * (width + 300) - 150,
        yRatio: 0.08 + (i / 32) * 0.84,
        len: 45 + Math.random() * 65,
        speedMult: 0.85 + Math.random() * 0.35,
        opacity: 0.35 + Math.random() * 0.45,
        amp: 2 + Math.random() * 2.5,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.75);
      if (timeOfDay === 'aurora') {
        // Luminous polar sky with emerald-cyan atmospheric horizon glow
        skyGrad.addColorStop(0, '#020612');
        skyGrad.addColorStop(0.45, '#051829');
        skyGrad.addColorStop(1, '#093644');
      } else if (timeOfDay === 'night') {
        // Deep obsidian polar midnight sky with serene deep navy undertone
        skyGrad.addColorStop(0, '#01040a');
        skyGrad.addColorStop(0.5, '#040d1e');
        skyGrad.addColorStop(1, '#07162d');
      } else if (timeOfDay === 'sunset') {
        skyGrad.addColorStop(0, '#1a103c');
        skyGrad.addColorStop(0.4, '#4a154b');
        skyGrad.addColorStop(0.7, '#9e3d64');
        skyGrad.addColorStop(1, '#f28e67');
      } else {
        skyGrad.addColorStop(0, '#7dd3fc');
        skyGrad.addColorStop(0.6, '#bae6fd');
        skyGrad.addColorStop(1, '#e0f2fe');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.75);

      // 2. Stars
      if (timeOfDay !== 'day') {
        const twinkleFactor = timeOfDay === 'night' ? 0.35 : 0.25;
        stars.forEach((s) => {
          const alpha = s.baseAlpha + Math.sin(time * (timeOfDay === 'night' ? 2.6 : 2.0) + s.x) * twinkleFactor;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * (timeOfDay === 'night' ? 1.05 : 1), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${Math.max(0.12, Math.min(1, alpha))})`;
          ctx.fill();
        });
      }

      // 3. Moon & Shooting Stars (Quiet Midnight ONLY)
      const moonX = width * (width < 640 ? 0.78 : 0.82);
      const moonY = Math.max(70, Math.min(130, height * 0.16));
      const moonRadius = width < 640 ? 18 : 24;

      if (timeOfDay === 'night') {
        // A. Ambient Lunar Halo
        ctx.save();
        const halo = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.2, moonX, moonY, moonRadius * 3.8);
        halo.addColorStop(0, 'rgba(224, 242, 254, 0.32)');
        halo.addColorStop(0.35, 'rgba(186, 230, 253, 0.12)');
        halo.addColorStop(0.7, 'rgba(125, 211, 252, 0.03)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 3.8, 0, Math.PI * 2);
        ctx.fill();

        // B. Crisp Radiant Crescent Moon
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, Math.PI * 0.3, Math.PI * 1.7, false);
        ctx.arc(moonX + moonRadius * 0.5, moonY, moonRadius * 0.85, Math.PI * 1.6, Math.PI * 0.4, true);
        ctx.closePath();
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(224, 242, 254, 0.9)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();

        // C. Occasional Gentle Shooting Star (Meteor)
        shootingStar.nextSpawn--;
        if (!shootingStar.active && shootingStar.nextSpawn <= 0) {
          shootingStar.active = true;
          shootingStar.x = Math.random() * (width * 0.65);
          shootingStar.y = Math.random() * (height * 0.22) + 15;
          const angle = Math.PI * 0.18 + Math.random() * 0.12;
          const speed = Math.random() * 4 + 11;
          shootingStar.speed = speed;
          shootingStar.vx = Math.cos(angle) * speed;
          shootingStar.vy = Math.sin(angle) * speed;
          shootingStar.length = Math.random() * 35 + 65;
          shootingStar.life = 0;
          shootingStar.maxLife = Math.floor(Math.random() * 20 + 35);
          // Spawn next meteor in ~5-9 seconds
          shootingStar.nextSpawn = Math.floor(Math.random() * 240 + 300);
        }

        if (shootingStar.active) {
          shootingStar.life++;
          shootingStar.x += shootingStar.vx;
          shootingStar.y += shootingStar.vy;

          const progress = shootingStar.life / shootingStar.maxLife;
          const meteorAlpha = Math.sin(progress * Math.PI) * 0.85;

          const tailX = shootingStar.x - (shootingStar.vx / shootingStar.speed) * shootingStar.length;
          const tailY = shootingStar.y - (shootingStar.vy / shootingStar.speed) * shootingStar.length;

          const meteorGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          meteorGrad.addColorStop(0, 'rgba(224, 242, 254, 0)');
          meteorGrad.addColorStop(0.7, `rgba(224, 242, 254, ${meteorAlpha * 0.6})`);
          meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${meteorAlpha})`);

          ctx.save();
          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          // Small meteor head glow
          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${meteorAlpha})`;
          ctx.shadowColor = '#bae6fd';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();

          if (shootingStar.life >= shootingStar.maxLife || shootingStar.x > width || shootingStar.y > height * 0.5) {
            shootingStar.active = false;
          }
        }
      }

      // 4. Dynamic Aurora Curtains (Northern Lights Aurora ONLY)
      if (timeOfDay === 'aurora') {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const ribbons = [
          { color: 'rgba(52, 211, 153, 0.35)', speed: 0.85, amp: 58, yOffset: height * 0.21, freq: 0.003 },
          { color: 'rgba(56, 189, 248, 0.30)', speed: 1.15, amp: 48, yOffset: height * 0.26, freq: 0.0035 },
          { color: 'rgba(192, 132, 252, 0.26)', speed: 0.65, amp: 68, yOffset: height * 0.19, freq: 0.0025 },
        ];

        ribbons.forEach((ribbon) => {
          ctx.beginPath();
          ctx.moveTo(0, height * 0.7);

          for (let x = 0; x <= width; x += 15) {
            const wave1 = Math.sin(x * ribbon.freq + time * ribbon.speed) * ribbon.amp;
            const wave2 = Math.cos(x * ribbon.freq * 1.8 - time * 0.5) * (ribbon.amp * 0.5);
            const y = ribbon.yOffset + wave1 + wave2;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height * 0.7);
          ctx.closePath();

          const auroraGrad = ctx.createLinearGradient(0, ribbon.yOffset - ribbon.amp, 0, height * 0.65);
          auroraGrad.addColorStop(0, 'rgba(0,0,0,0)');
          auroraGrad.addColorStop(0.3, ribbon.color);
          auroraGrad.addColorStop(0.8, ribbon.color.replace('0.3', '0.12').replace('0.26', '0.1'));
          auroraGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = auroraGrad;
          ctx.fill();
        });

        ctx.restore();
      }

      // 5. Distant Glacial Mountains (Parallax Layer 1: Seamless Infinitely Scrolling Ridge)
      const oceanY = height * 0.48;
      if (isCruising) {
        mountainScroll += 0.55;
      }
      const normScroll = mountainScroll % mountainPeriod;
      const startX = -normScroll - mountainPeriod;
      const endX = width + mountainPeriod;

      ctx.fillStyle = timeOfDay === 'sunset' ? '#2e1c3e' : timeOfDay === 'night' ? '#041324' : '#07243c';
      ctx.beginPath();
      ctx.moveTo(startX, oceanY);

      for (let tileX = startX; tileX < endX; tileX += mountainPeriod) {
        for (let i = 0; i < mountainRidge.length; i++) {
          const pt = mountainRidge[i];
          ctx.lineTo(tileX + pt.dx, oceanY - pt.dy);
        }
      }
      ctx.lineTo(endX + mountainPeriod, oceanY);
      ctx.lineTo(startX, oceanY);
      ctx.closePath();
      ctx.fill();

      // Mountain Snow Highlights (Tiled seamlessly with the peaks)
      ctx.fillStyle =
        timeOfDay === 'sunset'
          ? 'rgba(244, 114, 182, 0.35)'
          : timeOfDay === 'night'
          ? 'rgba(224, 242, 254, 0.20)'
          : 'rgba(110, 231, 183, 0.25)';

      for (let tileX = startX; tileX < endX; tileX += mountainPeriod) {
        for (let i = 0; i < mountainRidge.length; i++) {
          const pt = mountainRidge[i];
          if (pt.snow) {
            const px = tileX + pt.dx;
            const py = oceanY - pt.dy;
            if (px >= -80 && px <= width + 80) {
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px - 36, py + 38);
              ctx.lineTo(px + 38, py + 42);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }

      // 6. Ocean Surface
      const oceanGrad = ctx.createLinearGradient(0, oceanY, 0, height);
      if (isDiving) {
        oceanGrad.addColorStop(0, '#032840');
        oceanGrad.addColorStop(0.35, '#043b59');
        oceanGrad.addColorStop(1, '#021324');
      } else if (timeOfDay === 'sunset') {
        oceanGrad.addColorStop(0, '#421a47');
        oceanGrad.addColorStop(0.25, '#251b44');
        oceanGrad.addColorStop(1, '#0b0c22');
      } else if (timeOfDay === 'night') {
        oceanGrad.addColorStop(0, '#05182a');
        oceanGrad.addColorStop(0.25, '#03101d');
        oceanGrad.addColorStop(1, '#010810');
      } else {
        oceanGrad.addColorStop(0, '#062d42');
        oceanGrad.addColorStop(0.25, '#041f32');
        oceanGrad.addColorStop(1, '#020f1a');
      }
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, oceanY, width, height - oceanY);

      // Ocean waterline glow
      ctx.strokeStyle =
        timeOfDay === 'sunset'
          ? 'rgba(244, 114, 182, 0.25)'
          : timeOfDay === 'night'
          ? 'rgba(186, 230, 253, 0.16)'
          : 'rgba(56, 189, 248, 0.24)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, oceanY);
      ctx.lineTo(width, oceanY);
      ctx.stroke();

      // Gentle ambient water surface ripples
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 0; r < 6; r++) {
        const ry = oceanY + 25 + r * 35;
        const rx = (width * 0.5) + Math.sin(time * 0.6 + r) * 120;
        ctx.beginPath();
        ctx.ellipse(rx, ry, width * 0.45, 4 + r * 1.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Aurora reflections on water (Aurora ONLY)
      if (timeOfDay === 'aurora') {
        for (let i = 0; i < 5; i++) {
          const wy = oceanY + 22 + i * 36;
          const wx = Math.sin(time * 0.8 + i * 1.2) * 80 + width * 0.48;
          const col = i % 2 === 0 ? 'rgba(52, 211, 153, 0.11)' : 'rgba(56, 189, 248, 0.10)';
          ctx.beginPath();
          ctx.ellipse(wx, wy, width * 0.38, 5.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        }
      }

      // Moonlight reflection column under crescent moon (Quiet Midnight ONLY)
      if (timeOfDay === 'night') {
        ctx.save();
        for (let r = 0; r < 12; r++) {
          const my = oceanY + 12 + r * 24;
          if (my > height) break;
          const shimmerWidth = 22 + r * 9 + Math.sin(time * 2.2 + r * 0.7) * 7;
          const shimmerAlpha = Math.max(0.02, 0.15 - r * 0.01) * (0.8 + Math.sin(time * 1.6 + r) * 0.2);
          const mx = moonX + Math.sin(time * 0.8 + r * 0.5) * 5;

          ctx.beginPath();
          ctx.ellipse(mx, my, shimmerWidth, 2.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${shimmerAlpha})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. Floating Distant Icebergs (Parallax Layer 2: Midground Drift past the player)
      const drawIceberg = (bx: number, by: number, bWidth: number, bHeight: number) => {
        ctx.fillStyle = '#104e7a';
        ctx.beginPath();
        ctx.moveTo(bx - bWidth / 2, by);
        ctx.lineTo(bx - bWidth * 0.2, by - bHeight);
        ctx.lineTo(bx + bWidth * 0.1, by - bHeight * 0.85);
        ctx.lineTo(bx + bWidth / 2, by);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
        ctx.beginPath();
        ctx.moveTo(bx - bWidth * 0.2, by - bHeight);
        ctx.lineTo(bx - bWidth * 0.3, by - bHeight * 0.5);
        ctx.lineTo(bx, by - bHeight * 0.4);
        ctx.lineTo(bx + bWidth * 0.1, by - bHeight * 0.85);
        ctx.closePath();
        ctx.fill();
      };

      icebergs.forEach((b) => {
        if (isCruising) {
          b.x -= b.speed;
          if (b.x < -b.w) {
            b.x = width + Math.random() * 200 + 80;
            b.yOffset = 20 + Math.random() * 35;
            b.speed = 1.2 + Math.random() * 0.8;
          }
        }
        const by = oceanY + b.yOffset + Math.sin(time * 0.8 + b.bob) * 2;
        drawIceberg(b.x, by, b.w, b.h);
      });

      // 8. Diving Bubbles Effect (when isDiving is true)
      if (isDiving) {
        ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
        for (let b = 0; b < 18; b++) {
          const bx = (width * 0.5) + Math.sin(time * 3 + b * 2) * 90;
          const by = height - ((time * 120 + b * 45) % (height - oceanY));
          ctx.beginPath();
          ctx.arc(bx, by, (b % 3) + 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 9. Cruising Rapid Ocean Currents & Spray (Parallax Layer 3: High-Speed Perspective Foam Lines)
      if (isCruising) {
        ctx.save();
        waterCurrents.forEach((c) => {
          // Perspective velocity: foreground moves over 3x faster than horizon!
          const v = (3.6 + c.yRatio * 8.2) * c.speedMult;
          c.x -= v;
          if (c.x < -c.len - 80) {
            c.x = width + Math.random() * 150 + 20;
          }

          const cy = oceanY + (height - oceanY) * c.yRatio;

          // Glowing cyan water wave crest
          ctx.beginPath();
          ctx.moveTo(c.x, cy);
          ctx.quadraticCurveTo(c.x + c.len * 0.5, cy - c.amp, c.x + c.len, cy);
          ctx.strokeStyle = `rgba(125, 211, 252, ${c.opacity * 0.65})`;
          ctx.lineWidth = 1.4 + c.yRatio * 1.8;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Bright white foam cap on wave crest
          ctx.beginPath();
          ctx.moveTo(c.x + c.len * 0.25, cy - c.amp * 0.7);
          ctx.lineTo(c.x + c.len * 0.75, cy - c.amp * 0.7);
          ctx.strokeStyle = `rgba(255, 255, 255, ${c.opacity * 0.9})`;
          ctx.lineWidth = 1.0 + c.yRatio * 1.2;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
        ctx.restore();
      }

      // 10. Gentle Falling Snowflakes / Cruising Blizzard Wind Streaks (Parallax Layer 4)
      snowflakes.forEach((f) => {
        f.y += f.speed;
        const cruiseWind = isCruising ? -(4.0 + f.speed * 2.2) : 0;
        f.x += f.wind + cruiseWind + Math.sin(time + f.y * 0.01) * 0.5;

        if (f.y > height) {
          f.y = -10;
          f.x = Math.random() * width;
        }
        if (f.x > width + 50) f.x = -20;
        if (f.x < -50) f.x = width + 20;

        if (isCruising) {
          ctx.beginPath();
          ctx.moveTo(f.x, f.y);
          ctx.lineTo(f.x + 8 + f.speed * 3.5, f.y - 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${f.opacity * 0.85})`;
          ctx.lineWidth = f.radius * 0.85;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [timeOfDay, isDiving, isCruising]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
