// Wrapper class that communicates with the child process
const { fork } = require("child_process");
const path = require("path");
const fs = require("fs");

// Enhanced logging function
function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] [WRAPPER] ${message}\n`;

  // Log to console
  console.log(logEntry.trim());

  // Log to file
  try {
    fs.appendFileSync("juce_debug.log", logEntry);
  } catch (err) {
    console.error("Failed to write to log file:", err.message);
  }
}

class JUCEAudioProcessorWrapper {
  constructor() {
    this.child = null;
    this.ready = false;
    this.pendingCalls = new Map();
    this.callId = 0;
    this.initializationPromise = null;

    this.initChildProcess();
  }

  initChildProcess() {
    try {
      logMessage("Starting child process...");

      this.child = fork(path.join(__dirname, "audio-processor-child.js"), [], {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
        env: { ...process.env, NODE_ENV: "production" },
      });

      this.child.on("message", (msg) => {
        this.handleChildMessage(msg);
      });

      this.child.on("error", (error) => {
        logMessage(`Child process error: ${error.message}`, "ERROR");
        this.ready = false;
      });

      this.child.on("exit", (code) => {
        logMessage(`Child process exited with code: ${code}`, "WARN");
        this.ready = false;

        // If the child process exits unexpectedly, try to restart it
        if (code !== 0) {
          logMessage("Child process crashed, attempting to restart...", "WARN");
          setTimeout(() => {
            this.initChildProcess();
          }, 1000);
        }
      });

      // Wait for ready signal
      this.child.once("message", (msg) => {
        if (msg.type === "ready") {
          this.ready = true;
          logMessage("Child process ready");
          this.initializationPromise = this.createProcessor();
        }
      });
    } catch (error) {
      logMessage(`Failed to start child process: ${error.message}`, "ERROR");
      throw error;
    }
  }

  handleChildMessage(msg) {
    if (msg.type === "created") {
      logMessage(
        `Processor created: ${msg.success}, Initialized: ${msg.initialized}`
      );
    } else if (msg.type === "method_result") {
      const { method, result, success } = msg;
      if (this.pendingCalls.has(method)) {
        const { resolve, reject } = this.pendingCalls.get(method);
        this.pendingCalls.delete(method);

        if (success) {
          resolve(result);
        } else {
          reject(new Error(`Method ${method} failed`));
        }
      }
    } else if (msg.type === "error") {
      logMessage(`Child process error: ${msg.error}`, "ERROR");
    }
  }

  createProcessor() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout waiting for processor creation"));
      }, 10000); // Increased timeout

      this.child.once("message", (msg) => {
        clearTimeout(timeout);
        if (msg.type === "created" && msg.success) {
          resolve(msg);
        } else {
          reject(new Error("Failed to create processor"));
        }
      });

      this.child.send({ type: "create" });
    });
  }

  async waitForReady() {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    // Wait a bit more for the child process to be fully ready
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async callMethod(method, ...args) {
    await this.waitForReady();

    if (!this.ready || !this.child) {
      throw new Error("Child process not ready");
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingCalls.delete(method);
        reject(new Error(`Timeout waiting for method ${method}`));
      }, 10000); // Increased timeout

      this.pendingCalls.set(method, { resolve, reject });

      this.child.send({
        type: "method",
        method: method,
        args: args,
      });
    });
  }

  // Proxy methods to child process
  async isInitialized() {
    return this.callMethod("isInitialized");
  }

  async setVolume(volume) {
    return this.callMethod("setVolume", volume);
  }

  async setFlangerEnabled(enabled) {
    return this.callMethod("setFlangerEnabled", enabled);
  }

  async setFlangerRate(rate) {
    return this.callMethod("setFlangerRate", rate);
  }

  async setFlangerDepth(depth) {
    return this.callMethod("setFlangerDepth", depth);
  }

  async setFilterCutoff(cutoff) {
    return this.callMethod("setFilterCutoff", cutoff);
  }

  async setFilterResonance(resonance) {
    return this.callMethod("setFilterResonance", resonance);
  }

  async setPitchBend(semitones) {
    return this.callMethod("setPitchBend", semitones);
  }

  async setJogWheelPosition(position) {
    return this.callMethod("setJogWheelPosition", position);
  }

  async processAudio(buffer) {
    return this.callMethod("processAudio", buffer);
  }

  // Cleanup method
  destroy() {
    if (this.child) {
      this.child.kill();
      this.child = null;
    }
    this.ready = false;
  }
}

module.exports = JUCEAudioProcessorWrapper;
