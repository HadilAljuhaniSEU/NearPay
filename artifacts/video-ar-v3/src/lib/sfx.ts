/**
 * Synthetic UI sound effects via Web Audio API — no mp3 files needed.
 * All sounds are generated procedurally and cached per AudioContext.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx || ctx.state === 'closed') {
      ctx = new AudioContext();
    }
    return ctx;
  } catch {
    return null;
  }
}

function ramp(param: AudioParam, from: number, to: number, start: number, end: number) {
  param.setValueAtTime(from, start);
  param.linearRampToValueAtTime(to, end);
}

/** Short soft tap click */
export function playTap(volume = 0.35) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(820, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(320, c.currentTime + 0.06);
  osc.type = 'sine';
  ramp(gain.gain, volume, 0, c.currentTime, c.currentTime + 0.08);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.08);
}

/** Positive add/confirm — ascending two-tone chime */
export function playAdd(volume = 0.4) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  [[880, 0], [1100, 0.12]].forEach(([freq, delay]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t + delay);
    gain.gain.linearRampToValueAtTime(volume, t + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);
    osc.start(t + delay);
    osc.stop(t + delay + 0.26);
  });
}

/** Selection/toggle — soft whoosh click */
export function playSelect(volume = 0.3) {
  const c = getCtx();
  if (!c) return;
  const buf = c.createBuffer(1, c.sampleRate * 0.08, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  filter.Q.value = 0.8;
  const gain = c.createGain();
  gain.gain.value = volume;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start(c.currentTime);
}

/** Payment sent — warm two-step descend */
export function playPayment(volume = 0.45) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  [[660, 0, 0.35], [440, 0.18, 0.4]].forEach(([freq, delay, dur]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t + delay);
    gain.gain.linearRampToValueAtTime(volume, t + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    osc.start(t + delay);
    osc.stop(t + delay + dur + 0.01);
  });
}

/** Notification ping — gentle single bell */
export function playNotification(volume = 0.35) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.5);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  osc.start(t);
  osc.stop(t + 0.65);
}

/** Success fanfare — 3-note rising chime */
export function playSuccess(volume = 0.5) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = t + i * 0.13;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
    osc.start(start);
    osc.stop(start + 0.6);
  });
}

/** Convenience map */
export const sfx = {
  tap: playTap,
  add: playAdd,
  select: playSelect,
  payment: playPayment,
  notification: playNotification,
  success: playSuccess,
} as const;
