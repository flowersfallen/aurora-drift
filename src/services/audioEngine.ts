// Web Audio API procedural sound engine
// 100% offline, zero external audio dependency, pure relaxation

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Sound nodes
  private windGain: GainNode | null = null;
  private fireGain: GainNode | null = null;
  private wavesGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Running sources / intervals
  private musicInterval: number | null = null;
  private fireInterval: number | null = null;

  public dispose() {
    if (this.musicInterval) clearInterval(this.musicInterval);
    if (this.fireInterval) clearInterval(this.fireInterval);
    if (this.ctx) this.ctx.close();
  }

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Setup procedural ambient channels
      this.setupWindChannel();
      this.setupFireChannel();
      this.setupWavesChannel();
      this.setupMusicChannel();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or user gesture needed:', e);
    }
  }

  // --- 1. Procedural Arctic Wind ---
  private setupWindChannel() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate Pink Noise for smooth wind
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating wind whistling through ice
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO to slowly modulate wind frequency
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // very slow swell
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    whiteNoise.start();
  }

  // --- 2. Procedural Campfire Crackle ---
  private setupFireChannel() {
    if (!this.ctx || !this.masterGain) return;

    this.fireGain = this.ctx.createGain();
    this.fireGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.fireGain.connect(this.masterGain);

    // Low rumble of the fire
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.8;
    }

    const rumble = this.ctx.createBufferSource();
    rumble.buffer = noiseBuffer;
    rumble.loop = true;
    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

    rumble.connect(rumbleFilter);
    rumbleFilter.connect(this.fireGain);
    rumble.start();

    // Random pops and crackles
    this.fireInterval = window.setInterval(() => {
      if (!this.ctx || !this.fireGain || this.fireGain.gain.value <= 0.01) return;
      if (Math.random() < 0.6) {
        this.triggerFireCrackle();
      }
    }, 180);
  }

  private triggerFireCrackle() {
    if (!this.ctx || !this.fireGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    const freq = 600 + Math.random() * 2200;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12 * Math.random(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.fireGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // --- 3. Procedural Ocean Waves Lapping Ice ---
  private setupWavesChannel() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const waveNoise = this.ctx.createBufferSource();
    waveNoise.buffer = noiseBuffer;
    waveNoise.loop = true;

    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(280, this.ctx.currentTime);

    // LFO for rhythmic swell every ~5 seconds
    const waveLfo = this.ctx.createOscillator();
    const waveLfoGain = this.ctx.createGain();
    waveLfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    waveLfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    waveLfo.connect(waveLfoGain);
    waveLfoGain.connect(waveFilter.frequency);
    waveLfo.start();

    this.wavesGain = this.ctx.createGain();
    this.wavesGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    waveNoise.connect(waveFilter);
    waveFilter.connect(this.wavesGain);
    this.wavesGain.connect(this.masterGain);
    waveNoise.start();
  }

  // --- 4. Generative Ambient Lo-fi Pentatonic Chimes ---
  private setupMusicChannel() {
    if (!this.ctx || !this.masterGain) return;

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    // Scale: Peaceful E minor / G Major pentatonic (E4, G4, A4, B4, D5, E5, G5)
    const scale = [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99];

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.musicGain.gain.value <= 0.01) return;
      if (Math.random() < 0.65) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        this.playGentleChime(note);
      }
    }, 3200);
  }

  public playGentleChime(freq: number, duration = 2.5) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Gentle soft attack, long dreamy decay
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- 5. ASMR: Clam Cracking Ritual (Tap-Tap-Crack) ---
  public playClamTap(stage: 1 | 2 | 3) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    if (stage === 1) {
      // 1st Tap: Crisp pebble on shell "Tink!"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1420, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(now + 0.09);
    } else if (stage === 2) {
      // 2nd Tap: Heavier clack with micro-fissure resonance
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(720, now);
      osc2.frequency.exponentialRampToValueAtTime(320, now + 0.1);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc2.start();
      osc.stop(now + 0.14);
      osc2.stop(now + 0.14);
    } else {
      // 3rd Tap: Full Shatter / Burst of glowing ice!
      // Part A: Sub-thump
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(220, now);
      bass.frequency.exponentialRampToValueAtTime(45, now + 0.35);
      bassGain.gain.setValueAtTime(0.6, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      bass.connect(bassGain);
      bassGain.connect(this.masterGain);
      bass.start();
      bass.stop(now + 0.36);

      // Part B: Ice crack noise burst
      const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.25), this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2400, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start();

      // Part C: Sparkle Chimes
      [880, 1174, 1480, 1760].forEach((f, idx) => {
        setTimeout(() => {
          this.playGentleChime(f, 1.8);
        }, idx * 60);
      });
    }
  }

  // --- 6. Splash / Bubble when diving ---
  public playBubbleSplash() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [420, 560, 680, 820].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const startTime = now + i * 0.05;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.08);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.09);
    });
  }

  // --- 7. Deep Oceanic Whale Song Hum ---
  public playWhaleSong() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(110, now + 2.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 3.1);

    // Subtle overtone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(280, now);
    osc2.frequency.exponentialRampToValueAtTime(390, now + 1.2);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 2.6);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.5);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now);
    osc2.stop(now + 2.9);
  }

  // --- 8. Waypoint Arrival Celestial Fanfare ---
  public playWaypointFanfare() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playGentleChime(freq, 2.5);
      }, idx * 160);
    });
  }

  // --- Volume Controls ---
  public setMasterVolume(v: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(v, this.ctx.currentTime);
    }
  }

  public setWindVolume(v: number) {
    if (this.windGain && this.ctx) {
      this.windGain.gain.setValueAtTime(v * 0.4, this.ctx.currentTime);
    }
  }

  public setFireVolume(v: number) {
    if (this.fireGain && this.ctx) {
      this.fireGain.gain.setValueAtTime(v * 0.45, this.ctx.currentTime);
    }
  }

  public setWavesVolume(v: number) {
    if (this.wavesGain && this.ctx) {
      this.wavesGain.gain.setValueAtTime(v * 0.5, this.ctx.currentTime);
    }
  }

  public setMusicVolume(v: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(v * 0.6, this.ctx.currentTime);
    }
  }
}

export const audioEngine = new AudioEngine();
