// Child process that loads the native addon or falls back to mock
const path = require("path");
const fs = require("fs");

// Enhanced logging function
function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] [CHILD] ${message}\n`;

  // Log to console
  console.log(logEntry.trim());

  // Log to file
  try {
    fs.appendFileSync("juce_debug.log", logEntry);
  } catch (err) {
    console.error("Failed to write to log file:", err.message);
  }
}

let JUCEAudioProcessor;

// Skip native addon loading entirely in child process for now
// This avoids the crashpad issues
logMessage(
  "Skipping native addon loading in child process to avoid crashes..."
);
logMessage("Using mock implementation directly...");

try {
  // Go straight to mock implementation
  JUCEAudioProcessor = require("./audio-processor-mock");
  logMessage("✓ Mock implementation loaded in child process");
} catch (mockError) {
  logMessage(
    `✗ Failed to load mock implementation: ${mockError.message}`,
    "ERROR"
  );
  process.exit(1);
}

// Handle IPC messages from parent process
process.on("message", (msg) => {
  try {
    if (msg.type === "create") {
      logMessage("Creating processor instance...");
      const processor = new JUCEAudioProcessor();

      // Store processor instance
      process.processor = processor;

      process.send({
        type: "created",
        success: true,
        initialized: processor.isInitialized(),
      });
    } else if (msg.type === "method") {
      const { method, args } = msg;

      if (!process.processor) {
        throw new Error("Processor not created yet");
      }

      logMessage(`Calling method: ${method} with args:`, args);

      let result;
      if (args && args.length > 0) {
        result = process.processor[method](...args);
      } else {
        result = process.processor[method]();
      }

      process.send({
        type: "method_result",
        method: method,
        result: result,
        success: true,
      });
    } else if (msg.type === "ping") {
      process.send({ type: "pong" });
    }
  } catch (error) {
    logMessage(`Error handling message: ${error.message}`, "ERROR");
    process.send({
      type: "error",
      error: error.message,
      success: false,
    });
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logMessage(`Uncaught exception: ${error.message}`, "ERROR");
  logMessage(`Stack: ${error.stack}`, "ERROR");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logMessage(`Unhandled rejection: ${reason}`, "ERROR");
  process.exit(1);
});

// Send ready signal
process.send({ type: "ready" });
logMessage("Child process ready");
