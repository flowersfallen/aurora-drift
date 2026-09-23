import React, { useState, useEffect } from 'react';
import { OtterState, CampDecorations, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

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
}

export const IceOtter: React.FC<IceOtterProps> = ({
  state,
  decorations,
  lang = 'en',
  onOtterClick,
  hasGuestFox = false,
}) => {
  const [blink, setBlink] = useState(false);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [foxDialogue, setFoxDialogue] = useState<string | null>(null);
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

  return (
    <div className="relative flex flex-col items-center justify-end select-none">
      {/* Speech Bubble - Floats right above otter */}
      {dialogue && !isDiving && (
        <div
          className={`absolute z-50 animate-bounce px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/95 text-slate-800 text-[11px] sm:text-xs font-semibold max-w-[85vw] sm:max-w-[240px] text-center border-2 border-sky-300 shadow-xl shadow-sky-950/40 ${
            isCruising ? 'top-10 sm:top-12 left-4 sm:left-14' : 'top-1 sm:top-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {dialogue}
          <div
            className={`absolute -bottom-2.5 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white ${
              isCruising ? 'left-10' : 'left-1/2 -translate-x-1/2'
            }`}
          ></div>
        </div>
      )}

      {/* Aurora Fox Speech Bubble - Floats above the sleeping fox on the left */}
      {foxDialogue && !isDiving && (
        <div className="absolute top-8 sm:top-10 left-2 sm:left-6 z-50 animate-bounce px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-orange-50/95 text-slate-800 text-[11px] sm:text-xs font-semibold max-w-[85vw] sm:max-w-[230px] text-center border-2 border-orange-300 shadow-xl shadow-sky-950/40">
          <span className="text-orange-500 mr-1 font-bold">🦊</span>
          {foxDialogue}
          <div className="absolute -bottom-2.5 left-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-50"></div>
        </div>
      )}

      {/* Main Unified Stage: Fluid width on mobile, max 460px on desktop */}
      <div
        onClick={handleInteraction}
        className="relative w-auto max-w-[88vw] max-h-[30vh] sm:max-h-[35vh] md:w-[92vw] md:max-w-[460px] md:max-h-none aspect-[460/320] flex items-center justify-center mx-auto"
      >
        {/* Soft, natural water bobbing physics applied to the whole floe */}
        <div className="animate-float-slow relative w-full h-full">

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

            {/* Cruise Wave Spray & Wake Trails */}
            {isCruising && (
              <g>
                {/* Left streaming wake streak */}
                <path d="M 45 256 C 20 264 -10 274 -40 282" stroke="#ffffff" strokeWidth="3" strokeDasharray="8 4" opacity="0.85" fill="none" className="animate-pulse" />
                <path d="M 48 260 C 25 270 5 280 -25 288" stroke="#bae6fd" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" fill="none" />
                {/* Right streaming wake streak */}
                <path d="M 412 256 C 440 264 470 274 500 282" stroke="#ffffff" strokeWidth="3" strokeDasharray="8 4" opacity="0.85" fill="none" className="animate-pulse" />
                <path d="M 408 260 C 435 270 455 280 485 288" stroke="#bae6fd" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" fill="none" />
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
            {/* VINTAGE POLAR GRAMOPHONE (Moved inward to X=135, Y=190, safe from edge!)  */}
            {/* Features mahogany soundbox, spinning record, brass morning-glory horn,     */}
            {/* and floating musical notes (♪ ♫) rising into the arctic night              */}
            {/* ========================================================================= */}
            {decorations.hasGramophone && (
              <g transform="translate(135, 190)">
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
            {/* NORDIC WOOL BLANKET (Moved to X=115, Y=225, generous room from otter!)    */}
            {/* Features soft layered folds, Scandinavian winter stitches, and soft fringes */}
            {/* ========================================================================= */}
            {decorations.hasCozyQuilt && (
              <g transform="translate(115, 225)">
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
            {/* the wool blanket at X=112, Y=221, sleeping with soft breathing animation   */}
            {/* ========================================================================= */}
            {hasGuestFox && (
              <g
                transform="translate(112, 221)"
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

            {/* --------------------------------------------------------------------- */}
            {/* 7. THE ICE OTTER MASCOT (Sitting dead-center on the snow plateau)     */}
            {/* Feet rest firmly at Y=224, body center at X=220. Visible when !diving */}
            {/* --------------------------------------------------------------------- */}
            {!isDiving && !isCruising ? (
              <g id="ice-otter" transform="translate(140, 82)">
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
            ) : isCruising ? (
              /* ========================================================================= */
              /* 8. CRUISING STATE: AUTHENTIC ON-MODEL OTTER PUSHING & KICKING IN WATER     */
              /* 100% Mascot Line Weights (3.8px), Same Face, Same Colors, Paws on Ice    */
              /* ========================================================================= */
              <g
                id="pushing-otter"
                transform="translate(64, 224)"
                className="cursor-pointer group animate-otter-pushing"
                onClick={handleInteraction}
              >
                {/* 1. Translucent Water Surface Ripples around Waist */}
                <ellipse cx="-16" cy="26" rx="36" ry="11" fill="none" stroke="#7dd3fc" strokeWidth="2.5" opacity="0.7" />
                <ellipse cx="-16" cy="26" rx="25" ry="7" fill="#38bdf8" opacity="0.22" />

                {/* 2. Water Wake Speed Streaks trailing behind */}
                <path d="M -36 24 C -60 28 -90 34 -120 38" stroke="#ffffff" strokeWidth="3" strokeDasharray="8 4" opacity="0.85" fill="none" className="animate-pulse" />
                <path d="M -30 30 C -55 36 -80 42 -105 46" stroke="#bae6fd" strokeWidth="2.2" strokeDasharray="6 3" opacity="0.7" fill="none" />

                {/* 3. Churning Propeller Jet Bubbles behind Kicking Flippers */}
                <circle cx="-48" cy="24" r="4.5" fill="#ffffff" opacity="0.9" className="animate-ping" style={{ animationDuration: '0.8s' }} />
                <circle cx="-60" cy="30" r="5.5" fill="#bae6fd" opacity="0.8" className="animate-ping" style={{ animationDuration: '1.1s' }} />
                <circle cx="-72" cy="20" r="4" fill="#7dd3fc" opacity="0.7" className="animate-ping" style={{ animationDuration: '1.4s' }} />
                <circle cx="-84" cy="32" r="3" fill="#e0f2fe" opacity="0.6" className="animate-ping" style={{ animationDuration: '0.9s' }} />

                {/* 4. Chubby Tail swishing in water */}
                <path
                  d="M -26 18 C -44 14 -52 24 -46 30 C -40 32 -32 26 -26 22 Z"
                  fill="#3c4556"
                  stroke="#2e384d"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* 5. Alternating Flutter-Kicking Hind Flippers */}
                {/* Back Left Leg & Webbed Flipper */}
                <g className="animate-flutter-kick-1">
                  <path
                    d="M -22 24 C -36 20 -46 28 -40 34 C -34 36 -28 30 -24 28 Z"
                    fill="#3c4556"
                    stroke="#2e384d"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                </g>
                {/* Back Right Leg & Webbed Flipper */}
                <g className="animate-flutter-kick-2">
                  <path
                    d="M -16 28 C -30 28 -40 38 -32 42 C -26 42 -20 34 -16 32 Z"
                    fill="#3c4556"
                    stroke="#2e384d"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                </g>

                {/* 6. Chubby Cream Body (Leaning forward into the ice shelf) */}
                <path
                  d="M -4 4 C -24 8 -30 24 -22 34 C -12 42 12 36 20 22 C 24 14 18 4 8 2 Z"
                  fill="#fdfbf7"
                  stroke="#2e384d"
                  strokeWidth="3.8"
                  strokeLinejoin="round"
                />

                {/* 7. Front Paws Firmly Pressed against the Ice Shelf */}
                {/* Upper Paw */}
                <path d="M 16 6 C 22 4 30 8 28 16" stroke="#2e384d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                <ellipse cx="30" cy="16" rx="8" ry="7" fill="#3c4556" stroke="#2e384d" strokeWidth="3.5" />
                <line x1="27" y1="13" x2="32" y2="15" stroke="#2e384d" strokeWidth="1.8" strokeLinecap="round" />
                {/* Lower Paw */}
                <path d="M 10 14 C 16 14 24 20 22 26" stroke="#2e384d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                <ellipse cx="24" cy="26" rx="8" ry="7" fill="#3c4556" stroke="#2e384d" strokeWidth="3.5" />
                <line x1="21" y1="23" x2="26" y2="25" stroke="#2e384d" strokeWidth="1.8" strokeLinecap="round" />

                {/* Splash froth where paws press against ice shelf */}
                <path d="M 22 22 Q 28 18 36 24" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />

                {/* 8. Water spray droplets splashing around */}
                <circle cx="-42" cy="18" r="3" fill="#ffffff" className="animate-bounce" />
                <circle cx="-32" cy="14" r="2.2" fill="#bae6fd" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
                <circle cx="-22" cy="10" r="2" fill="#e0f2fe" className="animate-bounce" style={{ animationDelay: '0.6s' }} />

                {/* 9. ON-MODEL MASCOT HEAD (3/4 Angled, Same Size, Same Colors) */}
                <ellipse cx="14" cy="-6" rx="23" ry="20" fill="#fdfbf7" stroke="#2e384d" strokeWidth="3.8" />

                {/* Charcoal Ears (Same shape and stroke) */}
                <ellipse cx="1" cy="-21" rx="6" ry="8.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(-18 1 -21)" />
                <ellipse cx="27" cy="-21" rx="6" ry="8.5" fill="#3c4556" stroke="#2e384d" strokeWidth="3.2" transform="rotate(18 27 -21)" />

                {/* Whiskers (Same strokeWidth 2.6) */}
                <path d="M -7 -1 Q 0 1 5 2" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M -6 6 Q 1 6 5 5" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M 37 -1 Q 30 1 25 2" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M 36 6 Q 29 6 25 5" stroke="#2e384d" strokeWidth="2.6" strokeLinecap="round" fill="none" />

                {/* Eyes (Blinking animation, same cute eyes!) */}
                {blink ? (
                  <>
                    <path d="M 6 -6 Q 10 -11 14 -6" stroke="#2e384d" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M 20 -6 Q 24 -11 28 -6" stroke="#2e384d" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse cx="10" cy="-6" rx="3.6" ry="5.2" fill="#2e384d" />
                    <ellipse cx="24" cy="-6" rx="3.6" ry="5.2" fill="#2e384d" />
                  </>
                )}

                {/* Button Nose & Cheerful Smiling Mouth */}
                <path d="M 14 -3 Q 17 -5 20 -3 Q 17 0 14 -3 Z" fill="#2e384d" />
                <path d="M 14 0 Q 17 4 20 0" stroke="#2e384d" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* Soft Pastel Pink Blush (Same #fecdd3 cheeks!) */}
                <ellipse cx="4" cy="-1" rx="7.5" ry="4.5" fill="#fecdd3" opacity="0.85" />
                <ellipse cx="30" cy="-1" rx="7.5" ry="4.5" fill="#fecdd3" opacity="0.85" />
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

          {isCruising && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-teal-950/90 text-teal-200 font-bold px-4 py-1.5 rounded-full text-xs shadow-xl border border-teal-400/40 animate-pulse flex items-center gap-2 whitespace-nowrap backdrop-blur-sm">
              <span className="animate-spin inline-block text-sm" style={{ animationDuration: '4s' }}>🧭</span>
              <span>{lang === 'zh' ? '小水獭正在奋力推冰巡航中 🌊' : 'Otter cruising & pushing the ice 🌊'}</span>
            </div>
          )}

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
  );
};
