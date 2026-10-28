"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { createFrameEmitter } from "@/lib/audio/frame-source";
import type { FrameSource, MeterFrame, VisualFrame } from "@/lib/audio/types";
import { clamp, gainToDb, SILENCE_DB } from "@/lib/audio/decibels";

const NUM_BANDS = 32;
const HISTORY_LENGTH = 64;

export interface AudioMeterSources {
  meterSource: FrameSource<MeterFrame>;
  spectrumSource: FrameSource<VisualFrame>;
}

/**
 * Custom hook providing live 60fps FrameSources for @audiocn LevelMeter and Spectrum.
 * Automatically switches between real AnalyserNode data (when direct audio is active)
 * and organic tempo-synced DSP synthesis (when YouTube iframe / CORS restricts direct audio).
 */
export function useAudioMeterSource(): AudioMeterSources {
  const { analyser, isPlaying, volume, bass, mid, treble, pan } = usePlayerStore();

  const meterEmitter = useMemo(() => createFrameEmitter<MeterFrame>(), []);
  const spectrumEmitter = useMemo(() => createFrameEmitter<VisualFrame>(), []);

  const stateRef = useRef({
    isPlaying,
    volume,
    bass,
    mid,
    treble,
    pan,
    analyser,
  });

  useEffect(() => {
    stateRef.current = {
      isPlaying,
      volume,
      bass,
      mid,
      treble,
      pan,
      analyser,
    };
  }, [isPlaying, volume, bass, mid, treble, pan, analyser]);

  useEffect(() => {
    let animId: number;
    let time = 0;

    const bands = new Float32Array(NUM_BANDS);
    const history = new Float32Array(HISTORY_LENGTH);
    let historyStart = 0;

    // Smoothed meter levels
    let currentLeftPeak = -60;
    let currentRightPeak = -60;
    let currentLeftRms = -60;
    let currentRightRms = -60;

    // Analyser buffers
    const freqBuffer = new Uint8Array(128);
    const timeBuffer = new Uint8Array(128);

    const updateFrame = () => {
      const { isPlaying: activePlaying, volume: vol, analyser: node, bass: b, mid: m, treble: t, pan: p } = stateRef.current;
      time += 0.04;

      let hasRealAudio = false;
      let leftPeak = SILENCE_DB;
      let rightPeak = SILENCE_DB;
      let leftRms = SILENCE_DB;
      let rightRms = SILENCE_DB;

      if (activePlaying && node) {
        try {
          node.getByteFrequencyData(freqBuffer);
          node.getByteTimeDomainData(timeBuffer);

          let sum = 0;
          let maxDev = 0;
          for (let i = 0; i < timeBuffer.length; i++) {
            const dev = Math.abs(timeBuffer[i] - 128);
            if (dev > maxDev) maxDev = dev;
            sum += dev * dev;
          }

          if (maxDev > 2) {
            hasRealAudio = true;
            const normPeak = clamp((maxDev / 128) * vol, 0.0001, 1.2);
            const normRms = clamp((Math.sqrt(sum / timeBuffer.length) / 128) * vol, 0.0001, 1.0);

            // Apply stereo pan weighting
            const leftWeight = clamp(1 - p, 0, 1.5);
            const rightWeight = clamp(1 + p, 0, 1.5);

            leftPeak = gainToDb(normPeak * leftWeight);
            rightPeak = gainToDb(normPeak * rightWeight);
            leftRms = gainToDb(normRms * leftWeight);
            rightRms = gainToDb(normRms * rightWeight);

            // Map FFT bins to 32 bands
            const binStep = Math.max(1, Math.floor(freqBuffer.length / NUM_BANDS));
            for (let bIdx = 0; bIdx < NUM_BANDS; bIdx++) {
              let binSum = 0;
              const start = bIdx * binStep;
              const end = Math.min(start + binStep, freqBuffer.length);
              for (let k = start; k < end; k++) {
                binSum += freqBuffer[k];
              }
              const avg = binSum / (end - start || 1);
              let val = (avg / 255) * vol;

              // Apply EQ curve to bands
              if (bIdx < 8) val *= Math.max(0.2, 1 + b / 12);
              else if (bIdx < 20) val *= Math.max(0.2, 1 + m / 12);
              else val *= Math.max(0.2, 1 + t / 12);

              // Smooth decay
              bands[bIdx] = bands[bIdx] * 0.75 + clamp(val, 0, 1) * 0.25;
            }
          }
        } catch {
          hasRealAudio = false;
        }
      }

      // Organic DSP synthesis fallback (for YouTube iframe or quiet gaps)
      if (activePlaying && !hasRealAudio && vol > 0.01) {
        // Multi-frequency rhythm oscillators
        const beat4 = Math.pow(Math.max(0, Math.sin(time * 2.2)), 3); // 4-on-the-floor kick
        const snare = Math.pow(Math.max(0, Math.sin(time * 1.1 - 0.5)), 4) * 0.7; // Snare accent
        const hihat = Math.abs(Math.sin(time * 4.4)) * 0.4; // Hi-hat sixteenths
        const swell = 0.65 + Math.sin(time * 0.4) * 0.25; // Macro dynamic swell

        const bassEnergy = (beat4 * 0.75 + Math.sin(time * 1.5) * 0.25) * Math.max(0.2, 1 + b / 12);
        const midEnergy = (snare * 0.6 + Math.sin(time * 2.8) * 0.3) * Math.max(0.2, 1 + m / 12);
        const trebleEnergy = (hihat * 0.5 + Math.sin(time * 5.1) * 0.25) * Math.max(0.2, 1 + t / 12);

        const totalEnergy = clamp((bassEnergy * 0.5 + midEnergy * 0.3 + trebleEnergy * 0.2) * swell * vol, 0.01, 1.0);

        // Natural stereo spread
        const stereoDiff = Math.sin(time * 1.8) * 0.12;
        const leftGain = clamp((totalEnergy * (1 - p * 0.5) + stereoDiff * 0.1) * 0.9, 0.001, 1.2);
        const rightGain = clamp((totalEnergy * (1 + p * 0.5) - stereoDiff * 0.1) * 0.9, 0.001, 1.2);

        leftPeak = gainToDb(leftGain) - 2; // -2 dB headroom
        rightPeak = gainToDb(rightGain) - 2;
        leftRms = leftPeak - 8;
        rightRms = rightPeak - 8;

        // Synthesize 32 frequency bands with natural 1/f slope and rhythm spikes
        for (let i = 0; i < NUM_BANDS; i++) {
          const normIdx = i / NUM_BANDS;
          // 1/f pink noise rolloff
          const pink = Math.pow(1 - normIdx * 0.6, 1.8);
          
          let bandExcitement = 0;
          if (i < 6) {
            // Sub/Bass
            bandExcitement = bassEnergy * 0.85 + Math.sin(time * 3 + i) * 0.15;
          } else if (i < 18) {
            // Mids / Vocals
            bandExcitement = midEnergy * 0.75 + Math.cos(time * 2.5 + i * 0.5) * 0.15;
          } else {
            // Highs / Air
            bandExcitement = trebleEnergy * 0.65 + Math.sin(time * 6 + i) * 0.2;
          }

          const targetBand = clamp(pink * bandExcitement * swell * vol * 0.95, 0, 0.98);
          // Fast attack, smooth decay
          const rate = targetBand > bands[i] ? 0.35 : 0.12;
          bands[i] += (targetBand - bands[i]) * rate;
        }
      } else if (!activePlaying || vol <= 0.01) {
        // Smooth fade to silence
        leftPeak = -60;
        rightPeak = -60;
        leftRms = -60;
        rightRms = -60;
        for (let i = 0; i < NUM_BANDS; i++) {
          bands[i] *= 0.85;
          if (bands[i] < 0.005) bands[i] = 0;
        }
      }

      // Smooth ballistics interpolation
      const attack = 0.55;
      const decay = 0.15;
      currentLeftPeak += (leftPeak - currentLeftPeak) * (leftPeak > currentLeftPeak ? attack : decay);
      currentRightPeak += (rightPeak - currentRightPeak) * (rightPeak > currentRightPeak ? attack : decay);
      currentLeftRms += (leftRms - currentLeftRms) * (leftRms > currentLeftRms ? attack : decay);
      currentRightRms += (rightRms - currentRightRms) * (rightRms > currentRightRms ? attack : decay);

      // Clamp safe display values
      const safeLeftPeak = clamp(currentLeftPeak, -60, 3);
      const safeRightPeak = clamp(currentRightPeak, -60, 3);
      const safeLeftRms = clamp(currentLeftRms, -60, 0);
      const safeRightRms = clamp(currentRightRms, -60, 0);

      // Push LevelMeter frame (Stereo Left & Right)
      meterEmitter.emit({
        channels: [
          { peakDb: safeLeftPeak, rmsDb: safeLeftRms },
          { peakDb: safeRightPeak, rmsDb: safeRightRms },
        ],
      });

      // Update broadband history ring buffer
      const currentBroadband = clamp(Math.max(bands[0] || 0, bands[4] || 0, bands[10] || 0), 0, 1);
      history[historyStart] = currentBroadband;
      historyStart = (historyStart + 1) % HISTORY_LENGTH;

      // Push Spectrum visual frame
      spectrumEmitter.emit({
        bands: new Float32Array(bands),
        history: new Float32Array(history),
        historyStart,
        historyLength: HISTORY_LENGTH,
        peakDb: Math.max(safeLeftPeak, safeRightPeak),
      });

      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [meterEmitter, spectrumEmitter]);

  return {
    meterSource: meterEmitter,
    spectrumSource: spectrumEmitter,
  };
}
