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

    // For Electron, try to load the Electron-compiled binary
    try {
      logMessage("Attempting to load Electron native addon...");
      const electronAddon = require("./build/Release/juce_audio_processor.node");
      logMessage("✓ Electron native addon loaded successfully");
      return electronAddon;
    } catch (err) {
      logMessage(
        `✗ Failed to load Electron native addon: ${err.message}`,
        "ERROR"
      );
      logMessage(`Error details: ${err.stack}`, "ERROR");

      // Fallback: try to rebuild for Electron
      logMessage("Attempting to rebuild for Electron...");
      try {
        const { execSync } = require("child_process");
        execSync("npm run build:electron", { stdio: "inherit" });
        const electronAddon = require("./build/Release/juce_audio_processor.node");
        logMessage("✓ Electron native addon rebuilt and loaded successfully");
        return electronAddon;
      } catch (rebuildErr) {
        logMessage(
          `✗ Failed to rebuild for Electron: ${rebuildErr.message}`,
          "ERROR"
        );
        throw new Error(
          `Failed to load native addon for Electron ${process.versions.electron}: ${err.message}`
        );
      }
    }
  } else {
    logMessage("Running in Node.js");

    // For Node.js, try to load the Node.js-compiled binary
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
      throw new Error(
        `Failed to load native addon for Node.js ${process.version}: ${err.message}`
      );
    }
  }
}

// Load the native addon
logMessage("Starting native addon loading process...");
const nativeAddon = getBinaryPath();

// Export the JUCEAudioProcessor class
if (nativeAddon.JUCEAudioProcessor) {
  logMessage("✓ JUCEAudioProcessor class found in native addon");
  module.exports = nativeAddon.JUCEAudioProcessor;
} else {
  logMessage("✗ JUCEAudioProcessor not found in native addon exports", "ERROR");
  logMessage(
    `Available exports: ${Object.keys(nativeAddon).join(", ")}`,
    "ERROR"
  );
  throw new Error("JUCEAudioProcessor not found in native addon exports");
}
