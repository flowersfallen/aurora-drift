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
    const cardX = 65;
    const cardY = 160;
    const cardW = w - 130;
    const cardH = 680;

    // Card background
    ctx.fillStyle = 'rgba(7, 23, 43, 0.85)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (activeType === 'treasure' && treasure) {
      // --- MODE A: Treasure / Postcard Card ---
      // Icon Box
      const iconBoxY = cardY + 50;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 65, iconBoxY, 130, 130, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();

      // Emoji Icon
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(treasure.icon, w / 2, iconBoxY + 88);

      // Rarity Badge
      const rarityY = iconBoxY + 165;
      ctx.fillStyle = treasure.rarity === 'legendary' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 80, rarityY, 160, 32, 16);
      ctx.fill();
      ctx.fillStyle = treasure.rarity === 'legendary' ? '#fcd34d' : '#7dd3fc';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText(`${treasure.rarity.toUpperCase()} ${treasure.type.toUpperCase()}`, w / 2, rarityY + 21);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Outfit", sans-serif';
      ctx.fillText(treasure.title, w / 2, rarityY + 80);

      // Author if any
      if (treasure.author) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '600 15px "Quicksand", sans-serif';
        ctx.fillText(`— By ${treasure.author} —`, w / 2, rarityY + 112);
      }

      // Description
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '400 17px "Quicksand", sans-serif';
      wrapText(ctx, treasure.description, w / 2, rarityY + 155, cardW - 80, 26);

      // Flavor Quote Box
      const quoteY = rarityY + 265;
      ctx.fillStyle = 'rgba(3, 15, 30, 0.8)';
      ctx.beginPath();
      ctx.roundRect(cardX + 35, quoteY, cardW - 70, 130, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'italic 16px "Quicksand", sans-serif';
      wrapText(ctx, `${treasure.flavorText}`, w / 2, quoteY + 45, cardW - 120, 26);

    } else {
      // --- MODE B: Focus Journey / Milestone Card ---
      // Mascot Avatar
      const avatarY = cardY + 50;
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🦦', w / 2, avatarY + 70);

      // Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Outfit", sans-serif';
      ctx.fillText('POLAR FOCUS MILESTONE', w / 2, avatarY + 130);

      ctx.fillStyle = '#7dd3fc';
      ctx.font = '500 16px "Quicksand", sans-serif';
      ctx.fillText('“Drifting calmly in glacial waters under northern lights”', w / 2, avatarY + 165);

      // Stats Triple Columns
      const statsY = avatarY + 215;
      const colWidth = (cardW - 60) / 3;

      const drawStatBox = (x: number, title: string, value: string, icon: string) => {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.beginPath();
        ctx.roundRect(x, statsY, colWidth - 10, 110, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillText(icon + ' ' + title, x + (colWidth - 10) / 2, statsY + 35);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.fillText(value, x + (colWidth - 10) / 2, statsY + 80);
      };

      drawStatBox(cardX + 25, 'Focus Time', `${progress.totalFocusMinutes} mins`, '⏱️');
      drawStatBox(cardX + 25 + colWidth, 'Shells Cracked', `${progress.totalShellsCracked}`, '🦪');
      drawStatBox(cardX + 25 + colWidth * 2, 'Treasures', `${progress.unlockedTreasureIds.length}`, '✨');

      // Warm Inspiring Quote
      const quoteBoxY = statsY + 150;
      ctx.fillStyle = 'rgba(3, 15, 30, 0.8)';
      ctx.beginPath();
      ctx.roundRect(cardX + 35, quoteBoxY, cardW - 70, 150, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "Outfit", sans-serif';
      ctx.fillText('❄️ Arctic Otter Wisdom ❄️', w / 2, quoteBoxY + 40);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'italic 16px "Quicksand", sans-serif';
      const quotes = [
        '“Slide on your belly whenever you find snow. Keep your favourite stone close.”',
        '“In this bustling world, give yourself a quiet ocean of peaceful stars.”',
        '“Take a deep breath and listen to the waves. Calm waters run deep.”',
      ];
      const selectedQuote = quotes[progress.totalFocusMinutes % quotes.length];
      wrapText(ctx, selectedQuote, w / 2, quoteBoxY + 80, cardW - 120, 26);
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
