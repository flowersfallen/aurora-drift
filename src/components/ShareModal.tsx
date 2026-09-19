import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';
import { Treasure, PlayerProgress } from '../types';

interface ShareModalProps {
  onClose: () => void;
  treasure?: Treasure | null;
  progress: PlayerProgress;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, treasure, progress }) => {
  const [activeType, setActiveType] = useState<'treasure' | 'focus'>(treasure ? 'treasure' : 'focus');
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate the poster on canvas
  useEffect(() => {
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
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '600 16px "Quicksand", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A U R O R A   D R I F T', w / 2, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillText('ICE OTTER · POLAR COMPANION', w / 2, 115);

    // 7. Center Card
    const cardX = 50;
    const cardY = 140;
    const cardW = w - 100; // 700
    const cardH = 710;

    // Card background (translucent obsidian polar plate)
    ctx.fillStyle = 'rgba(7, 21, 38, 0.92)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (activeType === 'treasure' && treasure) {
      // ==========================================
      // --- MODE A: Treasure / Postcard Card ---
      // ==========================================

      // 1. Postcard Illustration Art Plate
      const plateX = cardX + 22;
      const plateY = cardY + 22;
      const plateW = cardW - 44; // 656
      const plateH = 260;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(plateX, plateY, plateW, plateH, 18);
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
      const discY = plateY + 115;
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

      // The Hero Animal / Relic Icon (Drawn crisp & large on clean white disc)
      ctx.font = '78px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(treasure.icon, discX, discY + 5);
      ctx.textBaseline = 'alphabetic'; // reset

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
      ctx.fillStyle = 'rgba(2, 10, 22, 0.82)';
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
      ctx.roundRect(plateX, plateY, plateW, plateH, 18);
      ctx.stroke();

      // 2. Rarity Stars Banner
      const starY = plateY + plateH + 28;
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
      const titleY = starY + 40;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Outfit", sans-serif';
      ctx.fillText(treasure.title, w / 2, titleY);

      // 4. Author / Origin Subtitle
      const authorY = titleY + 26;
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 15px "Quicksand", sans-serif';
      ctx.fillText(
        treasure.author ? `— By ${treasure.author} —` : '— Polar Expedition Field Discovery —',
        w / 2,
        authorY
      );

      // 5. Field Notes & Journal Entry Parchment Box
      const noteX = cardX + 24;
      const noteY = authorY + 18;
      const noteW = cardW - 48; // 652
      const noteH = 188;

      ctx.fillStyle = 'rgba(2, 11, 23, 0.88)';
      ctx.beginPath();
      ctx.roundRect(noteX, noteY, noteW, noteH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Journal entry header
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FIELD NOTES & RECOLLECTIONS', w / 2, noteY + 24);

      // Description text
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '400 16px "Quicksand", sans-serif';
      wrapText(ctx, treasure.description, w / 2, noteY + 54, noteW - 60, 24);

      // Divider line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 120, noteY + 102);
      ctx.lineTo(w / 2 + 120, noteY + 102);
      ctx.stroke();

      // Flavor quote in warm glowing golden italic script
      ctx.fillStyle = '#fef08a';
      ctx.font = 'italic 16px "Quicksand", sans-serif';
      wrapText(ctx, `${treasure.flavorText}`, w / 2, noteY + 132, noteW - 70, 24);

      // 6. Bottom Metadata Badges Row
      const badgeY = noteY + noteH + 20;
      const bColW = (noteW - 16) / 3;

      const drawMiniBadge = (x: number, label: string, val: string) => {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.beginPath();
        ctx.roundRect(x, badgeY, bColW, 36, 10);
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

      // 1. Hero Avatar Plate
      const plateX = cardX + 22;
      const plateY = cardY + 22;
      const plateW = cardW - 44;
      const plateH = 210;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(plateX, plateY, plateW, plateH, 18);
      ctx.clip();

      const plateSky = ctx.createLinearGradient(plateX, plateY, plateX, plateY + plateH);
      plateSky.addColorStop(0, '#040d1c');
      plateSky.addColorStop(0.5, '#0a233d');
      plateSky.addColorStop(1, '#0e344d');
      ctx.fillStyle = plateSky;
      ctx.fillRect(plateX, plateY, plateW, plateH);

      // Aurora ribbon
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const plateAurora = ctx.createLinearGradient(plateX, plateY + 10, plateX, plateY + 120);
      plateAurora.addColorStop(0, 'rgba(52, 211, 153, 0)');
      plateAurora.addColorStop(0.5, 'rgba(52, 211, 153, 0.35)');
      plateAurora.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = plateAurora;
      ctx.beginPath();
      ctx.moveTo(plateX, plateY + 25);
      ctx.bezierCurveTo(plateX + 160, plateY + 5, plateX + 380, plateY + 75, plateX + plateW, plateY + 20);
      ctx.lineTo(plateX + plateW, plateY + 140);
      ctx.lineTo(plateX, plateY + 140);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Floating Iceberg
      ctx.fillStyle = '#104e7a';
      ctx.beginPath();
      ctx.moveTo(plateX + plateW * 0.1, plateY + plateH);
      ctx.lineTo(plateX + plateW * 0.22, plateY + plateH - 55);
      ctx.lineTo(plateX + plateW * 0.35, plateY + plateH);
      ctx.closePath();
      ctx.fill();

      // Center Otter Disc
      const discX = w / 2;
      const discY = plateY + 88;
      const discR = 56;

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
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '68px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦦', discX, discY + 4);
      ctx.textBaseline = 'alphabetic';

      // Slogan inside plate
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 14px "Outfit", sans-serif';
      ctx.fillText('“Drifting calmly in glacial waters under northern lights”', w / 2, plateY + plateH - 18);

      ctx.restore();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(plateX, plateY, plateW, plateH, 18);
      ctx.stroke();

      // 2. Headline
      const headY = plateY + plateH + 34;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('POLAR FOCUS MILESTONE', w / 2, headY);

      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 15px "Quicksand", sans-serif';
      ctx.fillText('— Deep Work & Ambient Ocean Journey —', w / 2, headY + 26);

      // 3. Stats Triple Cards
      const statsY = headY + 50;
      const colWidth = (cardW - 60) / 3;

      const drawStatBox = (x: number, title: string, value: string, icon: string) => {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.beginPath();
        ctx.roundRect(x, statsY, colWidth - 8, 115, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(icon + ' ' + title, x + (colWidth - 8) / 2, statsY + 36);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.fillText(value, x + (colWidth - 8) / 2, statsY + 84);
      };

      drawStatBox(cardX + 24, 'Focus Time', `${progress.totalFocusMinutes} mins`, '⏱️');
      drawStatBox(cardX + 24 + colWidth, 'Shells Cracked', `${progress.totalShellsCracked}`, '🦪');
      drawStatBox(cardX + 24 + colWidth * 2, 'Treasures', `${progress.unlockedTreasureIds.length} / 16`, '✨');

      // 4. Arctic Otter Wisdom Parchment
      const quoteBoxY = statsY + 138;
      const quoteW = cardW - 48;
      const quoteH = 150;

      ctx.fillStyle = 'rgba(2, 11, 23, 0.88)';
      ctx.beginPath();
      ctx.roundRect(cardX + 24, quoteBoxY, quoteW, quoteH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❄️ ARCTIC OTTER WISDOM ❄️', w / 2, quoteBoxY + 32);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'italic 16px "Quicksand", sans-serif';
      const quotes = [
        '“Slide on your belly whenever you find snow. Keep your favourite stone close.”',
        '“In this bustling world, give yourself a quiet ocean of peaceful stars.”',
        '“Take a deep breath and listen to the waves. Calm waters run deep.”',
      ];
      const selectedQuote = quotes[progress.totalFocusMinutes % quotes.length];
      wrapText(ctx, selectedQuote, w / 2, quoteBoxY + 74, quoteW - 60, 24);
    }

    // 8. Footer: Brand & Link Mark
    const footerY = h - 145;

    // Stylized Divider Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cardX + 50, footerY);
    ctx.lineTo(w - cardX - 50, footerY);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText('iceotter.com', w / 2, footerY + 38);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px "Quicksand", sans-serif';
    ctx.fillText('No Ads · Cozy Ambient Sound & Minimalist Focus Companion', w / 2, footerY + 62);

    // Generate exportable DataURL
    try {
      const url = canvas.toDataURL('image/png');
      setPosterUrl(url);
    } catch {
      // Fallback
    }
  }, [activeType, treasure, progress]);

  // Helper function to wrap text neatly on canvas
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
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

  // Handle Image Download
  const handleDownload = () => {
    if (!posterUrl) return;
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
      caption = `⏱️ Focused for ${progress.totalFocusMinutes} minutes and cracked ${progress.totalShellsCracked} shells at iceotter.com today!\n🎧 Procedural polar wind, crackling fire, and ocean waves with my Ice Otter 🦦✨ #studywithme #pomodoro #deepwork #lofi #cozyweb`;
    }
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#07172b] rounded-3xl p-4 sm:p-6 flex flex-col border border-sky-400/50 shadow-2xl modal-crisp max-h-[92vh] overflow-y-auto"
      >
        {/* Hidden rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-800/60">
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
          <div className="flex items-center gap-2 pt-3 pb-1">
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
        <div className="my-3 rounded-2xl overflow-hidden border border-sky-700/50 bg-[#030a14] shadow-2xl flex items-center justify-center p-1.5 relative group">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt="Polar Share Poster"
              className="w-full max-h-[50vh] sm:max-h-[54vh] object-contain rounded-xl shadow-md"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-sky-400">
              Generating poster...
            </div>
          )}
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-sky-200/90 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-400/30 sm:hidden">
            📱 Long-press image to save on mobile
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Save Poster Image
          </button>

          <button
            onClick={handleCopyCaption}
            className="flex-1 py-2.5 px-4 rounded-xl bg-sky-900/80 hover:bg-sky-800 text-sky-100 font-bold text-xs flex items-center justify-center gap-2 border border-sky-600/50 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Caption Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Caption
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
