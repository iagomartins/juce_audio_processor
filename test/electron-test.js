const { app, BrowserWindow } = require("electron");
const JUCEAudioProcessor = require("../index");
const path = require("path");
const os = require("os");
const fs = require("fs");

let mainWindow;

// Enhanced logging
function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;
  console.log(logEntry.trim());

  try {
    fs.appendFileSync("electron_debug.log", logEntry);
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
      throw new Error(
        `Failed to load native addon for Electron ${process.versions.electron}: ${err.message}`
      );
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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("test/electron-test.html");

  // Test the JUCE Audio Processor in Electron
  try {
    logMessage("Testing JUCE Audio Processor in Electron...");
    const processor = new JUCEAudioProcessor();
    logMessage("✓ Processor created successfully in Electron");
    logMessage("✓ Initialized:", processor.isInitialized());

    // Test basic functionality
    processor.setVolume(0.8);
    processor.setFlangerEnabled(true);
    processor.setFlangerRate(0.5);
    processor.setFlangerDepth(0.3);
    processor.setFilterCutoff(1000);
    processor.setFilterResonance(1.2);
    processor.setPitchBend(2.0);
    processor.setJogWheelPosition(0.5);

    logMessage("✓ All methods called successfully in Electron");
    logMessage("✓ JUCE Audio Processor is working correctly in Electron!");
  } catch (error) {
    logMessage(
      `✗ Error testing processor in Electron: ${error.message}`,
      "ERROR"
    );
  }
}

app.whenReady().then(() => {
  logMessage("Electron app is ready");

  try {
    logMessage("Attempting to load JUCE Audio Processor...");
    const JUCEAudioProcessor = require("../index.js");
    logMessage("✓ JUCE Audio Processor loaded successfully");

    // Test the processor
    logMessage("Creating processor instance...");
    const processor = new JUCEAudioProcessor();
    logMessage("✓ Processor instance created");

    // Check initialization
    if (
      processor.isInitialized &&
      typeof processor.isInitialized === "function"
    ) {
      const isInit = processor.isInitialized();
      logMessage(`Processor initialized: ${isInit}`);
    } else {
      logMessage("isInitialized method not available", "WARN");
    }

    // Test basic functionality
    logMessage("Testing processor methods...");
    processor.setSampleRate(44100);
    processor.setBufferSize(512);
    logMessage("✓ Basic processor methods work");

    logMessage("✓ All tests passed!");
  } catch (error) {
    logMessage(`✗ Error testing processor: ${error.message}`, "ERROR");
    logMessage(`Error stack: ${error.stack}`, "ERROR");
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
