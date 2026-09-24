import React, { useState, useEffect } from 'react';
import { OtterState, CampDecorations, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { audioEngine } from '../services/audioEngine';

// Feature detection for Unicode 14 bubble emoji 🫧
function checkBubbleEmojiSupport(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '18px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText('🫧', 12, 12);

    const imgData = ctx.getImageData(0, 0, 24, 24).data;
    let hasPixels = false;
    let hasColor = false;

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      if (a > 30) {
        hasPixels = true;
        // Real color emoji has distinct chromatic channels; missing tofu is monochrome
        if (Math.abs(r - g) > 25 || Math.abs(g - b) > 25 || Math.abs(r - b) > 25) {
          hasColor = true;
          break;
        }
      }
    }

    return hasPixels && hasColor;
  } catch {
    return false;
  }
}

interface IceOtterProps {
  state: OtterState;
  decorations: CampDecorations;
  lang?: Language;
  onOtterClick: () => void;
  hasGuestFox?: boolean;
  hasGuestWhale?: boolean;
  hasOasisBlossoms?: boolean;
}

export const IceOtter: React.FC<IceOtterProps> = ({
  state,
  decorations,
  lang = 'en',
  onOtterClick,
  hasGuestFox = false,
  hasGuestWhale = false,
  hasOasisBlossoms = false,
}) => {
  const [blink, setBlink] = useState(false);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [foxDialogue, setFoxDialogue] = useState<string | null>(null);
  const [whaleDialogue, setWhaleDialogue] = useState<string | null>(null);
  const [supportsBubbleEmoji, setSupportsBubbleEmoji] = useState(false);

  useEffect(() => {
    setSupportsBubbleEmoji(checkBubbleEmojiSupport());
  }, []);

  // Natural cute blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, []);

  const cozyQuotes = TRANSLATIONS[lang].otter.dialogues;

  const isDiving = state === 'diving';
  const isCruising = state === 'cruising';

  const handleInteraction = () => {
    if (isDiving) return;
    if (isCruising) {
      if (hasGuestWhale) {
        const whaleCruisingQuotes = TRANSLATIONS[lang].voyage.whaleCruisingDialogues;
        const randomQuote = whaleCruisingQuotes[Math.floor(Math.random() * whaleCruisingQuotes.length)];
        setDialogue(randomQuote);
        setTimeout(() => setDialogue(null), 3600);
        onOtterClick();
        return;
      }
      const pushingQuotes = TRANSLATIONS[lang].voyage.pushingDialogues;
      const randomQuote = pushingQuotes[Math.floor(Math.random() * pushingQuotes.length)];
      setDialogue(randomQuote);
      setTimeout(() => setDialogue(null), 3600);
      onOtterClick();
      return;
    }
    const randomQuote = cozyQuotes[Math.floor(Math.random() * cozyQuotes.length)];
    setDialogue(randomQuote);
    setTimeout(() => setDialogue(null), 3600);
    onOtterClick();
  };

  const handleFoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDiving) return;
    const foxQuotes = TRANSLATIONS[lang].voyage.foxDialogues;
    const randomQuote = foxQuotes[Math.floor(Math.random() * foxQuotes.length)];
    setFoxDialogue(randomQuote);
    setTimeout(() => setFoxDialogue(null), 4000);
  };

  const handleWhaleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDiving) return;
    audioEngine.init();
    audioEngine.playWhaleSong();
    const whaleQuotes = TRANSLATIONS[lang].voyage.whaleDialogues;
    const randomQuote = whaleQuotes[Math.floor(Math.random() * whaleQuotes.length)];
    setWhaleDialogue(randomQuote);
    setTimeout(() => setWhaleDialogue(null), 4500);
  };

  return (
    <div className="relative flex flex-col items-center justify-end select-none">
      {/* Speech Bubble - Floats right above otter */}
      {dialogue && !isDiving && (
        <div
          className={`absolute z-50 animate-bounce px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/95 text-slate-800 text-[11px] sm:text-xs font-semibold max-w-[85vw] sm:max-w-[240px] text-center border-2 border-sky-300 shadow-xl shadow-sky-950/40 ${
            isCruising
              ? 'top-4 sm:top-6 left-0 sm:left-2'
              : hasGuestWhale
              ? 'top-1 sm:top-2 left-[20%] -translate-x-1/2 sm:left-1/2'
              : 'top-1 sm:top-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {dialogue}
          <div
            className={`absolute -bottom-2.5 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white ${
              isCruising ? 'left-8' : 'left-1/2 -translate-x-1/2'
            }`}
          ></div>
        </div>
      )}

      {/* Aurora Fox Speech Bubble - Floats above the sleeping fox on the blanket */}
      {foxDialogue && !isDiving && (
        <div className={`absolute top-8 sm:top-10 ${hasGuestWhale ? 'left-1 sm:left-24' : 'left-16 sm:left-24'} z-50 animate-bounce px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-orange-50/95 text-slate-800 text-[11px] sm:text-xs font-semibold max-w-[85vw] sm:max-w-[230px] text-center border-2 border-orange-300 shadow-xl shadow-sky-950/40`}>
          <span className="text-orange-500 mr-1 font-bold">🦊</span>
          {foxDialogue}
          <div className="absolute -bottom-2.5 left-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-50"></div>
        </div>
      )}

      {/* Main Unified Stage: Accommodates both Floe and leading Whale seamlessly */}
      <div className={`relative w-full ${
        hasGuestWhale ? 'max-w-[380px]' : 'max-w-[76vw]'
      } max-h-[28vh] sm:max-w-[88vw] sm:max-h-[35vh] md:w-[92vw] md:max-w-[460px] md:max-h-none aspect-[460/320] flex items-center justify-center mx-auto`}>
        {/* ========================================================================= */}
        {/* 1. SEPARATE OCEAN COMPANION: HUMPBACK WHALE (300 NM Waypoint)             */}
        {/* Truly Iconic, Majestic Biological Hallmarks: Tubercles, Arched Hump,     */}
        {/* Falcate Dorsal Fin, Huge Megaptera Wing Flipper, Butterfly Tail Fluke,   */}
        {/* Luminous Ventral Throat Pleats, and Dual Water Spout Cloud!              */}
        {/* Swims in open ocean ahead of the floe, leading the polar drift!          */}
        {/* ========================================================================= */}
        {hasGuestWhale && (
          <div
            className={`absolute pointer-events-auto cursor-pointer z-20 ${
              isCruising ? 'animate-whale-cruise' : 'animate-whale-idle'
            } w-[150px] sm:w-[280px] md:w-[325px] h-[92px] sm:h-[160px] md:h-[185px] right-2 sm:-right-72 md:-right-84 lg:-right-92 -bottom-2 sm:-bottom-2 transition-all duration-700`}
            onClick={handleWhaleClick}
            title={lang === 'zh' ? '点击与伴航座头鲸互动 (聆听深海鲸鸣)' : 'Click to interact with Humpback Whale'}
          >
            {/* Whale Speech Bubble - Anchored above the whale */}
            {whaleDialogue && !isDiving && (
              <div className="absolute -top-12 right-1 sm:left-1/2 sm:-translate-x-1/2 z-50 animate-bounce px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-slate-900/95 text-cyan-200 text-[11px] sm:text-xs font-semibold whitespace-nowrap text-center border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/70">
                <span className="text-cyan-400 mr-1 font-bold">🐋</span>
                {whaleDialogue}
                <div className="absolute -bottom-2 right-8 sm:left-1/2 sm:-translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900"></div>
              </div>
            )}

            <svg viewBox="0 0 320 180" className="w-full h-full overflow-visible drop-shadow-[0_16px_36px_rgba(2,132,199,0.42)]">
              <defs>
                {/* 1. Whale Dorsal Skin Gradient: Deep Oceanic Slate with Midnight Blue Undertone */}
                <linearGradient id="whaleBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="25%" stopColor="#1e293b" />
                  <stop offset="65%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                {/* 2. Moonlight Cyan Rim Light across arched back */}
                <linearGradient id="whaleRimLight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="40%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>

                {/* 3. Radiant Ventral Throat Pleats Gradient (Cream to Slate Porcelain) */}
                <linearGradient id="whaleBellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#f8fafc" />
                  <stop offset="80%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* 4. Giant Wing Flipper Gradient */}
                <linearGradient id="flipperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="40%" stopColor="#1e293b" />
                  <stop offset="70%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>

                {/* 5. Tall Water Spout Vapor Cloud Gradient */}
                <linearGradient id="whaleSpoutGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="35%" stopColor="rgba(224,242,254,0.9)" />
                  <stop offset="75%" stopColor="rgba(125,211,252,0.6)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.15)" />
                </linearGradient>

                {/* 6. Rostrum Tubercle 3D Dome Gradient */}
                <radialGradient id="tubercleGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="45%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>

              {/* A. Concentric Oceanic Ripple Rings at Waterline Y=115 */}
              <ellipse cx="165" cy="115" rx="140" ry="16" fill="none" stroke="#7dd3fc" strokeWidth="2.2" opacity="0.6" />
              <ellipse cx="165" cy="115" rx="155" ry="20" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.3" />

              {/* Cruising Dynamic Wake Streaks */}
              {isCruising && (
                <g>
                  {/* Gentle slipstream wake trailing back from whale flukes towards the floe */}
                  <path d="M 50 116 C 20 119 -10 122 -40 125" stroke="#bae6fd" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" fill="none" className="animate-wake-stream" />
                  
                  {/* Leading Bow Wave cutting forward ahead of the whale */}
                  <path d="M 265 115 Q 285 120 305 126" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.9" />
                  <circle cx="305" cy="122" r="2.2" fill="#ffffff" className="animate-bounce" style={{ animationDuration: '0.8s' }} />
                  <circle cx="312" cy="126" r="1.8" fill="#bae6fd" className="animate-bounce" style={{ animationDuration: '1.0s', animationDelay: '0.2s' }} />
                </g>
              )}

              {/* B. Submerged Oceanic Body Shimmer */}
              <path
                d="M 50 115 C 50 148 115 165 175 165 C 235 165 295 148 295 115 Z"
                fill="#0284c7"
                opacity="0.25"
              />

              {/* =================================================================== */}
              {/* C. THE ICONIC BUTTERFLY TAIL FLUKE (Lifting Gracefully from Water)  */}
              {/* Flowing seamlessly out of the ocean at left with natural spine curve */}
              {/* =================================================================== */}
              <g id="whale-tail">
                {/* 1. Caudal Peduncle (Curving muscular tail stock rising from water) */}
                <path
                  d="M 85 115 C 72 96 55 86 38 80 C 30 86 48 102 68 115 Z"
                  fill="url(#whaleBackGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* 2. Butterfly Tail Flukes (Wide, Notched, Unmistakable Cetacean Tail) */}
                <path
                  d="M 38 78
                     C 22 60 8 52 4 60
                     C 1 68 14 78 30 76
                     C 34 76 36 73 38 72
                     C 40 73 42 76 46 76
                     C 62 78 75 68 72 60
                     C 68 52 54 60 38 78 Z"
                  fill="url(#whaleBackGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* White Underside Markings on Tail Flukes */}
                <path
                  d="M 8 61 C 16 68 27 72 34 71 C 27 68 15 60 8 61 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
                <path
                  d="M 68 61 C 60 68 49 72 42 71 C 49 68 61 60 68 61 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />


                {/* Splashing Water Droplets cascading off tail tips */}
                <circle cx="10" cy="74" r="2.2" fill="#bae6fd" className="animate-bounce" style={{ animationDuration: '1.2s' }} />
                <circle cx="65" cy="73" r="2" fill="#ffffff" className="animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '0.3s' }} />
                <circle cx="38" cy="84" r="1.8" fill="#e0f2fe" className="animate-bounce" style={{ animationDuration: '1.1s', animationDelay: '0.6s' }} />
              </g>

              {/* =================================================================== */}
              {/* D. ARCHED HUMPBACK BODY SILHOUETTE & FALCATE DORSAL FIN             */}
              {/* Proud arched hump, biological tubercles, throat pleats & giant wing */}
              {/* =================================================================== */}
              <g id="whale-body">
                {/* 1. Main Arched Humpback Torso (X=68 to X=290, Waterline Y=115) */}
                <path
                  d="M 68 115 
                     C 80 88 115 66 165 64 
                     C 210 62 250 72 278 88 
                     C 292 96 295 104 290 115 
                     C 255 116 160 116 68 115 Z"
                  fill="url(#whaleBackGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />

                {/* 2. FALCATE DORSAL FIN (Classic hooked fin perched on the posterior slope) */}
                <path
                  d="M 138 68 C 132 46 118 42 122 66 Z"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Moonlight Cyan Streak on Dorsal Fin */}
                <path d="M 124 49 Q 130 58 135 66" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85" />

                {/* 3. Moonlight Cyan Arch Highlight along Back */}
                <path
                  d="M 95 90 C 125 70 165 66 210 68 C 242 70 270 82 284 92"
                  stroke="url(#whaleRimLight)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />

                {/* 4. ROSTRUM TUBERCLES (标志性肉瘤结节 - Distinct Prominent Knobs with 3D Dome) */}
                {/* Midline Dorsal Snout Knobs */}
                <g id="snout-tubercles">
                  <circle cx="284" cy="94" r="3.8" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1.2" />
                  <circle cx="283" cy="93" r="1.2" fill="#bae6fd" opacity="0.8" />

                  <circle cx="268" cy="85" r="4.0" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1.2" />
                  <circle cx="267" cy="84" r="1.3" fill="#bae6fd" opacity="0.8" />

                  <circle cx="250" cy="77" r="4.2" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1.2" />
                  <circle cx="249" cy="76" r="1.3" fill="#bae6fd" opacity="0.8" />

                  <circle cx="230" cy="71" r="3.8" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1.2" />
                  <circle cx="229" cy="70" r="1.2" fill="#bae6fd" opacity="0.8" />

                  {/* Lower Jaw / Chin Knobs */}
                  <circle cx="288" cy="108" r="3.2" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="274" cy="111" r="3.4" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="258" cy="113" r="3.4" fill="url(#tubercleGrad)" stroke="#1e293b" strokeWidth="1" />
                </g>

                {/* 5. LUMINOUS WHITE VENTRAL THROAT PLEATS (下颌纵褶与白肚皮) */}
                <path
                  d="M 195 115 
                     C 220 115 260 113 286 106 
                     C 282 96 262 90 238 88 
                     C 212 86 198 98 195 115 Z"
                  fill="url(#whaleBellyGrad)"
                  stroke="#1e293b"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                {/* 4 Parallel Deep Throat Grooves */}
                <path d="M 205 106 Q 235 98 268 96" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 200 110 Q 234 103 276 101" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 202 113 Q 236 109 282 105" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                {/* 6. GIANT MEGAPTERA PECTORAL WING FLIPPER (大翅鲸专属长胸鳍) */}
                {/* True anatomical orientation: Sweeps DOWN AND BACKWARD into the sea! */}
                <g id="whale-flipper">
                  <path
                    d="M 182 102 
                       C 165 116 142 128 116 138 
                       C 128 140 148 132 166 120 
                       C 180 110 184 104 182 102 Z"
                    fill="url(#flipperGrad)"
                    stroke="#1e293b"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Scalloped Knobby Leading Edge Tubercles on Flipper */}
                  <circle cx="160" cy="118" r="2.2" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <circle cx="140" cy="128" r="2.2" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <circle cx="124" cy="135" r="1.8" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  {/* Glowing White Flipper Underside Streak */}
                  <path d="M 175 106 Q 150 120 126 134" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95" />
                </g>

                {/* 7. SOULFUL, WISE EYE & GENTLE SMILE */}
                {/* Eye Contour */}
                <ellipse cx="236" cy="85" rx="4.8" ry="5.5" fill="#0f172a" />
                {/* Brilliant Star Catchlight */}
                <circle cx="234.5" cy="83.2" r="2" fill="#ffffff" />
                <circle cx="238" cy="87" r="1" fill="#38bdf8" />
                {/* Gentle Eye Reflex */}
                <ellipse cx="231" cy="92" rx="6.5" ry="3.5" fill="#38bdf8" opacity="0.4" />

                {/* S-curved Humpback Smile Line */}
                <path
                  d="M 244 94 Q 260 100 284 94"
                  stroke="#0f172a"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Twin Blowhole Nostrils on Head Peak */}
                <ellipse cx="206" cy="66" rx="3.5" ry="1.5" fill="#0f172a" />
                <ellipse cx="212" cy="66" rx="3" ry="1.4" fill="#0f172a" />
              </g>

              {/* =================================================================== */}
              {/* E. TALL BILLOWING WATER SPOUT FOUNTAIN (高耸双喷水柱与水雾彩虹)     */}
              {/* =================================================================== */}
              <g id="whale-spout">
                {/* Twin Rising Columns */}
                <path
                  d="M 207 66 C 198 42 180 24 168 8 C 184 16 200 34 209 66 Z"
                  fill="url(#whaleSpoutGrad)"
                  className="animate-pulse"
                  style={{ animationDuration: '2.5s' }}
                />
                <path
                  d="M 211 66 C 215 38 227 20 234 0 C 240 18 227 40 215 66 Z"
                  fill="url(#whaleSpoutGrad)"
                  className="animate-pulse"
                  style={{ animationDuration: '2.1s', animationDelay: '0.2s' }}
                />

                {/* Billowing Cumulus Cloud Vapor Puffs */}
                <ellipse cx="232" cy="6" rx="20" ry="14" fill="url(#whaleSpoutGrad)" opacity="0.85" className="animate-bounce" style={{ animationDuration: '2.0s' }} />
                <ellipse cx="172" cy="12" rx="18" ry="12" fill="url(#whaleSpoutGrad)" opacity="0.75" className="animate-bounce" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }} />
                <ellipse cx="202" cy="-4" rx="17" ry="11" fill="url(#whaleSpoutGrad)" opacity="0.9" className="animate-bounce" style={{ animationDuration: '2.1s', animationDelay: '0.1s' }} />

                {/* Floating Sparkling Drops */}
                <circle cx="238" cy="-10" r="3" fill="#ffffff" className="animate-bounce" style={{ animationDuration: '1.0s' }} />
                <circle cx="206" cy="-14" r="2.5" fill="#e0f2fe" className="animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
                <circle cx="164" cy="4" r="2.8" fill="#bae6fd" className="animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '0.4s' }} />
                <circle cx="248" cy="10" r="2.2" fill="#fef08a" className="animate-bounce" style={{ animationDuration: '1.1s', animationDelay: '0.5s' }} />
                <circle cx="198" cy="22" r="3.2" fill="#ffffff" opacity="0.9" className="animate-ping" style={{ animationDuration: '2.2s' }} />
              </g>

              {/* =================================================================== */}
              {/* F. WATERLINE FROTH & INTERACTIVE CELESTIAL NOTE                     */}
              {/* =================================================================== */}
              {/* Froth Spray Line along body waterline */}
              <path
                d="M 65 115 Q 120 119 175 115 Q 230 119 288 115"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.95"
              />
              <circle cx="75" cy="113" r="3" fill="#ffffff" className="animate-bounce" />
              <circle cx="282" cy="112" r="3.2" fill="#bae6fd" className="animate-bounce" style={{ animationDelay: '0.2s' }} />

              {/* Musical Note & Sparkle */}
              <text x="272" y="74" fontSize="16" fill="#38bdf8" className="animate-bounce" style={{ animationDuration: '2.6s' }}>✨</text>
              <text x="286" y="60" fontSize="13" fill="#7dd3fc" className="animate-bounce" style={{ animationDuration: '3.1s', animationDelay: '0.5s' }}>♪</text>
            </svg>
          </div>
        )}

        {/* 2. THE ICE FLOE SANCTUARY (Floe, campfire, otter, fox, props) */}
        {/* Dedicated Responsive Positioning Wrapper: Safely shifts & scales floe on mobile without keyframe override */}
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            hasGuestWhale
              ? '-translate-x-[105px] sm:translate-x-0 scale-[0.74] sm:scale-100 origin-center'
              : ''
          }`}
        >
          <div
            onClick={handleInteraction}
            className={`${isCruising ? 'animate-cruise-surge' : 'animate-float-slow'} relative w-full h-full z-10`}
          >

          {/* ========================================================================= */}
          {/* COMPLETE UNIFIED VECTOR SVG STAGE                                         */}
          {/* Floe, Otter, Campfire, Cocoa, and Props are ALL locked in one coordinate  */}
          {/* system (viewBox 0 0 460 320), making detachment physically impossible!    */}
          {/* ========================================================================= */}
          <svg
            viewBox="0 0 460 320"
            className="w-full h-full drop-shadow-[0_20px_40px_rgba(2,132,199,0.35)] overflow-visible"
          >
            <defs>
              {/* Snow Surface Gradient */}
              <linearGradient id="snowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>

              {/* Ice Cliff Wall Gradient (Above Water) */}
              <linearGradient id="iceWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="50%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Submerged Deep Ice Gradient (Below Water) */}
              <linearGradient id="underwaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#0369a1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#075985" stopOpacity="0.05" />
              </linearGradient>

              {/* Warm Campfire Glow Filter */}
              <filter id="campfireGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
              </filter>

              {/* Outer Flame Gradient */}
              <linearGradient id="flameGradOuter" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#c2410c" />
                <stop offset="50%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>

              {/* Mid Flame Gradient */}
              <linearGradient id="flameGradMid" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>

              {/* Inner Flame Core Gradient */}
              <linearGradient id="flameGradCore" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="60%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              {/* Cozy Cocoa Mug Gradient */}
              <linearGradient id="cocoaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="60%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>

            {/* Geothermal Emerald Warmth (Aurora Oasis - 600 NM) */}
            {hasOasisBlossoms && (
              <g>
                <ellipse cx="230" cy="275" rx="190" ry="38" fill="#10b981" opacity="0.25" filter="url(#campfireGlow)" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <ellipse cx="230" cy="285" rx="150" ry="25" fill="#34d399" opacity="0.2" filter="url(#campfireGlow)" />
              </g>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* 1. DEEP SUBMERGED ICE BODY (Below Waterline Y=255)                     */}
            {/* --------------------------------------------------------------------- */}
            <path
              d="M 50 255 
                 C 45 285 110 315 230 315 
                 C 350 315 415 285 410 255 Z"
              fill="url(#underwaterGrad)"
            />

            {/* --------------------------------------------------------------------- */}
            {/* 2. WATERLINE SEA SURFACE RIPPLE RINGS                                 */}
            {/* --------------------------------------------------------------------- */}
            <ellipse cx="230" cy="255" rx="205" ry="22" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.6" />
            <ellipse cx="230" cy="255" rx="220" ry="26" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.35" />

            {/* --------------------------------------------------------------------- */}
            {/* 3. ICE WALL (Vertical thickness from snow plateau down to sea level)  */}
            {/* --------------------------------------------------------------------- */}
            <path
              d="M 45 210 
                 C 40 230 42 245 48 255 
                 C 110 275 350 275 412 255 
                 C 418 245 420 230 415 210 
                 C 380 232 80 232 45 210 Z"
              fill="url(#iceWallGrad)"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* --------------------------------------------------------------------- */}
            {/* 4. WATERLINE FOAM / SURF (White frothy line where ice meets sea)      */}
            {/* --------------------------------------------------------------------- */}
            <path
              d="M 48 255 C 110 275 350 275 412 255"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />

            {/* Cruise Wave Spray, Bow Slicing Wave & Streamed Wake Trails */}
            {isCruising && (
              <g>
                {/* 1. Left streaming wake streaks (Stern wake rushing backward into the sea) */}
                <path d="M 45 256 C 20 264 -10 274 -40 282" stroke="#ffffff" strokeWidth="3" strokeDasharray="10 5" opacity="0.9" fill="none" className="animate-wake-stream" />
                <path d="M 48 260 C 25 270 5 280 -25 288" stroke="#bae6fd" strokeWidth="2.2" strokeDasharray="8 4" opacity="0.75" fill="none" className="animate-wake-stream" />

                {/* 2. Right Bow Wave & Splashing Spray (Front edge of Floe slicing forward through water) */}
                {/* When companion whale is leading ahead, floe follows smoothly in slipstream (no cutting right bow wake) */}
                {!hasGuestWhale && (
                  <>
                    <path
                      d="M 406 253 C 424 250 442 255 454 263 C 440 267 424 264 410 259 Z"
                      fill="#ffffff"
                      opacity="0.95"
                      className="animate-pulse"
                    />
                    <path
                      d="M 412 254 C 430 252 448 259 465 270"
                      stroke="#7dd3fc"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Splashing Bow Spray Drops */}
                    <circle cx="438" cy="249" r="3" fill="#ffffff" className="animate-bounce" style={{ animationDuration: '0.8s' }} />
                    <circle cx="448" cy="253" r="2.2" fill="#bae6fd" className="animate-bounce" style={{ animationDuration: '1.0s', animationDelay: '0.2s' }} />
                    <circle cx="456" cy="261" r="2.5" fill="#e0f2fe" className="animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.4s' }} />
                    <circle cx="432" cy="246" r="2" fill="#ffffff" className="animate-ping" style={{ animationDuration: '1.2s' }} />

                    {/* 3. Right streaming wake streaks (peeling away from the cutting bow) */}
                    <path d="M 412 256 C 440 264 470 274 500 282" stroke="#ffffff" strokeWidth="3" strokeDasharray="10 5" opacity="0.85" fill="none" className="animate-wake-stream" />
                    <path d="M 408 260 C 435 270 455 280 485 288" stroke="#bae6fd" strokeWidth="2" strokeDasharray="8 4" opacity="0.7" fill="none" className="animate-wake-stream" />
                  </>
                )}
              </g>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* 5. TOP SNOW GROUND PLATEAU (Wide, inviting surface for camp & otter)  */}
            {/* --------------------------------------------------------------------- */}
            <path
              d="M 45 210 
                 C 65 178 150 168 230 168 
                 C 310 168 395 178 415 210 
                 C 418 224 380 238 345 244 
                 C 275 252 185 252 115 244 
                 C 80 238 42 224 45 210 Z"
              fill="url(#snowGrad)"
              stroke="#bae6fd"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />

            {/* Snow surface highlight & icy sheen */}
            <path
              d="M 95 190 Q 160 178 230 180 Q 300 182 365 192"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <ellipse cx="230" cy="216" rx="140" ry="18" fill="#ffffff" opacity="0.45" />

            {/* --------------------------------------------------------------------- */}
            {/* 6. PROPS ON THE SNOW PLATEAU                                          */}
            {/* --------------------------------------------------------------------- */}

            {/* ========================================================================= */}
            {/* VINTAGE POLAR GRAMOPHONE (Placed on left-back ice shelf at X=85, Y=192)   */}
            {/* Features mahogany soundbox, spinning record, brass morning-glory horn,     */}
            {/* and floating musical notes (♪ ♫) rising into the arctic night              */}
            {/* ========================================================================= */}
            {decorations.hasGramophone && (
              <g transform="translate(85, 192)">
                {/* Base Shadow on Snow */}
                <ellipse cx="0" cy="4" rx="16" ry="5" fill="#0f172a" opacity="0.28" />

                {/* Mahogany Soundbox Cabinet */}
                <rect x="-14" y="-7" width="28" height="13" rx="3" fill="#78350f" stroke="#1e1005" strokeWidth="1.8" />
                {/* Box Top Trim */}
                <rect x="-15" y="-9" width="30" height="3" rx="1.5" fill="#9a3412" stroke="#1e1005" strokeWidth="1.2" />
                {/* Brass side crank handle */}
                <line x1="-14" y1="-1" x2="-18" y2="-1" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="-18" cy="-1" r="1.5" fill="#ca8a04" />

                {/* Turntable & Spinning Record */}
                <ellipse cx="0" cy="-9" rx="12" ry="4" fill="#334155" />
                <ellipse cx="0" cy="-9.5" rx="10.5" ry="3.5" fill="#0f172a" />
                <circle cx="0" cy="-9.5" r="2.8" fill="#f59e0b" />
                {/* Tone Arm */}
                <path d="M 8 -9.5 L 4 -9.5 L 1 -8.5" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                {/* Flared Morning-Glory Brass Horn */}
                <path d="M -6 -9 C -6 -18 -2 -22 4 -23" stroke="#ca8a04" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                {/* Flared Horn Bell */}
                <path d="M 4 -23 C 14 -32 24 -30 26 -20 C 22 -14 12 -17 4 -23 Z" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
                <ellipse cx="21" cy="-22" rx="4.5" ry="7.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" transform="rotate(18 21 -22)" />
                <path d="M 8 -24 Q 16 -28 22 -26" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />

                {/* Floating Musical Notes */}
                <text x="24" y="-32" fontSize="13" fill="#38bdf8" className="animate-bounce" style={{ animationDuration: '2.5s' }}>♪</text>
                <text x="34" y="-40" fontSize="11" fill="#7dd3fc" className="animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.6s' }}>♫</text>
              </g>
            )}

            {/* ========================================================================= */}
            {/* NORDIC WOOL BLANKET (Placed at X=122, Y=224, completely clear of otter!)  */}
            {/* Features soft layered folds, Scandinavian winter stitches, and soft fringes */}
            {/* ========================================================================= */}
            {decorations.hasCozyQuilt && (
              <g transform="translate(122, 224)">
                {/* Base Shadow on Snow */}
                <ellipse cx="0" cy="3" rx="22" ry="7" fill="#0f172a" opacity="0.25" />

                {/* Bottom Fold Layer */}
                <ellipse cx="0" cy="0" rx="20" ry="7.5" fill="#0284c7" stroke="#1e293b" strokeWidth="1.8" />
                {/* Top Folded Quilt Surface */}
                <ellipse cx="-1" cy="-3" rx="18" ry="6.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.8" />

                {/* Scandinavian Woven Pattern Stripes */}
                <path d="M -14 -3 Q 0 2 14 -3" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
                <path d="M -12 -5 Q 0 -1 12 -5" stroke="#fde047" strokeWidth="1.2" fill="none" opacity="0.85" />

                {/* Soft Fluffy Fringe Tassels */}
                <line x1="-16" y1="2" x2="-20" y2="7" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                <line x1="-12" y1="3" x2="-15" y2="9" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                <line x1="-7" y1="4" x2="-9" y2="10" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                <line x1="-2" y1="4.5" x2="-3" y2="10.5" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="4.5" x2="3" y2="10.5" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* ========================================================================= */}
            {/* ANIMAL GUEST: AURORA FOX (极光雪狐)                                       */}
            {/* Appears when reaching The Echo Straits (100 NM). Curled up peacefully on  */}
            {/* the wool blanket at X=120, Y=222, sleeping with soft breathing animation   */}
            {/* Completely unobstructed by the mascot otter, clear open space in between! */}
            {/* ========================================================================= */}
            {hasGuestFox && (
              <g
                transform="translate(120, 222)"
                className="cursor-pointer group"
                onClick={handleFoxClick}
              >
                {/* Base Shadow (blends with blanket or snow) */}
                <ellipse cx="0" cy="4" rx="20" ry="6.5" fill="#0f172a" opacity="0.3" />

                {/* Soft Aurora Glow behind Fox */}
                <ellipse cx="2" cy="-2" rx="24" ry="14" fill="#99f6e4" opacity="0.18" className="animate-pulse" />

                {/* Fluffy Curled Fox Tail wrapped around body */}
                <path
                  d="M -15 3 C -27 2 -25 -10 -13 -13 C -6 -15 2 -11 5 -4 C -2 2 -7 5 -15 3 Z"
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="1.4"
                />
                {/* Tail Tip (soft celestial teal) */}
                <path
                  d="M -18 -6 C -23 -9 -19 -12 -14 -13 C -15 -9 -17 -7 -18 -6 Z"
                  fill="#99f6e4"
                  opacity="0.85"
                />

                {/* Curled Body */}
                <ellipse cx="2" cy="-1" rx="16" ry="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.4" />
                <path d="M -9 -6 Q 2 -11 11 -4 Q 4 -8 -6 -3 Z" fill="#e2e8f0" opacity="0.75" />

                {/* Fox Head resting snugly */}
                <ellipse cx="10" cy="-4" rx="9" ry="7.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.3" />

                {/* Pointy Arctic Fox Ears */}
                {/* Left Ear */}
                <polygon points="5,-10 7,-18 12,-11" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
                <polygon points="6,-11 8,-16 11,-12" fill="#fecdd3" />
                {/* Right Ear */}
                <polygon points="12,-9 16,-17 19,-8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
                <polygon points="13,-10 16,-15 18,-9" fill="#fecdd3" />

                {/* Muzzle & Nose */}
                <ellipse cx="15" cy="-2.5" rx="4.5" ry="3" fill="#f8fafc" />
                <ellipse cx="18" cy="-3.5" rx="1.3" ry="1" fill="#0f172a" />

                {/* Sleepy Peaceful Curved Eye */}
                <path
                  d="M 8 -5 Q 10 -3 12 -5"
                  stroke="#475569"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Warm Cheek Blush */}
                <circle cx="10" cy="-1.5" r="2.2" fill="#fda4af" opacity="0.6" />

                {/* Curled Sleeping Paws */}
                <ellipse cx="7" cy="6" rx="3.5" ry="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <ellipse cx="12" cy="5.5" rx="3.5" ry="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

                {/* Floating Soft Sleeping Zzzs */}
                <text x="-7" y="-14" fontSize="8" fill="#a5f3fc" fontWeight="bold" className="animate-bounce" style={{ animationDuration: '3s' }}>z</text>
                <text x="-1" y="-20" fontSize="10" fill="#7dd3fc" fontWeight="bold" className="animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.6s' }}>Z</text>
                <text x="6" y="-26" fontSize="12" fill="#93c5fd" fontWeight="bold" className="animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.2s' }}>z</text>
              </g>
            )}

            {/* ========================================================================= */}
            {/* STEAMING HOT COCOA MUG (X=295, Y=226)                                     */}
            {/* Features Nordic ceramic mug, rich chocolate, marshmallows, and realistic  */}
            {/* swirling vapor steam wisps floating up into the crisp polar air          */}
            {/* ========================================================================= */}
            {decorations.hasHotCocoa && (
              <g transform="translate(295, 226)">
                {/* Soft Mug Shadow on Snow */}
                <ellipse cx="0" cy="2" rx="13" ry="4.5" fill="#0f172a" opacity="0.3" />

                {/* Mug Body & Handle */}
                {/* Thick Cozy Handle */}
                <path
                  d="M 9 -14 C 18 -14 18 -3 9 -3"
                  stroke="#991b1b"
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 9 -14 C 16 -14 16 -3 9 -3"
                  stroke="#ef4444"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Ceramic Mug Body */}
                <rect x="-9.5" y="-18" width="19" height="18" rx="4" fill="url(#cocoaGrad)" stroke="#7f1d1d" strokeWidth="2" />
                {/* Mug Glossy Highlight */}
                <path d="M -7 -15 L -7 -5" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                {/* Cute Polar Snowflake Motif on Mug */}
                <text x="0" y="-8" fontSize="8" fill="#ffffff" opacity="0.85" textAnchor="middle" fontWeight="bold">❄</text>

                {/* Rounded Mug Rim */}
                <ellipse cx="0" cy="-18" rx="9.5" ry="3.8" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />

                {/* Rich Foamy Hot Chocolate Surface */}
                <ellipse cx="0" cy="-18" rx="8.2" ry="3" fill="#451a03" />
                <ellipse cx="0" cy="-18" rx="6.5" ry="2.2" fill="#78350f" />

                {/* 3 Fluffy Mini Marshmallows floating */}
                <ellipse cx="-3.2" cy="-19" rx="2.5" ry="1.8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                <ellipse cx="3.2" cy="-17.5" rx="2.2" ry="1.6" fill="#fef08a" stroke="#e2e8f0" strokeWidth="0.5" />
                <circle cx="0.5" cy="-18.8" r="1.6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />

                {/* Realistic Billowing Steam Wisps (Smooth drifting CSS animation) */}
                <g>
                  {/* Wisp 1: Left swirling vapor */}
                  <path
                    d="M -3 -22 C -7 -28 -2 -34 -5 -40"
                    stroke="#f0f9ff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    className="animate-steam-1"
                  />
                  {/* Wisp 2: Right swirling vapor */}
                  <path
                    d="M 2.5 -21 C 6.5 -27 1 -33 5 -39"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                    className="animate-steam-2"
                  />
                  {/* Wisp 3: Center delicate vapor */}
                  <path
                    d="M -0.5 -23 C 3 -30 -3 -36 1 -42"
                    stroke="#e0f2fe"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                    className="animate-steam-3"
                  />
                </g>
              </g>
            )}

            {/* ========================================================================= */}
            {/* NATURAL COZY CAMPFIRE (X=350, Y=224)                                      */}
            {/* Features stone fire ring, glowing ember bed, timber logs, dynamic licking */}
            {/* multi-layer flames, and rising sparks floating into the arctic air        */}
            {/* ========================================================================= */}
            <g transform="translate(350, 224)">
              {/* 1. Snow Radiant Heat Reflection */}
              <ellipse cx="0" cy="4" rx="44" ry="16" fill="#f59e0b" opacity="0.32" filter="url(#campfireGlow)" />
              <ellipse cx="0" cy="3" rx="28" ry="10" fill="#ea580c" opacity="0.25" filter="url(#campfireGlow)" />

              {/* 2. Natural River Cobblestones Ring (Bedded in snow) */}
              <g>
                <ellipse cx="-26" cy="4" rx="7.5" ry="5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
                <ellipse cx="-26" cy="2" rx="4.5" ry="2.2" fill="#94a3b8" opacity="0.3" />

                <ellipse cx="-16" cy="8" rx="8" ry="5" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                <ellipse cx="-16" cy="6" rx="5" ry="2" fill="#64748b" opacity="0.3" />

                <ellipse cx="0" cy="9" rx="9" ry="5.5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
                <ellipse cx="0" cy="7" rx="5.5" ry="2.2" fill="#94a3b8" opacity="0.3" />

                <ellipse cx="16" cy="8" rx="8" ry="5" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                <ellipse cx="16" cy="6" rx="5" ry="2" fill="#64748b" opacity="0.3" />

                <ellipse cx="26" cy="4" rx="7.5" ry="5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
                <ellipse cx="26" cy="2" rx="4.5" ry="2.2" fill="#94a3b8" opacity="0.3" />

                <ellipse cx="-20" cy="-2" rx="6" ry="4" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                <ellipse cx="20" cy="-2" rx="6" ry="4" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
              </g>

              {/* 3. Red-Hot Glowing Charcoal Bed (Inside stone pit) */}
              <ellipse cx="0" cy="3" rx="20" ry="7" fill="#18181b" />
              <ellipse cx="0" cy="2" rx="15" ry="5" fill="#dc2626" opacity="0.85" className="animate-pulse" />
              <ellipse cx="0" cy="1" rx="9" ry="3" fill="#f97316" opacity="0.9" />
              <ellipse cx="0" cy="0" rx="5" ry="1.8" fill="#fef08a" opacity="0.95" />

              {/* 4. Natural Crossed Timber Logs */}
              {/* Back Log 1 */}
              <rect x="-19" y="-6" width="38" height="8" rx="3.5" fill="#451a03" stroke="#1e1005" strokeWidth="1.8" transform="rotate(-24)" />
              {/* Back Log 2 */}
              <rect x="-19" y="-6" width="38" height="8" rx="3.5" fill="#3b1302" stroke="#1e1005" strokeWidth="1.8" transform="rotate(24)" />
              {/* Front Log (Main cross piece with bark ring texture) */}
              <g transform="rotate(-8)">
                <rect x="-22" y="-3" width="44" height="8.5" rx="4" fill="#78350f" stroke="#1e1005" strokeWidth="2" />
                {/* Wood bark grain marks */}
                <line x1="-12" y1="-0.5" x2="-4" y2="-0.5" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="4" y1="-0.5" x2="14" y2="-0.5" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" />
                {/* Log end cross-section showing growth rings */}
                <ellipse cx="-20" cy="1.2" rx="3" ry="3.8" fill="#9a3412" stroke="#451a03" strokeWidth="1" />
                <circle cx="-20" cy="1.2" r="1.5" fill="#78350f" />
              </g>

              {/* 5. Organic Multi-Layer Dancing Flames */}
              <g className="origin-bottom">
                {/* Outer Flame (Deep Amber-Crimson with licking tips) */}
                <path
                  d="M 0 -48 
                     C 10 -34 18 -26 15 -10 
                     C 22 -18 20 -28 17 -34 
                     C 24 -24 24 -8 18 2 
                     C 12 6 6 8 0 8 
                     C -6 8 -12 6 -18 2 
                     C -24 -8 -24 -24 -17 -34 
                     C -20 -28 -22 -18 -15 -10 
                     C -18 -26 -10 -34 0 -48 Z"
                  fill="url(#flameGradOuter)"
                  stroke="#7c2d12"
                  strokeWidth="2"
                  className="animate-flame-main"
                />

                {/* Mid Flame (Bright Gold/Orange Core) */}
                <path
                  d="M 0 -36 
                     C 7 -26 13 -18 10 -6 
                     C 14 -12 12 -20 10 -24 
                     C 15 -16 15 -4 11 3 
                     C 7 6 3 7 0 7 
                     C -3 7 -7 6 -11 3 
                     C -15 -4 -15 -16 -10 -24 
                     C -12 -20 -14 -12 -10 -6 
                     C -13 -18 -7 -26 0 -36 Z"
                  fill="url(#flameGradMid)"
                  className="animate-flame-sub"
                />

                {/* Inner Flame (Radiant White-Hot Core) */}
                <path
                  d="M 0 -22 
                     C 4 -16 7 -10 5 -2 
                     C 3 4 0 5 0 5 
                     C 0 5 -3 4 -5 -2 
                     C -7 -10 -4 -16 0 -22 Z"
                  fill="url(#flameGradCore)"
                  className="animate-flame-main"
                />

                {/* Little dancing side flamelet */}
                <path
                  d="M 12 -16 C 16 -12 17 -6 14 -2 C 11 0 9 -4 10 -8 Z"
                  fill="#fef08a"
                  className="animate-flame-sub"
                />
              </g>

              {/* 6. Glowing Floating Embers (Rising into the arctic sky) */}
              <circle cx="-4" cy="-42" r="1.6" fill="#fef08a" className="animate-ember-1" />
              <circle cx="8" cy="-46" r="1.4" fill="#fb923c" className="animate-ember-2" />
              <circle cx="-10" cy="-34" r="1.3" fill="#fde047" className="animate-ember-3" />
              <circle cx="12" cy="-38" r="1.5" fill="#f59e0b" className="animate-ember-1" style={{ animationDelay: '1.2s' }} />
            </g>

            {/* Decor: Fairy Lights across the front rim */}
            {decorations.hasFairyLights && (
              <g>
                <path d="M 70 236 Q 150 252 230 250 Q 310 252 390 236" stroke="#94a3b8" strokeWidth="1.2" fill="none" opacity="0.6" />
                {[
                  { cx: 90, cy: 240, col: '#bae6fd' },
                  { cx: 135, cy: 247, col: '#fde047' },
                  { cx: 180, cy: 250, col: '#38bdf8' },
                  { cx: 230, cy: 250, col: '#c084fc' },
                  { cx: 280, cy: 250, col: '#f472b6' },
                  { cx: 325, cy: 247, col: '#fde047' },
                  { cx: 370, cy: 240, col: '#38bdf8' },
                ].map((bulb, idx) => (
                  <circle
                    key={idx}
                    cx={bulb.cx}
                    cy={bulb.cy}
                    r="4"
                    fill={bulb.col}
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="animate-pulse"
                    style={{ animationDelay: `${idx * 0.3}s` }}
                  />
                ))}
              </g>
            )}

            {/* ========================================================================= */}
            {/* OASIS WONDER: CRYSTAL FROST LILIES (极光晶霜花)                           */}
            {/* Appears when reaching The Aurora Oasis (600 NM). Blooms along snow rim    */}
            {/* ========================================================================= */}
            {hasOasisBlossoms && (
              <g id="oasis-blossoms">
                {/* Cluster 1: Left Rim (X=78, Y=230) */}
                <g transform="translate(78, 230)">
                  <ellipse cx="0" cy="2" rx="10" ry="3.5" fill="#047857" opacity="0.25" />
                  <path d="M 0 2 Q -2 -6 -1 -12" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M -1 -4 Q -6 -7 -8 -5 Q -5 -2 -1 -3" fill="#6ee7b7" stroke="#059669" strokeWidth="0.8" />
                  <path d="M 0 -7 Q 6 -10 8 -8 Q 5 -5 0 -6" fill="#a7f3d0" stroke="#059669" strokeWidth="0.8" />
                  <circle cx="-1" cy="-14" r="7" fill="#34d399" opacity="0.35" className="animate-pulse" />
                  <path d="M -1 -12 L -6 -16 L -1 -22 L 4 -16 Z" fill="#ecfdf5" stroke="#34d399" strokeWidth="1.2" />
                  <path d="M -1 -12 L -7 -12 L -1 -19 L 5 -12 Z" fill="#a7f3d0" stroke="#10b981" strokeWidth="1" opacity="0.9" />
                  <circle cx="-1" cy="-15" r="2.2" fill="#fde047" />

                  {/* Left Mini Bud */}
                  <g transform="translate(-10, 4) scale(0.75)">
                    <path d="M 0 0 Q -2 -6 -1 -10" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <path d="M -1 -10 L -4 -14 L -1 -18 L 2 -14 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1.2" />
                    <circle cx="-1" cy="-13" r="1.8" fill="#fef08a" />
                  </g>

                  {/* Floating Pollen Sparkles */}
                  <circle cx="-3" cy="-24" r="1.2" fill="#6ee7b7" className="animate-bounce" style={{ animationDuration: '2s' }} />
                  <circle cx="5" cy="-20" r="1.4" fill="#fef08a" className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />
                </g>

                {/* Cluster 2: Right Rim (X=325, Y=244) */}
                <g transform="translate(325, 244)">
                  <ellipse cx="0" cy="2" rx="12" ry="4" fill="#047857" opacity="0.25" />
                  <path d="M 0 2 Q 2 -6 1 -14" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 1 -5 Q -6 -8 -7 -6 Q -4 -3 1 -4" fill="#a7f3d0" stroke="#059669" strokeWidth="0.8" />
                  <path d="M 1 -8 Q 7 -11 9 -9 Q 6 -6 1 -7" fill="#6ee7b7" stroke="#059669" strokeWidth="0.8" />
                  <circle cx="1" cy="-16" r="8" fill="#38bdf8" opacity="0.35" className="animate-pulse" />
                  <path d="M 1 -14 L -5 -18 L 1 -25 L 7 -18 Z" fill="#f0fdf4" stroke="#38bdf8" strokeWidth="1.2" />
                  <path d="M 1 -14 L -6 -14 L 1 -21 L 8 -14 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" opacity="0.9" />
                  <circle cx="1" cy="-17" r="2.2" fill="#fde047" />

                  {/* Right Bud */}
                  <g transform="translate(12, 3) scale(0.8)">
                    <path d="M 0 0 Q 2 -5 1 -9" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <path d="M 1 -9 L -3 -13 L 1 -17 L 5 -13 Z" fill="#34d399" stroke="#059669" strokeWidth="1.2" />
                    <circle cx="1" cy="-12" r="1.6" fill="#fef08a" />
                  </g>

                  {/* Floating Pollen Sparkles */}
                  <circle cx="0" cy="-27" r="1.3" fill="#38bdf8" className="animate-bounce" style={{ animationDuration: '2.2s' }} />
                  <circle cx="8" cy="-22" r="1.5" fill="#fde047" className="animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.6s' }} />
                </g>
              </g>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* 7. THE ICE OTTER MASCOT (Sitting dead-center on the snow plateau)     */}
            {/* Feet rest firmly at Y=224, body center at X=220. Visible when !diving */}
            {/* --------------------------------------------------------------------- */}
            {!isDiving && (!isCruising || hasGuestWhale) ? (
              <g id="ice-otter" transform="translate(150, 80)">
                <g className="cursor-pointer transition-all duration-200 hover:brightness-105 hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
                  {/* 1. TAIL */}
                <path
                  d="M50 128 C22 128 12 136 15 144 C18 151 46 150 60 140 Z"
                  fill="#3c4556"
                  stroke="#2e384d"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* 2. CHUBBY CREAM BODY */}
                <path
                  d="M44 65 C44 32 116 32 116 65 C116 82 126 108 122 132 C118 148 42 148 38 132 C34 108 44 82 44 65 Z"
                  fill="#fdfbf7"
                  stroke="#2e384d"
                  strokeWidth="3.8"
                  strokeLinejoin="round"
                />

                {/* 3. TINY CHARCOAL EARS */}
                <ellipse cx="42" cy="56" rx="6" ry="8.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(-15 42 56)" />
                <ellipse cx="118" cy="56" rx="6" ry="8.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(15 118 56)" />

                {/* 4. WHISKERS */}
                <path d="M30 70 Q40 73 46 74" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M31 79 Q41 80 46 79" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M130 70 Q120 73 114 74" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M129 79 Q119 80 114 79" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />

                {/* 5. EYES & NOSE */}
                {blink ? (
                  <>
                    <path d="M60 64 Q66 58 72 64" stroke="#2e384d" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M88 64 Q94 58 100 64" stroke="#2e384d" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse cx="66" cy="64" rx="3.6" ry="5.2" fill="#2e384d" />
                    <ellipse cx="94" cy="64" rx="3.6" ry="5.2" fill="#2e384d" />
                  </>
                )}

                <path d="M76 66 Q80 64 84 66 Q80 71 76 66 Z" fill="#2e384d" />

                {/* 6. SOFT PASTEL BLUSH */}
                <ellipse cx="52" cy="70" rx="7.5" ry="4.5" fill="#fecdd3" opacity="0.85" />
                <ellipse cx="108" cy="70" rx="7.5" ry="4.5" fill="#fecdd3" opacity="0.85" />

                {/* 7. FEET (Firmly grounded on snow plateau at Y=142 -> absolute Y=224) */}
                <ellipse cx="56" cy="142" rx="11" ry="13" fill="#3c4556" stroke="#2e384d" strokeWidth="3.5" />
                <ellipse cx="104" cy="142" rx="11" ry="13" fill="#3c4556" stroke="#2e384d" strokeWidth="3.5" />

                {/* 8. HELD ITEM */}
                {state === 'surfaced' || state === 'cracking' ? (
                  /* Surfaced Giant Clam */
                  <g className="animate-pulse">
                    <ellipse cx="80" cy="112" rx="22" ry="18" fill="#0284c7" stroke="#2e384d" strokeWidth="3.5" />
                    <ellipse cx="80" cy="112" rx="15" ry="11" fill="#7dd3fc" />
                    <polygon points="80,101 88,112 80,123 72,112" fill="#ffffff" opacity="0.85" />
                    <path d="M54 104 C62 104 70 110 64 122" stroke="#2e384d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                    <path d="M106 104 C98 104 90 110 96 122" stroke="#2e384d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  </g>
                ) : isCruising && hasGuestWhale ? (
                  /* 300+ NM Whale Escort: Polar Spyglass Telescope looking towards horizon */
                  <g id="polar-telescope" transform="translate(76, 110)">
                    {/* Brass Telescope Body angled up and to the right */}
                    <g transform="rotate(-18 0 0)">
                      {/* Eyepiece */}
                      <rect x="-10" y="-4" width="8" height="8" rx="1.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.2" />
                      {/* Draw tube */}
                      <rect x="-2" y="-5" width="14" height="10" rx="1.5" fill="#eab308" stroke="#854d0e" strokeWidth="1.4" />
                      {/* Main barrel */}
                      <rect x="12" y="-6.5" width="18" height="13" rx="2" fill="#ca8a04" stroke="#78350f" strokeWidth="1.6" />
                      {/* Lens Rim & Objective */}
                      <rect x="30" y="-7.5" width="4" height="15" rx="1.5" fill="#eab308" stroke="#854d0e" strokeWidth="1.2" />
                      {/* Glowing glass reflection */}
                      <ellipse cx="33" cy="0" rx="2" ry="6.5" fill="#38bdf8" opacity="0.9" />
                      <circle cx="33.5" cy="-2.5" r="1.5" fill="#ffffff" />
                      {/* Brass highlight stripe */}
                      <line x1="-1" y1="-2" x2="28" y2="-2" stroke="#fef08a" strokeWidth="1.4" strokeLinecap="round" />
                    </g>
                    {/* Otter Paws gripping the telescope */}
                    <ellipse cx="-2" cy="4" rx="7.5" ry="6.5" fill="#3c4556" stroke="#2e384d" strokeWidth="2.8" />
                    <ellipse cx="18" cy="2" rx="7.5" ry="6.5" fill="#3c4556" stroke="#2e384d" strokeWidth="2.8" />
                    {/* Sparkling Starlight from Lens */}
                    <text x="36" y="-12" fontSize="13" fill="#fde047" className="animate-bounce" style={{ animationDuration: '2s' }}>✨</text>
                  </g>
                ) : (
                  /* Iconic Glowing Ice Cube */
                  <g>
                    <circle cx="80" cy="112" r="20" fill="#7dd3fc" opacity="0.25" className="animate-pulse" />
                    <polygon points="80,94 99,104 80,114 61,104" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" />
                    <polygon points="61,104 80,114 80,132 61,122" fill="#93c5fd" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" />
                    <polygon points="80,114 99,104 99,122 80,132" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
                    <polygon points="80,98 90,103 80,108 70,103" fill="#ffffff" opacity="0.75" />

                    <path d="M52 108 C58 108 67 114 61 126" stroke="#2e384d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                    <path d="M108 108 C102 108 93 114 99 126" stroke="#2e384d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  </g>
                )}
                </g>
              </g>
            ) : isCruising && !hasGuestWhale ? (
              /* ========================================================================= */
              /* 8. 0~299 NM CRUISING: AUTHENTIC 100% ON-MODEL MASCOT PUSHING IN WATER     */
              /* Same Scale, Exact Mascot Face, Same Colors, Waist at Waterline Y=255      */
              /* ========================================================================= */
              <g id="pushing-otter" transform="translate(-66, 145) rotate(5 78 115)">
                <g
                  className="animate-otter-push cursor-pointer group hover:brightness-105 transition-all"
                  onClick={handleInteraction}
                >

                {/* 1. Water Wake Speed Streaks trailing behind into sea */}
                <path d="M 28 120 C 5 125 -22 131 -50 135" stroke="#ffffff" strokeWidth="3" strokeDasharray="10 5" opacity="0.9" fill="none" className="animate-wake-stream" />
                <path d="M 34 128 C 12 134 -12 140 -38 144" stroke="#bae6fd" strokeWidth="2.2" strokeDasharray="8 4" opacity="0.75" fill="none" className="animate-wake-stream" />

                {/* 2. Churning Propeller Jet Bubbles behind Kicking Flippers */}
                <circle cx="20" cy="128" r="4" fill="#ffffff" opacity="0.9" className="animate-ping" style={{ animationDuration: '0.9s' }} />
                <circle cx="6" cy="136" r="5" fill="#bae6fd" opacity="0.8" className="animate-ping" style={{ animationDuration: '1.2s' }} />
                <circle cx="-8" cy="126" r="3.8" fill="#7dd3fc" opacity="0.7" className="animate-ping" style={{ animationDuration: '1.5s' }} />
                <circle cx="-22" cy="138" r="3" fill="#e0f2fe" opacity="0.6" className="animate-ping" style={{ animationDuration: '1s' }} />

                {/* 3. Translucent Sea Surface Ring BEHIND body */}
                <ellipse cx="78" cy="115" rx="46" ry="11" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.55" />
                <ellipse cx="78" cy="115" rx="38" ry="7" fill="#38bdf8" opacity="0.2" />

                {/* 4. Chubby Beaver/Otter Tail swishing in water */}
                <g>
                  <path
                    d="M48 126 C26 122 10 132 14 142 C18 150 40 146 52 136 Z"
                    fill="#3c4556"
                    stroke="#2e384d"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 48 130; -8 48 130; 0 48 130"
                    dur="0.9s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </g>

                {/* 5. Underwater Flutter-Kicking Hind Webbed Flippers */}
                {/* Back Left Leg & Webbed Flipper */}
                <g>
                  <ellipse cx="56" cy="138" rx="10" ry="13" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(-15 56 138)" />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; -3,4; 0,0"
                    dur="0.5s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </g>
                {/* Back Right Leg & Webbed Flipper */}
                <g>
                  <ellipse cx="84" cy="140" rx="10" ry="13" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(12 84 140)" />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 3,-4; 0,0"
                    dur="0.5s"
                    begin="0.25s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </g>

                {/* 6. AUTHENTIC CHUBBY CREAM MASCOT BODY */}
                <path
                  d="M44 65 C44 32 116 32 116 65 C116 82 126 106 120 128 C116 142 44 142 40 128 C34 106 44 82 44 65 Z"
                  fill="#fdfbf7"
                  stroke="#2e384d"
                  strokeWidth="3.8"
                  strokeLinejoin="round"
                />

                {/* 7. Front Chubby Arms & Paws Firmly Pressed against the Ice Shelf */}
                {/* Upper Arm White Underlay (covers body edge cleanly) */}
                <path
                  d="M 92 86 C 108 86 122 92 127 100 C 122 107 106 104 90 98 Z"
                  fill="#fdfbf7"
                />
                <path
                  d="M 94 86 C 108 88 120 94 126 100"
                  stroke="#2e384d"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Upper Charcoal Mitten Paw gripping ice ledge */}
                <ellipse cx="127" cy="101" rx="8.5" ry="7.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" />
                <line x1="123" y1="98" x2="129" y2="100" stroke="#2e384d" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="123" y1="104" x2="129" y2="102" stroke="#2e384d" strokeWidth="1.6" strokeLinecap="round" />

                {/* Lower Arm: Single cute curve from tummy to paw */}
                <path
                  d="M 88 108 C 100 112 110 115 118 119"
                  stroke="#2e384d"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Lower Charcoal Mitten Paw pressing ice wall */}
                <ellipse cx="119" cy="119" rx="8.5" ry="7.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" />
                <line x1="115" y1="116" x2="121" y2="118" stroke="#2e384d" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="115" y1="122" x2="121" y2="120" stroke="#2e384d" strokeWidth="1.6" strokeLinecap="round" />

                {/* Splash & Ice froth at paw contact point */}
                <path d="M120 114 Q127 110 133 116" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />

                {/* 8. Front Water Surface Wave & Foam IN FRONT of Waist (Y_local = 115) */}
                <path d="M 36 116 Q 78 123 120 116" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.95" />
                <path d="M 42 120 Q 78 126 114 120" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" />

                {/* Water splash droplets around waist */}
                <circle cx="34" cy="112" r="2.8" fill="#ffffff" className="animate-bounce" />
                <circle cx="46" cy="108" r="2" fill="#bae6fd" className="animate-bounce" style={{ animationDelay: '0.3s' }} />

                {/* 8. AUTHENTIC MASCOT HEAD & EARS (100% Identical to Sitting Mascot) */}
                {/* Tiny Charcoal Ears */}
                <ellipse cx="42" cy="56" rx="6" ry="8.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(-15 42 56)" />
                <ellipse cx="118" cy="56" rx="6" ry="8.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(15 118 56)" />

                {/* Whiskers (Exact 2.6px stroke) */}
                <path d="M30 70 Q40 73 46 74" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M31 79 Q41 80 46 79" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M130 70 Q120 73 114 74" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M129 79 Q119 80 114 79" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />

                {/* Eyes (Blinking animation, same cute eyes) */}
                {blink ? (
                  <>
                    <path d="M60 64 Q66 58 72 64" stroke="#2e384d" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M88 64 Q94 58 100 64" stroke="#2e384d" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse cx="66" cy="64" rx="3.6" ry="5.2" fill="#2e384d" />
                    <ellipse cx="94" cy="64" rx="3.6" ry="5.2" fill="#2e384d" />
                  </>
                )}

                {/* Button Nose & Cheerful Smiling Mouth */}
                <path d="M76 66 Q80 64 84 66 Q80 71 76 66 Z" fill="#2e384d" />
                <path d="M76 70 Q80 73 84 70" stroke="#2e384d" strokeWidth="2.2" strokeLinecap="round" fill="none" />

                {/* Soft Pastel Blush Cheeks */}
                <ellipse cx="52" cy="70" rx="7.5" ry="4.5" fill="#fecdd3" opacity="0.85" />
                <ellipse cx="108" cy="70" rx="7.5" ry="4.5" fill="#fecdd3" opacity="0.85" />
                </g>
              </g>
            ) : (
              /* ----------------------------------------------------------------- */
              /* DIVING STATE: Underwater Bubbles Rising from Below Floe           */
              /* ----------------------------------------------------------------- */
              <g transform="translate(230, 275)">
                <circle cx="-25" cy="15" r="4" fill="#bae6fd" opacity="0.7" className="animate-bounce" style={{ animationDuration: '1.6s' }} />
                <circle cx="0" cy="8" r="6" fill="#7dd3fc" opacity="0.8" className="animate-ping" style={{ animationDuration: '2.2s' }} />
                <circle cx="28" cy="18" r="3.5" fill="#e0f2fe" opacity="0.6" className="animate-bounce" style={{ animationDuration: '1.3s' }} />
                <circle cx="12" cy="25" r="5" fill="#38bdf8" opacity="0.5" className="animate-bounce" style={{ animationDuration: '1.9s' }} />
              </g>
            )}
          </svg>

          {/* HTML Badges (Positioned cleanly relative to the fixed 460x320 stage) */}
          {state === 'surfaced' && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-300 to-amber-200 text-sky-950 font-bold text-xs px-4 py-1.5 rounded-full shadow-xl animate-bounce border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
              <span>✨</span> Tap to crack shell!
            </div>
          )}

          {/* Phase 1 Dive Indicator */}

          {isDiving && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-sky-950/90 text-sky-200 font-bold px-4 py-1.5 rounded-full text-xs shadow-xl border border-sky-400/40 animate-pulse flex items-center gap-2 whitespace-nowrap backdrop-blur-sm">
              {supportsBubbleEmoji ? (
                /* Native Unicode 14 🫧 emoji with smooth spinning */
                <span
                  className="animate-spin inline-block text-sm select-none leading-none shrink-0"
                  style={{ transformOrigin: 'center' }}
                >
                  🫧
                </span>
              ) : (
                /* Graceful fallback: Shiny vector SVG bubbles also with smooth spinning */
                <span className="animate-spin inline-flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 20 20" className="w-4 h-4 drop-shadow-sm" fill="none">
                    {/* Primary Centered Bubble */}
                    <circle cx="10" cy="10" r="6.5" stroke="#38bdf8" strokeWidth="1.8" fill="#38bdf8" fillOpacity="0.25" />
                    <ellipse cx="7.8" cy="7.8" rx="1.6" ry="0.9" fill="#ffffff" opacity="0.9" transform="rotate(-35 7.8 7.8)" />
                    {/* Orbiting Secondary Bubble */}
                    <circle cx="15.5" cy="5.5" r="3" stroke="#7dd3fc" strokeWidth="1.4" fill="#7dd3fc" fillOpacity="0.35" />
                    <circle cx="14.8" cy="4.8" r="0.7" fill="#ffffff" opacity="0.9" />
                  </svg>
                </span>
              )}
              <span>Diving in polar waters...</span>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
  );
};
