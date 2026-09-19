import React, { useEffect, useRef } from 'react';
import { TimeOfDay } from '../types';

interface ArcticCanvasProps {
  timeOfDay: TimeOfDay;
  isDiving: boolean;
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

export const ArcticCanvas: React.FC<ArcticCanvasProps> = ({ timeOfDay, isDiving }) => {
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

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.75);
      if (timeOfDay === 'aurora' || timeOfDay === 'night') {
        skyGrad.addColorStop(0, '#040814');
        skyGrad.addColorStop(0.5, '#081c34');
        skyGrad.addColorStop(1, '#0e3a5d');
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
        stars.forEach((s) => {
          const alpha = s.baseAlpha + Math.sin(time * 2 + s.x) * 0.25;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${Math.max(0.1, Math.min(1, alpha))})`;
          ctx.fill();
        });
      }

      // 3. Dynamic Aurora Curtains (when timeOfDay is 'aurora' or 'night')
      if (timeOfDay === 'aurora' || timeOfDay === 'night') {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const ribbons = [
          { color: 'rgba(52, 211, 153, 0.28)', speed: 0.8, amp: 55, yOffset: height * 0.22, freq: 0.003 },
          { color: 'rgba(56, 189, 248, 0.25)', speed: 1.1, amp: 45, yOffset: height * 0.26, freq: 0.0035 },
          { color: 'rgba(192, 132, 252, 0.22)', speed: 0.6, amp: 65, yOffset: height * 0.20, freq: 0.0025 },
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
          auroraGrad.addColorStop(0.8, ribbon.color.replace('0.2', '0.1'));
          auroraGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = auroraGrad;
          ctx.fill();
        });

        ctx.restore();
      }

      // 4. Distant Glacial Mountains
      const oceanY = height * 0.48;
      ctx.fillStyle = timeOfDay === 'sunset' ? '#2e1c3e' : '#07243c';
      ctx.beginPath();
      ctx.moveTo(0, oceanY);
      ctx.lineTo(0, oceanY - 60);
      ctx.lineTo(width * 0.18, oceanY - 130);
      ctx.lineTo(width * 0.32, oceanY - 75);
      ctx.lineTo(width * 0.52, oceanY - 150);
      ctx.lineTo(width * 0.72, oceanY - 85);
      ctx.lineTo(width * 0.88, oceanY - 120);
      ctx.lineTo(width, oceanY - 50);
      ctx.lineTo(width, oceanY);
      ctx.closePath();
      ctx.fill();

      // Mountain Snow Highlights
      ctx.fillStyle = timeOfDay === 'sunset' ? 'rgba(244, 114, 182, 0.35)' : 'rgba(186, 230, 253, 0.25)';
      ctx.beginPath();
      ctx.moveTo(width * 0.18, oceanY - 130);
      ctx.lineTo(width * 0.14, oceanY - 95);
      ctx.lineTo(width * 0.22, oceanY - 90);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width * 0.52, oceanY - 150);
      ctx.lineTo(width * 0.48, oceanY - 105);
      ctx.lineTo(width * 0.56, oceanY - 100);
      ctx.closePath();
      ctx.fill();

      // 5. Ocean Surface
      const oceanGrad = ctx.createLinearGradient(0, oceanY, 0, height);
      if (isDiving) {
        oceanGrad.addColorStop(0, '#032840');
        oceanGrad.addColorStop(0.35, '#043b59');
        oceanGrad.addColorStop(1, '#021324');
      } else if (timeOfDay === 'sunset') {
        oceanGrad.addColorStop(0, '#421a47');
        oceanGrad.addColorStop(0.25, '#251b44');
        oceanGrad.addColorStop(1, '#0b0c22');
      } else {
        oceanGrad.addColorStop(0, '#083354');
        oceanGrad.addColorStop(0.25, '#05233c');
        oceanGrad.addColorStop(1, '#020f1a');
      }
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, oceanY, width, height - oceanY);

      // Ocean waterline glow
      ctx.strokeStyle = timeOfDay === 'sunset' ? 'rgba(244, 114, 182, 0.25)' : 'rgba(56, 189, 248, 0.22)';
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

      // Aurora reflections on water
      if (timeOfDay === 'aurora') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        for (let i = 0; i < 4; i++) {
          const wy = oceanY + 30 + i * 40;
          const wx = (Math.sin(time * 0.8 + i) * 60) + width * 0.5;
          ctx.beginPath();
          ctx.ellipse(wx, wy, width * 0.35, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Floating Distant Icebergs
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

      drawIceberg(width * 0.15, oceanY + 25, 110, 45);
      drawIceberg(width * 0.82, oceanY + 35, 140, 55);

      // 7. Diving Bubbles Effect (when isDiving is true)
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

      // 8. Gentle Falling Snowflakes
      ctx.fillStyle = '#ffffff';
      snowflakes.forEach((f) => {
        f.y += f.speed;
        f.x += f.wind + Math.sin(time + f.y * 0.01) * 0.5;

        if (f.y > height) {
          f.y = -10;
          f.x = Math.random() * width;
        }
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [timeOfDay, isDiving]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
