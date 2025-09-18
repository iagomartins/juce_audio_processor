// Mock implementation that runs in Node.js child process
// This file provides the same API as the native addon but runs in Node.js

const fs = require("fs");

// Enhanced logging function
function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] [MOCK] ${message}\n`;

  // Log to console
  console.log(logEntry.trim());

  // Log to file
  try {
    fs.appendFileSync("juce_debug.log", logEntry);
  } catch (err) {
    console.error("Failed to write to log file:", err.message);
  }
}

class JUCEAudioProcessorMock {
  constructor() {
    this.isInitializedFlag = false;
    this.volume = 1.0;
    this.flangerEnabled = false;
    this.flangerRate = 0.5;
    this.flangerDepth = 0.3;
    this.filterCutoff = 1000;
    this.filterResonance = 1.0;
    this.pitchBend = 0;
    this.jogWheelPosition = 0.5;

    logMessage("Mock JUCEAudioProcessor created");

    // Simulate initialization delay
    setTimeout(() => {
      this.isInitializedFlag = true;
      logMessage("Mock processor initialized");
    }, 100);
  }

  isInitialized() {
    return this.isInitializedFlag;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    logMessage(`Volume set to: ${this.volume}`);
  }

  setFlangerEnabled(enabled) {
    this.flangerEnabled = Boolean(enabled);
    logMessage(`Flanger enabled: ${this.flangerEnabled}`);
  }

  setFlangerRate(rate) {
    this.flangerRate = Math.max(0, Math.min(1, rate));
    logMessage(`Flanger rate set to: ${this.flangerRate}`);
  }

  setFlangerDepth(depth) {
    this.flangerDepth = Math.max(0, Math.min(1, depth));
    logMessage(`Flanger depth set to: ${this.flangerDepth}`);
  }

  setFilterCutoff(cutoff) {
    this.filterCutoff = Math.max(20, Math.min(20000, cutoff));
    logMessage(`Filter cutoff set to: ${this.filterCutoff}Hz`);
  }

  setFilterResonance(resonance) {
    this.filterResonance = Math.max(0, Math.min(2, resonance));
    logMessage(`Filter resonance set to: ${this.filterResonance}`);
  }

  setPitchBend(semitones) {
    this.pitchBend = semitones;
    logMessage(`Pitch bend set to: ${this.pitchBend} semitones`);
  }

  setJogWheelPosition(position) {
    this.jogWheelPosition = Math.max(0, Math.min(1, position));
    logMessage(`Jog wheel position set to: ${this.jogWheelPosition}`);
  }

  processAudio(buffer) {
    // Mock audio processing - in real implementation this would process the buffer
    logMessage(
      `Processing audio buffer of size: ${buffer ? buffer.byteLength : 0} bytes`
    );
    return buffer; // Return the same buffer for now
  }

  // Additional methods for getting current state
  getVolume() {
    return this.volume;
  }

  getFlangerEnabled() {
    return this.flangerEnabled;
  }

  getFlangerRate() {
    return this.flangerRate;
  }

  getFlangerDepth() {
    return this.flangerDepth;
  }

  getFilterCutoff() {
    return this.filterCutoff;
  }

  getFilterResonance() {
    return this.filterResonance;
  }

  getPitchBend() {
    return this.pitchBend;
  }

  getJogWheelPosition() {
    return this.jogWheelPosition;
  }
}

// Export the mock class
module.exports = JUCEAudioProcessorMock;
