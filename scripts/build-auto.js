const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] [BUILD] ${message}\n`;
  console.log(logEntry.trim());
}

function detectRuntime() {
  // Check if we're in Electron
  if (process.versions.electron) {
    return {
      runtime: "electron",
      version: process.versions.electron,
    };
  }

  // Check if we're in Node.js
  if (process.versions.node) {
    return {
      runtime: "node",
      version: process.versions.node,
    };
  }

  // Default fallback
  return {
    runtime: "node",
    version: "18.0.0",
  };
}

function buildForRuntime(runtime, version) {
  logMessage(`Building for ${runtime} ${version}...`);

  try {
    // First, try to clean any existing build
    const buildDir = path.join(__dirname, "..", "build");
    if (fs.existsSync(buildDir)) {
      logMessage("Cleaning existing build directory...");
      fs.rmSync(buildDir, { recursive: true, force: true });
    }

    const command = `cmake-js build --runtime ${runtime} --runtime-version ${version} --verbose`;
    logMessage(`Running: ${command}`);

    execSync(command, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });

    logMessage(`✓ Successfully built for ${runtime} ${version}`);
    return true;
  } catch (error) {
    logMessage(
      `✗ Failed to build for ${runtime} ${version}: ${error.message}`,
      "ERROR"
    );
    return false;
  }
}

function main() {
  logMessage("Auto-detecting runtime...");

  const runtimeInfo = detectRuntime();
  logMessage(`Detected: ${runtimeInfo.runtime} ${runtimeInfo.version}`);

  // Try to build for the detected runtime
  if (buildForRuntime(runtimeInfo.runtime, runtimeInfo.version)) {
    logMessage("✓ Build completed successfully");
    process.exit(0);
  } else {
    logMessage("⚠ Build failed, trying fallback versions...", "WARN");

    // Try different versions as fallback
    const fallbackVersions = {
      electron: ["38.1.0", "37.4.0", "37.3.1", "37.0.0", "36.0.0"],
      node: ["20.0.0", "18.0.0", "16.0.0", "14.0.0"],
    };

    const versions =
      fallbackVersions[runtimeInfo.runtime] || fallbackVersions.node;

    for (const version of versions) {
      logMessage(`Trying ${runtimeInfo.runtime} ${version} fallback...`);
      if (buildForRuntime(runtimeInfo.runtime, version)) {
        logMessage("✓ Fallback build completed");
        process.exit(0);
      }
    }

    // If all fallbacks fail, try the other runtime
    const otherRuntime =
      runtimeInfo.runtime === "electron" ? "node" : "electron";
    logMessage(`Trying ${otherRuntime} as last resort...`);

    const otherVersions = fallbackVersions[otherRuntime];
    for (const version of otherVersions) {
      logMessage(`Trying ${otherRuntime} ${version}...`);
      if (buildForRuntime(otherRuntime, version)) {
        logMessage("✓ Alternative runtime build completed");
        process.exit(0);
      }
    }

    logMessage("✗ All build attempts failed", "ERROR");
    logMessage("Please check:", "ERROR");
    logMessage("1. CMake is installed and in PATH", "ERROR");
    logMessage("2. Visual Studio Build Tools are installed (Windows)", "ERROR");
    logMessage("3. Xcode Command Line Tools are installed (macOS)", "ERROR");
    logMessage("4. Build essentials are installed (Linux)", "ERROR");
    logMessage("5. JUCE framework is installed", "ERROR");
    logMessage("6. Node.js version is compatible", "ERROR");
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { detectRuntime, buildForRuntime };
