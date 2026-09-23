import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Check, Sparkles, Maximize2 } from 'lucide-react';
import QRCode from 'qrcode';
import { Treasure, PlayerProgress } from '../types';

// Rock-solid rounded rectangle drawer compatible with all mobile browsers (WeChat XWeb, older WebViews)
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    try {
      ctx.roundRect(x, y, w, h, r);
      return;
    } catch {
      // Fall through to manual arcTo
    }
  }
  const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

interface ShareModalProps {
  onClose: () => void;
  treasure?: Treasure | null;
  progress: PlayerProgress;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, treasure, progress }) => {
  const [activeType, setActiveType] = useState<'treasure' | 'focus'>(treasure ? 'treasure' : 'focus');
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmall = window.innerWidth < 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|MicroMessenger/i.test(navigator.userAgent);
    return hasTouch || isSmall || isMobileUA;
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 768;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|MicroMessenger/i.test(navigator.userAgent);
      setIsMobile(hasTouch || isSmall || isMobileUA);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate the poster on canvas
  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;


    // High-resolution canvas (800 x 1060, 4:5.3 portrait ratio)
    const w = 800;
    const h = 1060;
    canvas.width = w;
    canvas.height = h;

    // 1. Background: Deep Polar Night to Aurora Glow
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#030814');
    bgGrad.addColorStop(0.35, '#061a32');
    bgGrad.addColorStop(0.7, '#0a2a44');
    bgGrad.addColorStop(1, '#051220');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Waving Aurora Ribbons
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const ribbons = [
      { color: 'rgba(52, 211, 153, 0.28)', y: 220, amp: 45 },
      { color: 'rgba(56, 189, 248, 0.24)', y: 280, amp: 35 },
      { color: 'rgba(192, 132, 252, 0.22)', y: 200, amp: 50 },
    ];
    ribbons.forEach((r) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 20) {
        const y = r.y + Math.sin(x * 0.005) * r.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();
      ctx.fillStyle = r.color;
      ctx.fill();
    });
    ctx.restore();

    // 3. Crisp Stars in the Sky
    for (let i = 0; i < 70; i++) {
      const sx = (i * 1234.5) % w;
      const sy = (i * 876.3) % (h * 0.45);
      const sr = (i % 3) * 0.8 + 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = i % 5 === 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(224, 242, 254, 0.55)';
      ctx.fill();
    }

    // 4. Crescent Moon
    const moonX = w - 100;
    const moonY = 95;
    const moonR = 24;
    ctx.save();
    // Halo
    const halo = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR * 3);
    halo.addColorStop(0, 'rgba(224, 242, 254, 0.3)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
    ctx.fill();
    // Crescent Body
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, Math.PI * 0.3, Math.PI * 1.7, false);
    ctx.arc(moonX + moonR * 0.5, moonY, moonR * 0.85, Math.PI * 1.6, Math.PI * 0.4, true);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(224, 242, 254, 0.8)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // 5. Outer Frame / Border
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, w - 56, h - 56);
    // Inner decorative corners
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
    ctx.lineWidth = 3;
    const corner = 20;
    // top-left
    ctx.beginPath(); ctx.moveTo(28, 28 + corner); ctx.lineTo(28, 28); ctx.lineTo(28 + corner, 28); ctx.stroke();
    // top-right
    ctx.beginPath(); ctx.moveTo(w - 28 - corner, 28); ctx.lineTo(w - 28, 28); ctx.lineTo(w - 28, 28 + corner); ctx.stroke();
    // bottom-left
    ctx.beginPath(); ctx.moveTo(28, h - 28 - corner); ctx.lineTo(28, h - 28); ctx.lineTo(28 + corner, h - 28); ctx.stroke();
    // bottom-right
    ctx.beginPath(); ctx.moveTo(w - 28 - corner, h - 28); ctx.lineTo(w - 28, h - 28); ctx.lineTo(w - 28, h - 28 - corner); ctx.stroke();

    // 6. Header: Brand & Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '600 15px "Quicksand", sans-serif';
    ctx.fillText('A U R O R A   D R I F T', w / 2, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText('ICE OTTER · POLAR COMPANION', w / 2, 104);

    // 7. Center Card
    const cardX = 44;
    const cardY = 126;
    const cardW = w - 88; // 712
    const cardH = 698;

    // Card background (translucent obsidian polar plate)
    ctx.fillStyle = 'rgba(7, 21, 38, 0.94)';
    ctx.beginPath();
    drawRoundRect(ctx, cardX, cardY, cardW, cardH, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Standardized Art Plate Dimensions (IDENTICAL for both Mode A & Mode B)
    const plateX = cardX + 22;
    const plateY = cardY + 22;
    const plateW = cardW - 44; // 668
    const plateH = 265; // EXACT same height for both Fox and Otter plates!

    if (activeType === 'treasure' && treasure) {
      // ==========================================
      // --- MODE A: Treasure / Postcard Card ---
      // ==========================================

      // 1. Postcard Illustration Art Plate
      ctx.save();
      ctx.beginPath();
      drawRoundRect(ctx, plateX, plateY, plateW, plateH, 18);
      ctx.clip();

      // Atmospheric Polar Sky in Art Plate
      const plateSky = ctx.createLinearGradient(plateX, plateY, plateX, plateY + plateH);
      plateSky.addColorStop(0, '#040d1c');
      plateSky.addColorStop(0.45, '#0a233d');
      plateSky.addColorStop(0.85, '#12415d');
      plateSky.addColorStop(1, '#092539');
      ctx.fillStyle = plateSky;
      ctx.fillRect(plateX, plateY, plateW, plateH);

      // Miniature Aurora wave inside plate
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const plateAurora = ctx.createLinearGradient(plateX, plateY + 10, plateX, plateY + 140);
      plateAurora.addColorStop(0, 'rgba(52, 211, 153, 0)');
      plateAurora.addColorStop(0.5, 'rgba(52, 211, 153, 0.38)');
      plateAurora.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = plateAurora;
      ctx.beginPath();
      ctx.moveTo(plateX, plateY + 30);
      ctx.bezierCurveTo(plateX + 160, plateY + 5, plateX + 380, plateY + 85, plateX + plateW, plateY + 25);
      ctx.lineTo(plateX + plateW, plateY + 160);
      ctx.lineTo(plateX, plateY + 160);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Distant icy mountains in plate
      ctx.fillStyle = '#051627';
      ctx.beginPath();
      ctx.moveTo(plateX, plateY + plateH);
      ctx.lineTo(plateX + 100, plateY + plateH - 85);
      ctx.lineTo(plateX + 220, plateY + plateH - 45);
      ctx.lineTo(plateX + 360, plateY + plateH - 115);
      ctx.lineTo(plateX + 500, plateY + plateH - 55);
      ctx.lineTo(plateX + plateW, plateY + plateH - 95);
      ctx.lineTo(plateX + plateW, plateY + plateH);
      ctx.closePath();
      ctx.fill();

      // Mountain Snow Highlights
      ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
      ctx.beginPath();
      ctx.moveTo(plateX + 360, plateY + plateH - 115);
      ctx.lineTo(plateX + 335, plateY + plateH - 80);
      ctx.lineTo(plateX + 385, plateY + plateH - 75);
      ctx.closePath();
      ctx.fill();

      // Frosted ocean shelf at bottom
      ctx.fillStyle = 'rgba(10, 32, 54, 0.88)';
      ctx.fillRect(plateX, plateY + plateH - 44, plateW, 44);

      // Hero Pedestal / Medallion (Bright Frost White for 100% Crisp Emoji Contrast)
      const discX = w / 2;
      const discY = plateY + 118;
      const discR = 64;

      // Outer radiant glow
      const glowGrad = ctx.createRadialGradient(discX, discY, discR * 0.4, discX, discY, discR * 2.2);
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.28)');
      glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(discX, discY, discR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Disc body: high-contrast brilliant frost white
      const discGrad = ctx.createLinearGradient(discX, discY - discR, discX, discY + discR);
      discGrad.addColorStop(0, '#ffffff');
      discGrad.addColorStop(0.7, '#f0f9ff');
      discGrad.addColorStop(1, '#dbeafe');
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.arc(discX, discY, discR, 0, Math.PI * 2);
      ctx.fill();

      // Disc Border (Gold for legendary, Cyan for rare/common)
      ctx.strokeStyle = treasure.rarity === 'legendary' ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Inner thin rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(discX, discY, discR - 5, 0, Math.PI * 2);
      ctx.stroke();

      // The Hero Animal / Relic Icon (Matching Collection Album Native Emoji)
      ctx.save();
      ctx.font = '76px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(treasure.icon, discX, discY + 5);
      ctx.restore();

      // Vintage Polar Postage Stamp (top right of Art Plate)
      const stampX = plateX + plateW - 105;
      const stampY = plateY + 16;
      const stampW = 86;
      const stampH = 104;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(stampX, stampY, stampW, stampH);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(stampX, stampY, stampW, stampH);

      // Stamp inner border
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.strokeRect(stampX + 4, stampY + 4, stampW - 8, stampH - 8);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ARCTIC POST', stampX + stampW / 2, stampY + 18);

      ctx.font = '26px sans-serif';
      ctx.fillText('❄️', stampX + stampW / 2, stampY + 53);

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 10px "Outfit", sans-serif';
      ctx.fillText('78°N · $1.20', stampX + stampW / 2, stampY + 82);

      // Postal Ink Cancellation Stamp
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(stampX + 10, stampY + stampH - 12, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(stampX + 10, stampY + stampH - 12, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom Location Label on Plate
      ctx.fillStyle = 'rgba(2, 10, 22, 0.85)';
      ctx.fillRect(plateX, plateY + plateH - 32, plateW, 32);
      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📍 ARCTIC CIRCLE ARCHIPELAGO · EXPEDITION ARCHIVE', w / 2, plateY + plateH - 12);

      ctx.restore(); // end plate clipping

      // Plate Frame Outer Stroke
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      drawRoundRect(ctx, plateX, plateY, plateW, plateH, 18);
      ctx.stroke();

      // 2. Rarity Stars Banner
      const starY = plateY + plateH + 26; // 150 + 265 + 26 = 441
      const rarityStars =
        treasure.rarity === 'legendary'
          ? '★ ★ ★ ★ ★  LEGENDARY TREASURE  ★ ★ ★ ★ ★'
          : treasure.rarity === 'rare'
          ? '★ ★ ★  RARE POLAR DISCOVERY  ★ ★ ★'
          : '★ ★ ☆  POLAR POSTCARD  ☆ ★ ★';

      ctx.fillStyle = treasure.rarity === 'legendary' ? '#f59e0b' : '#38bdf8';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(rarityStars, w / 2, starY);

      // 3. Title (Prominent, High-Contrast White)
      const titleY = starY + 38; // 479
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 31px "Outfit", sans-serif';
      ctx.fillText(treasure.title, w / 2, titleY);

      // 4. Author / Origin Subtitle
      const authorY = titleY + 26; // 505
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 15px "Quicksand", sans-serif';
      ctx.fillText(
        treasure.author ? `— By ${treasure.author} —` : '— Polar Expedition Field Discovery —',
        w / 2,
        authorY
      );

      // 5. Field Notes & Journal Entry Parchment Box
      const noteX = cardX + 22;
      const noteY = authorY + 18; // 523
      const noteW = cardW - 44; // 668
      const noteH = 202; // ends at 725

      ctx.fillStyle = 'rgba(2, 11, 23, 0.88)';
      ctx.beginPath();
      drawRoundRect(ctx, noteX, noteY, noteW, noteH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Journal entry header
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📜 EXPEDITION FIELD NOTES & RECOLLECTIONS', w / 2, noteY + 26);

      // Description text
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '400 16px "Quicksand", sans-serif';
      wrapText(ctx, treasure.description, w / 2, noteY + 58, noteW - 60, 24);

      // Divider line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 140, noteY + 112);
      ctx.lineTo(w / 2 + 140, noteY + 112);
      ctx.stroke();

      // Flavor quote in warm glowing golden italic script
      ctx.fillStyle = '#fef08a';
      ctx.font = 'italic 16px "Quicksand", sans-serif';
      wrapText(ctx, `${treasure.flavorText}`, w / 2, noteY + 144, noteW - 70, 24);

      // 6. Bottom Metadata Badges Row
      const badgeY = noteY + noteH + 16; // 741
      const bColW = (noteW - 16) / 3;

      const drawMiniBadge = (x: number, label: string, val: string) => {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.beginPath();
        drawRoundRect(ctx, x, badgeY, bColW, 36, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 11px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 14, badgeY + 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val, x + bColW - 14, badgeY + 22);
      };

      drawMiniBadge(noteX, 'TYPE', treasure.type.toUpperCase());
      drawMiniBadge(noteX + bColW + 8, 'RARITY', treasure.rarity.toUpperCase());
      drawMiniBadge(noteX + (bColW + 8) * 2, 'STATUS', 'UNLOCKED');

    } else {
      // ==========================================
      // --- MODE B: Focus Journey / Milestone Card ---
      // ==========================================

      // 1. Hero Avatar Plate (EXACTLY 265px height, matching Mode A!)
      ctx.save();
      ctx.beginPath();
      drawRoundRect(ctx, plateX, plateY, plateW, plateH, 18);
      ctx.clip();

      const plateSky = ctx.createLinearGradient(plateX, plateY, plateX, plateY + plateH);
      plateSky.addColorStop(0, '#040d1c');
      plateSky.addColorStop(0.45, '#0a233d');
      plateSky.addColorStop(0.85, '#12415d');
      plateSky.addColorStop(1, '#092539');
      ctx.fillStyle = plateSky;
      ctx.fillRect(plateX, plateY, plateW, plateH);

      // Aurora ribbon
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const plateAurora = ctx.createLinearGradient(plateX, plateY + 10, plateX, plateY + 140);
      plateAurora.addColorStop(0, 'rgba(52, 211, 153, 0)');
      plateAurora.addColorStop(0.5, 'rgba(52, 211, 153, 0.38)');
      plateAurora.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = plateAurora;
      ctx.beginPath();
      ctx.moveTo(plateX, plateY + 30);
      ctx.bezierCurveTo(plateX + 160, plateY + 5, plateX + 380, plateY + 85, plateX + plateW, plateY + 25);
      ctx.lineTo(plateX + plateW, plateY + 160);
      ctx.lineTo(plateX, plateY + 160);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Distant icy mountains in plate
      ctx.fillStyle = '#051627';
      ctx.beginPath();
      ctx.moveTo(plateX, plateY + plateH);
      ctx.lineTo(plateX + 100, plateY + plateH - 85);
      ctx.lineTo(plateX + 220, plateY + plateH - 45);
      ctx.lineTo(plateX + 360, plateY + plateH - 115);
      ctx.lineTo(plateX + 500, plateY + plateH - 55);
      ctx.lineTo(plateX + plateW, plateY + plateH - 95);
      ctx.lineTo(plateX + plateW, plateY + plateH);
      ctx.closePath();
      ctx.fill();

      // Mountain Snow Highlights
      ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
      ctx.beginPath();
      ctx.moveTo(plateX + 360, plateY + plateH - 115);
      ctx.lineTo(plateX + 335, plateY + plateH - 80);
      ctx.lineTo(plateX + 385, plateY + plateH - 75);
      ctx.closePath();
      ctx.fill();

      // Frosted ocean shelf at bottom
      ctx.fillStyle = 'rgba(10, 32, 54, 0.88)';
      ctx.fillRect(plateX, plateY + plateH - 44, plateW, 44);

      // Center Otter Disc (Same size & glowing pedestal as Fox!)
      const discX = w / 2;
      const discY = plateY + 118;
      const discR = 64;

      const glowGrad = ctx.createRadialGradient(discX, discY, discR * 0.4, discX, discY, discR * 2.2);
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.28)');
      glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(discX, discY, discR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      const discGrad = ctx.createLinearGradient(discX, discY - discR, discX, discY + discR);
      discGrad.addColorStop(0, '#ffffff');
      discGrad.addColorStop(0.7, '#f0f9ff');
      discGrad.addColorStop(1, '#dbeafe');
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.arc(discX, discY, discR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Inner thin rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(discX, discY, discR - 5, 0, Math.PI * 2);
      ctx.stroke();

      // The Hero Ice Otter Icon (Matching Collection Album Native Emoji)
      ctx.save();
      ctx.font = '76px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('🦦', discX, discY + 5);
      ctx.restore();

      // Vintage Postage Stamp on Focus Card
      const stampX = plateX + plateW - 105;
      const stampY = plateY + 16;
      const stampW = 86;
      const stampH = 104;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(stampX, stampY, stampW, stampH);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(stampX, stampY, stampW, stampH);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.strokeRect(stampX + 4, stampY + 4, stampW - 8, stampH - 8);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EXPEDITION', stampX + stampW / 2, stampY + 18);

      ctx.font = '26px sans-serif';
      ctx.fillText('🧭', stampX + stampW / 2, stampY + 53);

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 10px "Outfit", sans-serif';
      ctx.fillText('78°N · FOCUS', stampX + stampW / 2, stampY + 82);

      // Cancellation mark
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(stampX + 10, stampY + stampH - 12, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(stampX + 10, stampY + stampH - 12, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom Location Label on Plate
      ctx.fillStyle = 'rgba(2, 10, 22, 0.85)';
      ctx.fillRect(plateX, plateY + plateH - 32, plateW, 32);
      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📍 POLAR DRIFT · DEEP DIVE FOCUS SANCTUARY', w / 2, plateY + plateH - 12);

      ctx.restore();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      drawRoundRect(ctx, plateX, plateY, plateW, plateH, 18);
      ctx.stroke();

      // 2. Starry Milestone Banner (Matching Mode A's Star Banner)
      const starY = plateY + plateH + 26; // 441
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ ★ ★  DAILY FOCUS MILESTONE  ★ ★ ★', w / 2, starY);

      // 3. Title (Matching Mode A's Title Position & Font)
      const titleY = starY + 38; // 479
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 31px "Outfit", sans-serif';
      ctx.fillText('Polar Focus Milestone', w / 2, titleY);

      // 4. Subtitle (Matching Mode A's Subtitle Position)
      const subY = titleY + 26; // 505
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 15px "Quicksand", sans-serif';
      ctx.fillText('— Deep Work & Ambient Ocean Journey —', w / 2, subY);

      // 5. Stats Triple Cards (Sleek, Proportional, Starting at y = 523)
      const statsY = subY + 18; // 523
      const statH = 80;
      const colWidth = (plateW - 16) / 3;

      const drawStatBox = (x: number, title: string, value: string, icon: string) => {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.beginPath();
        drawRoundRect(ctx, x, statsY, colWidth, statH, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.font = '13.5px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(icon + ' ' + title, x + colWidth / 2, statsY + 28);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.fillText(value, x + colWidth / 2, statsY + 62);
      };

      const focusMins = progress?.totalFocusMinutes ?? 0;
      const shellsCracked = progress?.totalShellsCracked ?? 0;
      const treasureCount = progress?.unlockedTreasureIds?.length ?? 0;
      const streakDays = progress?.streakDays ?? 1;
      const pearlsFound = progress?.pearls ?? 0;
      const decorCount = progress?.decorations
        ? Object.values(progress.decorations).filter(Boolean).length
        : 0;

      drawStatBox(plateX, 'Focus Time', `${focusMins} mins`, '⏱️');
      drawStatBox(plateX + colWidth + 8, 'Shells Cracked', `${shellsCracked}`, '🦪');
      drawStatBox(plateX + (colWidth + 8) * 2, 'Treasures', `${treasureCount} / 16`, '✨');

      // 6. Arctic Otter Wisdom & Journal Box (Starting at y = 617, ending at 725, matching Mode A!)
      const quoteBoxY = statsY + statH + 14; // 617
      const quoteW = plateW;
      const quoteH = 108; // ends at 725

      ctx.fillStyle = 'rgba(2, 11, 23, 0.88)';
      ctx.beginPath();
      drawRoundRect(ctx, plateX, quoteBoxY, quoteW, quoteH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📜 ARCTIC OTTER JOURNAL & WISDOM', w / 2, quoteBoxY + 24);

      // Divider line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 130, quoteBoxY + 38);
      ctx.lineTo(w / 2 + 130, quoteBoxY + 38);
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'italic 15.5px "Quicksand", sans-serif';
      const quotes = [
        '“Slide on your belly whenever you find snow. Keep your favourite stone close.”',
        '“In this bustling world, give yourself a quiet ocean of peaceful stars.”',
        '“Take a deep breath and listen to the waves. Calm waters run deep.”',
      ];
      const selectedQuote = quotes[focusMins % quotes.length];
      wrapText(ctx, selectedQuote, w / 2, quoteBoxY + 64, quoteW - 50, 22);

      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 12px "Quicksand", sans-serif';
      ctx.fillText('— The Arctic Otter Creed —', w / 2, quoteBoxY + 94);

      // 7. Bottom Badges Row (At y = 741, exactly matching Mode A!)
      const badgeY = quoteBoxY + quoteH + 16; // 741
      const bColW = (plateW - 16) / 3;

      const drawFocusBadge = (x: number, label: string, val: string) => {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.beginPath();
        drawRoundRect(ctx, x, badgeY, bColW, 36, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 11px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 14, badgeY + 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val, x + bColW - 14, badgeY + 22);
      };

      drawFocusBadge(plateX, 'STREAK', `${streakDays} ${streakDays === 1 ? 'DAY' : 'DAYS'}`);
      drawFocusBadge(plateX + bColW + 8, 'PEARLS', `${pearlsFound} FOUND`);
      drawFocusBadge(plateX + (bColW + 8) * 2, 'CAMP DECOR', `${decorCount} / 4 UNLOCKED`);
    }

    // ==========================================
    // 8. Footer: Brand Info & High-Contrast QR Code
    // ==========================================
    const footerLineY = cardY + cardH + 24; // 126 + 698 + 24 = 848

    // Stylized Divider Line spanning across card width
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX, footerLineY);
    ctx.lineTo(cardX + cardW, footerLineY);
    ctx.stroke();

    // --- Right Column: Scannable QR Code ---
    const qrBoxW = 120;
    const qrBoxH = 120;
    const qrBoxX = cardX + cardW - qrBoxW; // 44 + 712 - 120 = 636
    const qrBoxY = footerLineY + 16; // 848 + 16 = 864

    // High-contrast pure white rounded plate for 100% instant camera/WeChat scanning
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    drawRoundRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw QR Code Modules
    try {
      const qr = QRCode.create('https://iceotter.com', { errorCorrectionLevel: 'M' });
      const qrSize = qr.modules.size; // 25
      const modSize = 4.16; // 25 * 4.16 = 104px
      const qrOffsetX = qrBoxX + (qrBoxW - qrSize * modSize) / 2;
      const qrOffsetY = qrBoxY + (qrBoxH - qrSize * modSize) / 2;
      ctx.fillStyle = '#061628'; // deep polar navy
      for (let r = 0; r < qrSize; r++) {
        for (let c = 0; c < qrSize; c++) {
          if (qr.modules.get(r, c)) {
            ctx.fillRect(qrOffsetX + c * modSize, qrOffsetY + r * modSize, modSize + 0.3, modSize + 0.3);
          }
        }
      }
    } catch (e) {
      console.warn('QR code drawing failed:', e);
    }

    // Mini scan prompt under QR card
    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 10px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO VISIT', qrBoxX + qrBoxW / 2, qrBoxY + qrBoxH + 16);

    // --- Left Column: Brand & Value Proposition ---
    const infoX = cardX + 2;
    ctx.textAlign = 'left';

    // 1. Polar sanctuary badge
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText('🦦  AURORA DRIFT · ICE OTTER SANCTUARY', infoX, qrBoxY + 16);

    // 2. Domain Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillText('iceotter.com', infoX, qrBoxY + 48);

    // 3. Slogan
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13.5px "Quicksand", sans-serif';
    ctx.fillText('No Ads · Cozy Ambient Sound & Minimalist Focus Companion', infoX, qrBoxY + 74);

    // 4. Call-to-action note
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '600 12.5px "Quicksand", sans-serif';
    ctx.fillText('✨ Scan the QR code to drift with your Ice Otter under the stars', infoX, qrBoxY + 98);

    // 5. Features metadata line
    ctx.fillStyle = '#64748b';
    ctx.font = '500 11.5px "Outfit", sans-serif';
    ctx.fillText('100% FREE  ·  NO ADS  ·  DEEP FOCUS  ·  LOFI AMBIENT', infoX, qrBoxY + 122);

    // Generate exportable DataURL
    try {
      const url = canvas.toDataURL('image/png');
      setPosterUrl(url);
    } catch {
      // Fallback
    }
  } catch (err) {
    console.error('Failed to generate share poster:', err);
  }
  }, [activeType, treasure, progress]);

  // Helper function to wrap text neatly on canvas
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string | undefined | null,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + (line ? ' ' : '') + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  // Handle touch swiping left/right between cards
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !treasure) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> switch to focus
        setActiveType('focus');
      } else {
        // Swiped right -> switch to treasure
        setActiveType('treasure');
      }
    }
    touchStartX.current = null;
  };

  // Handle Image Download / Native Share Sheet
  const handleDownload = async () => {
    if (!posterUrl) return;

    // Check if Web Share API can share the image file directly (iOS Safari 15+)
    if (canvasRef.current && navigator.share && navigator.canShare) {
      try {
        setIsSharing(true);
        const canvas = canvasRef.current;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        );
        if (blob) {
          const fileName = `ice-otter-${activeType === 'treasure' && treasure ? treasure.id : 'focus'}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Ice Otter Sanctuary Postcard',
              text: 'Relaxing polar focus companion under the aurora lights 🦦✨ Visit iceotter.com',
            });
            setIsSharing(false);
            return;
          }
        }
      } catch (err: any) {
        setIsSharing(false);
        if (err.name === 'AbortError') {
          return;
        }
        console.warn('Share API failed, falling back to download:', err);
      }
      setIsSharing(false);
    }

    // Fallback: standard anchor download
    const link = document.createElement('a');
    link.download = `ice-otter-${activeType === 'treasure' && treasure ? treasure.id : 'focus'}.png`;
    link.href = posterUrl;
    link.click();
  };

  // Handle Copy Social Caption
  const handleCopyCaption = () => {
    let caption = '';
    if (activeType === 'treasure' && treasure) {
      caption = `❄️ Discovered a polar treasure in Aurora Drift at iceotter.com: "${treasure.title}"!\n${treasure.flavorText}\n✨ Peaceful focus companion with an Arctic Ice Otter under the northern lights 🦦 #studywithme #cozyweb #focus #lofi #ambient #iceotter`;
    } else {
      const mins = progress?.totalFocusMinutes ?? 0;
      const shells = progress?.totalShellsCracked ?? 0;
      caption = `⏱️ Focused for ${mins} minutes and cracked ${shells} shells at iceotter.com today!\n🎧 Procedural polar wind, crackling fire, and ocean waves with my Ice Otter 🦦✨ #studywithme #pomodoro #deepwork #lofi #cozyweb`;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(caption).catch(() => {});
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = caption;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn touch-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#07172b] rounded-3xl p-4 sm:p-6 flex flex-col border border-sky-400/50 shadow-2xl modal-crisp max-h-[calc(var(--app-height,100svh)-2rem)] sm:max-h-[90vh] overflow-y-auto modal-scrollbar overscroll-contain touch-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Hidden rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-900/80 text-sky-400 border border-sky-500/40 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Share Poster Generator
              </h3>
              <p className="text-[11px] text-sky-300">
                Save as a high-resolution poster or copy social caption
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (if treasure exists) */}
        {treasure && (
          <div className="flex items-center gap-2 pt-3 pb-1 shrink-0">
            <button
              onClick={() => setActiveType('treasure')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeType === 'treasure'
                  ? 'bg-sky-400 text-sky-950 shadow-sm'
                  : 'bg-sky-950/60 text-sky-300 hover:text-white border border-sky-800/50'
              }`}
            >
              💌 Treasure Postcard
            </button>
            <button
              onClick={() => setActiveType('focus')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeType === 'focus'
                  ? 'bg-sky-400 text-sky-950 shadow-sm'
                  : 'bg-sky-950/60 text-sky-300 hover:text-white border border-sky-800/50'
              }`}
            >
              ⏱️ Focus Milestone
            </button>
          </div>
        )}

        {/* Poster Image Preview Container */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="my-2.5 rounded-2xl border border-sky-700/50 bg-[#030a14] shadow-2xl flex flex-col items-center justify-center p-2 sm:p-2.5 relative group shrink-0"
        >
          {posterUrl ? (
            <div className="relative w-full flex items-center justify-center">
              <img
                src={posterUrl}
                alt="Polar Share Poster"
                onClick={() => setIsZoomed(true)}
                className="max-h-[42dvh] sm:max-h-[50dvh] w-auto max-w-full object-contain rounded-xl shadow-md block cursor-zoom-in active:scale-[0.99] transition-transform"
              />
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white border border-sky-500/40 backdrop-blur-sm shadow-md transition-all text-[11px] flex items-center gap-1 opacity-80 hover:opacity-100"
                title="Tap to view full resolution"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enlarge</span>
              </button>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs text-sky-400">
              Generating poster...
            </div>
          )}

          {/* Swipe / Slider dots if treasure exists */}
          {treasure && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveType('treasure')}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeType === 'treasure' ? 'w-6 bg-sky-400 shadow-sm' : 'w-2 bg-sky-800/80 hover:bg-sky-700'
                }`}
                aria-label="Treasure Postcard"
                title="Treasure Postcard"
              />
              <button
                onClick={() => setActiveType('focus')}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeType === 'focus' ? 'w-6 bg-sky-400 shadow-sm' : 'w-2 bg-sky-800/80 hover:bg-sky-700'
                }`}
                aria-label="Focus Milestone"
                title="Focus Milestone"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 shrink-0">
          <button
            onClick={handleDownload}
            disabled={!posterUrl || isSharing}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-sky-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            {isSharing ? (
              <span>Preparing poster...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Save Poster Image</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyCaption}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-900/80 hover:bg-sky-800 text-sky-100 font-bold text-xs flex items-center justify-center gap-2 border border-sky-600/50 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Caption Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Caption</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile quick tips */}
        {isMobile && (
          <p className="text-[11px] text-sky-400/80 text-center pt-2 select-none shrink-0">
            Tip: Tap poster to enlarge or long-press to save directly to Photos
          </p>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 animate-fadeIn cursor-zoom-out"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-sky-950/85 text-sky-200 hover:text-white border border-sky-400/40 z-10"
            aria-label="Close enlarged view"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] flex items-center justify-center p-2"
          >
            <img
              src={posterUrl}
              alt="Polar Share Poster Full Resolution"
              className="max-h-[82dvh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-sky-500/40"
            />
          </div>
          <p className="text-xs text-sky-300/90 mt-2 select-none">
            Tap anywhere outside or press close to return
          </p>
        </div>
      )}
    </div>
  );
};
