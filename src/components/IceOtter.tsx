import React, { useState, useEffect } from 'react';
import { OtterState, CampDecorations } from '../types';

interface IceOtterProps {
  state: OtterState;
  decorations: CampDecorations;
  onOtterClick: () => void;
}

export const IceOtter: React.FC<IceOtterProps> = ({ state, decorations, onOtterClick }) => {
  const [blink, setBlink] = useState(false);
  const [dialogue, setDialogue] = useState<string | null>(null);

  // Natural cute blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, []);

  const cozyQuotes = [
    "A little otter in a cooler world ✨",
    "Slide on your belly whenever you find snow! ❄️",
    "Chill, swim, crack shells, repeat~ 🦦",
    "Look! I found the sparkliest ice cube 🧊",
    "Take a cozy deep breath... you're doing great ☕",
    "Always keep your favorite pebble close 🪨",
    "Small otter, big cozy dreams! 🏔️",
    "The polar aurora is dancing just for you 🌌",
  ];

  const handleInteraction = () => {
    if (state === 'diving') return;
    const randomQuote = cozyQuotes[Math.floor(Math.random() * cozyQuotes.length)];
    setDialogue(randomQuote);
    setTimeout(() => setDialogue(null), 3600);
    onOtterClick();
  };

  const isDiving = state === 'diving';

  return (
    <div className="relative flex flex-col items-center justify-end select-none">
      {/* Speech Bubble - Floats right above otter's head */}
      {dialogue && !isDiving && (
        <div className="absolute top-2 z-50 animate-bounce px-4 py-2 rounded-2xl bg-white/95 text-slate-800 text-xs font-semibold max-w-[240px] text-center border-2 border-sky-300 shadow-xl shadow-sky-950/40">
          {dialogue}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white"></div>
        </div>
      )}

      {/* Main Unified Stage: Fixed dimensions so it NEVER shifts during diving */}
      <div
        onClick={handleInteraction}
        className="relative w-[460px] h-[320px] flex items-center justify-center"
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

            {/* Decor: Vintage Polar Gramophone (Left rear snow shelf, X=90, Y=195) */}
            {decorations.hasGramophone && (
              <g transform="translate(90, 195)">
                <rect x="-14" y="-12" width="28" height="14" rx="3" fill="#854d0e" stroke="#2d3748" strokeWidth="2" />
                <circle cx="0" cy="-12" r="9" fill="#1e293b" />
                <circle cx="0" cy="-12" r="3" fill="#fbbf24" />
                {/* Brass horn */}
                <path d="M 6 -12 Q 18 -26 24 -24 Q 22 -14 12 -12 Z" fill="#eab308" stroke="#2d3748" strokeWidth="1.8" />
                {/* Music note floating */}
                <text x="18" y="-30" fontSize="14" fill="#38bdf8" className="animate-bounce">♪</text>
              </g>
            )}

            {/* Decor: Nordic Wool Blanket (Left snow corner, X=140, Y=222) */}
            {decorations.hasCozyQuilt && (
              <g transform="translate(140, 222)">
                <ellipse cx="0" cy="0" rx="20" ry="8" fill="#38bdf8" stroke="#1e293b" strokeWidth="2" />
                <path d="M -16 -2 Q 0 4 16 -2" stroke="#ffffff" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                <path d="M -18 2 L -22 6 M -14 3 L -17 7 M -10 3 L -12 8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
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
            {!isDiving ? (
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

          {isDiving && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-sky-950/90 text-sky-200 font-bold px-4 py-1.5 rounded-full text-xs shadow-xl border border-sky-400/40 animate-pulse flex items-center gap-2 whitespace-nowrap backdrop-blur-sm">
              <span className="animate-spin text-sm">🫧</span>
              <span>Diving in polar waters...</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
