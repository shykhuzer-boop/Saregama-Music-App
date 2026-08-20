/**
 * Web Audio Synthesizer & Sound Engine for Saregama
 * Generates ambient music, binaural brainwave frequencies, lo-fi textures,
 * relaxing melodic harmonies, and audio diagnostic tones for real in-browser playback.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentPreset: string = 'deep_ambient';
  private masterGain: GainNode | null = null;
  private nodes: (AudioNode | number)[] = [];
  private volume: number = 0.8;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public playPreset(preset: string) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentPreset = preset;

    switch (preset) {
      case 'binaural_flow':
        this.startBinauralBeats(216, 40); // 40Hz Gamma focus with 216Hz carrier
        break;
      case 'binaural_om':
        this.startBinauralOm();
        break;
      case 'lofi_synth':
        this.startLoFiChords();
        break;
      case 'bollywood_lofi':
        this.startBollywoodLoFi();
        break;
      case 'hindi_acoustic':
        this.startHindiAcousticSitar();
        break;
      case 'sufi_meditation':
        this.startSufiMeditation();
        break;
      case 'piano_reverb':
        this.startAmbientPiano();
        break;
      case 'rain_city':
        this.startRainAndNoise();
        break;
      case 'chill_pulse':
        this.startChillPulse();
        break;
      case 'deep_ambient':
      default:
        this.startDeepAmbient();
        break;
    }
  }

  private startBinauralOm() {
    if (!this.ctx || !this.masterGain) return;
    // 136.1Hz Cosmic Om frequency + 40Hz Gamma binaural beat
    this.startBinauralBeats(136.1, 40);
    this.startTanpuraDrone(136.1);
  }

  private startTanpuraDrone(rootFreq: number = 146.83) { // D3
    if (!this.ctx || !this.masterGain) return;
    const tanpuraFreqs = [rootFreq * 0.75, rootFreq, rootFreq * 1.5, rootFreq * 2]; // Pa, Sa, Pa, Sa
    tanpuraFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500 + idx * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();

      osc.connect(filter).connect(gain).connect(this.masterGain);
      osc.start();
      this.nodes.push(osc, lfo, filter, gain, lfoGain);
    });
  }

  private startHindiAcousticSitar() {
    if (!this.ctx || !this.masterGain) return;

    // Start grounding Tanpura drone (Sa - Pa - Sa)
    this.startTanpuraDrone(146.83);

    // Raga Yaman / Bhairavi scale notes for sitar simulation (Sa, Re, Ga, Ma, Pa, Dha, Ni, Sa)
    const sitarNotes = [146.83, 165.00, 185.00, 207.65, 220.00, 246.94, 277.18, 293.66, 329.63, 370.00];

    const playSitarPluck = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = sitarNotes[Math.floor(Math.random() * sitarNotes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sitar characteristic rich harmonics
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(note * 2.2, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.03); // Quick crisp pluck
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5); // Sustained resonant decay

      osc.connect(filter).connect(gain).connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.8);
    };

    playSitarPluck();
    const interval = window.setInterval(playSitarPluck, 1400);
    this.nodes.push(interval);
  }

  private startBollywoodLoFi() {
    if (!this.ctx || !this.masterGain) return;

    // Nostalgic Indian Bollywood Lo-Fi chord progression (Fm9 - Bbm7 - Eb7 - Abmaj7)
    const chords = [
      [174.61, 207.65, 261.63, 311.13, 392.00], // Fm9
      [116.54, 174.61, 207.65, 277.18, 349.23], // Bbm7
      [155.56, 196.00, 233.08, 277.18, 349.23], // Eb7
      [207.65, 261.63, 311.13, 392.00, 466.16], // Abmaj7
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04 / (i + 1), now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.9);

        osc.connect(filter).connect(gain).connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 4.0);
      });
    };

    playChord();
    const interval = window.setInterval(playChord, 3800);
    this.nodes.push(interval);

    this.startVinylNoise();
  }

  private startSufiMeditation() {
    if (!this.ctx || !this.masterGain) return;

    // Warm Harmonium & Drone (C# / D# sufi scale)
    const baseDrone = 138.59; // C#3
    const oscDrone = this.ctx.createOscillator();
    const gainDrone = this.ctx.createGain();
    const filterDrone = this.ctx.createBiquadFilter();

    oscDrone.type = 'triangle';
    oscDrone.frequency.setValueAtTime(baseDrone, this.ctx.currentTime);
    filterDrone.type = 'lowpass';
    filterDrone.frequency.setValueAtTime(400, this.ctx.currentTime);
    gainDrone.gain.setValueAtTime(0.06, this.ctx.currentTime);

    oscDrone.connect(filterDrone).connect(gainDrone).connect(this.masterGain);
    oscDrone.start();
    this.nodes.push(oscDrone, filterDrone, gainDrone);

    // Bansuri flute gentle breath sweeps
    const fluteNotes = [277.18, 311.13, 369.99, 415.30, 466.16, 554.37];
    const playFluteBreath = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = fluteNotes[Math.floor(Math.random() * fluteNotes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.6); // Soft gentle flute attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain).connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.4);
    };

    playFluteBreath();
    const fluteInterval = window.setInterval(playFluteBreath, 2200);
    this.nodes.push(fluteInterval);
  }

  /**
   * Audio Diagnostic Tool: Test headphone channels
   */
  public testChannel(channel: 'left' | 'right' | 'both') {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(channel === 'left' ? 440 : channel === 'right' ? 880 : 528, this.ctx.currentTime);

    const panValue = channel === 'left' ? -1 : channel === 'right' ? 1 : 0;
    if (panner) {
      panner.pan.setValueAtTime(panValue, this.ctx.currentTime);
      osc.connect(gain).connect(panner).connect(this.masterGain);
    } else {
      osc.connect(gain).connect(this.masterGain);
    }

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.3);
    this.nodes.push(osc, gain);
  }

  private startBinauralBeats(carrier: number, diff: number) {
    if (!this.ctx || !this.masterGain) return;

    // Left Ear Tone
    const oscL = this.ctx.createOscillator();
    const pannerL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gainL = this.ctx.createGain();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(carrier, this.ctx.currentTime);
    gainL.gain.setValueAtTime(0.18, this.ctx.currentTime);

    // Right Ear Tone (Carrier + diff)
    const oscR = this.ctx.createOscillator();
    const pannerR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gainR = this.ctx.createGain();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(carrier + diff, this.ctx.currentTime);
    gainR.gain.setValueAtTime(0.18, this.ctx.currentTime);

    if (pannerL && pannerR) {
      pannerL.pan.setValueAtTime(-1, this.ctx.currentTime);
      pannerR.pan.setValueAtTime(1, this.ctx.currentTime);
      oscL.connect(gainL).connect(pannerL).connect(this.masterGain);
      oscR.connect(gainR).connect(pannerR).connect(this.masterGain);
    } else {
      oscL.connect(gainL).connect(this.masterGain);
      oscR.connect(gainR).connect(this.masterGain);
    }

    // Warm background drone
    const drone = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    drone.type = 'triangle';
    drone.frequency.setValueAtTime(carrier / 2, this.ctx.currentTime);
    droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    drone.connect(droneGain).connect(this.masterGain);

    oscL.start();
    oscR.start();
    drone.start();
    this.nodes.push(oscL, oscR, drone, gainL, gainR, droneGain);
  }

  private startDeepAmbient() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [130.81, 196.00, 261.63, 329.63, 392.00]; // C, G, C, E, G
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();

      osc.connect(filter).connect(gain).connect(this.masterGain);
      osc.start();
      this.nodes.push(osc, lfo, filter, gain, lfoGain);
    });
  }

  private startLoFiChords() {
    if (!this.ctx || !this.masterGain) return;

    const chordList = [
      [164.81, 196.00, 246.94, 293.66, 370.00], // Em9
      [146.83, 220.00, 277.18, 329.63, 440.00], // A13
      [146.83, 185.00, 220.00, 277.18, 329.63], // Dmaj9
      [196.00, 246.94, 293.66, 370.00, 440.00], // Gmaj7
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const chords = chordList[chordIndex % chordList.length];
      chordIndex++;

      chords.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06 / (i + 1), now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter).connect(gain).connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 4.0);
      });
    };

    playNextChord();
    const interval = window.setInterval(playNextChord, 4000);
    this.nodes.push(interval);

    this.startVinylNoise();
  }

  private startVinylNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const isPop = Math.random() < 0.0015;
      output[i] = isPop ? (Math.random() * 0.4 - 0.2) : white * 0.015;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    whiteNoise.connect(filter).connect(gain).connect(this.masterGain);
    whiteNoise.start();
    this.nodes.push(whiteNoise, filter, gain);
  }

  private startAmbientPiano() {
    if (!this.ctx || !this.masterGain) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25]; // C, E, G, C5, D5, E5
    const playNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain).connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.5);
    };

    playNote();
    const interval = window.setInterval(playNote, 1800);
    this.nodes.push(interval);
    this.startDeepAmbient();
  }

  private startRainAndNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 1.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noise.connect(filter).connect(gain).connect(this.masterGain);
    noise.start();
    this.nodes.push(noise, filter, gain);
  }

  private startChillPulse() {
    if (!this.ctx || !this.masterGain) return;

    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(65.41, this.ctx.currentTime);

    bassGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    bass.connect(bassGain).connect(this.masterGain);
    bass.start();
    this.nodes.push(bass, bassGain);

    this.startLoFiChords();
  }

  public pause() {
    this.stop();
  }

  public stop() {
    this.isPlaying = false;
    this.nodes.forEach(node => {
      if (typeof node === 'number') {
        clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore already stopped nodes
        }
      }
    });
    this.nodes = [];
  }
}

export const audioEngine = new AudioEngine();
