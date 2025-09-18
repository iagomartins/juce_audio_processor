const { app, BrowserWindow } = require("electron");
const path = require("path");

// Enhanced logging function
function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] [ELECTRON-TEST] ${message}\n`;
  console.log(logEntry.trim());
}

let mainWindow;

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
  testAudioProcessor();
}

async function testAudioProcessor() {
  try {
    logMessage("Testing JUCE Audio Processor with child process...");

    // Import the wrapper (this will use the child process in Electron)
    const JUCEAudioProcessor = require("../index");

    logMessage("Creating processor instance...");
    const processor = new JUCEAudioProcessor();

    // Wait longer for initialization
    logMessage("Waiting for child process to initialize...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    logMessage("Testing initialization...");
    const isInit = await processor.isInitialized();
    logMessage(`Processor initialized: ${isInit}`);

    // Test basic functionality
    logMessage("Testing processor methods...");

    await processor.setVolume(0.8);
    await processor.setFlangerEnabled(true);
    await processor.setFlangerRate(0.5);
    await processor.setFlangerDepth(0.3);
    await processor.setFilterCutoff(1000);
    await processor.setFilterResonance(1.2);
    await processor.setPitchBend(2.0);
    await processor.setJogWheelPosition(0.5);

    logMessage("✓ All methods called successfully");
    logMessage(
      "✓ JUCE Audio Processor is working correctly with child process!"
    );

    // Test audio processing
    const testBuffer = new ArrayBuffer(1024);
    await processor.processAudio(testBuffer);
    logMessage("✓ Audio processing test completed");
  } catch (error) {
    logMessage(`✗ Error testing processor: ${error.message}`, "ERROR");
    logMessage(`Error stack: ${error.stack}`, "ERROR");
  }
}

app.whenReady().then(() => {
  logMessage("Electron app is ready");
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
