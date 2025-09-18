const path = require("path");
const os = require("os");
const fs = require("fs");

// Enhanced logging function
function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;

  // Log to console
  console.log(logEntry.trim());

  // Log to file
  try {
    fs.appendFileSync("juce_debug.log", logEntry);
  } catch (err) {
    console.error("Failed to write to log file:", err.message);
  }
}

// Determine the correct binary path based on platform and architecture
function getBinaryPath() {
  const platform = os.platform();
  const arch = os.arch();

  logMessage(`Platform: ${platform}, Architecture: ${arch}`);
  logMessage(`Node version: ${process.version}`);

  if (process.versions.electron) {
    logMessage(`Electron version: ${process.versions.electron}`);
    logMessage(`Electron ABI: ${process.versions.modules}`);

    // For Electron, use the child process wrapper
    try {
      logMessage("Loading child process wrapper for Electron...");
      const AudioProcessorWrapper = require("./src/audio-processor-wrapper");
      logMessage("✓ Child process wrapper loaded successfully");
      return AudioProcessorWrapper; // Return the wrapper class directly
    } catch (err) {
      logMessage(
        `✗ Failed to load child process wrapper: ${err.message}`,
        "ERROR"
      );
      logMessage(`Error details: ${err.stack}`, "ERROR");
      throw new Error(
        `Failed to load audio processor for Electron ${process.versions.electron}: ${err.message}`
      );
    }
  } else {
    logMessage("Running in Node.js");

    // For Node.js, try to load the Node.js-compiled binary directly
    try {
      logMessage("Attempting to load Node.js native addon...");
      const nodeAddon = require("./build/Release/juce_audio_processor.node");
      logMessage("✓ Node.js native addon loaded successfully");
      return nodeAddon;
    } catch (err) {
      logMessage(
        `✗ Failed to load Node.js native addon: ${err.message}`,
        "ERROR"
      );
      logMessage(`Error details: ${err.stack}`, "ERROR");

      // Fallback to mock implementation for Node.js too
      logMessage("Falling back to mock implementation for Node.js...");
      try {
        const MockProcessor = require("./src/audio-processor-mock");
        logMessage("✓ Mock implementation loaded for Node.js");
        return { JUCEAudioProcessor: MockProcessor };
      } catch (mockErr) {
        logMessage(
          `✗ Failed to load mock implementation: ${mockErr.message}`,
          "ERROR"
        );
        throw new Error(
          `Failed to load native addon for Node.js ${process.version}: ${err.message}`
        );
      }
    }
  }
}

// Load the appropriate implementation
logMessage("Starting native addon loading process...");
const nativeAddon = getBinaryPath();

// Export the JUCEAudioProcessor class
if (process.versions.electron) {
  // For Electron, the wrapper class itself is the constructor
  logMessage("✓ Using child process wrapper for Electron");
  module.exports = nativeAddon; // Export the wrapper class directly
} else {
  // For Node.js, check if we have the JUCEAudioProcessor property
  if (nativeAddon.JUCEAudioProcessor) {
    logMessage("✓ JUCEAudioProcessor class found in native addon");
    module.exports = nativeAddon.JUCEAudioProcessor;
  } else {
    logMessage(
      "✗ JUCEAudioProcessor not found in native addon exports",
      "ERROR"
    );
    logMessage(
      `Available exports: ${Object.keys(nativeAddon).join(", ")}`,
      "ERROR"
    );
    throw new Error("JUCEAudioProcessor not found in native addon exports");
  }
}
