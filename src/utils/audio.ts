/**
 * Audio synthesis for tactile UI feedback without external audio assets.
 * Uses Web Audio API with soft, elegant micro-tones.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function playTactileClick() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Gracefully handle browser autoplay blocks
  }
}

export function playKarmaStakeSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.03);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.03 + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + i * 0.03);
      osc.stop(ctx.currentTime + i * 0.03 + 0.25);
    });
  } catch {
    // Gracefully handle browser autoplay blocks
  }
}

export function playSuccessChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const freqs = [440, 554.37, 659.25, 880];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
    });
  } catch {
    // Gracefully handle browser autoplay blocks
  }
}
