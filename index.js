const path = require('path');
const os = require('os');

// Determine the correct binary path based on platform and architecture
function getBinaryPath() {
  const platform = os.platform();
  const arch = os.arch();
  
  // For Electron, we need to handle the specific runtime
  if (process.versions.electron) {
    const electronVersion = process.versions.electron;
    const electronArch = arch === 'x64' ? 'x64' : arch;
    
    // Try to load the pre-built binary for the specific Electron version
    try {
      return require(`./build/Release/juce_audio_processor.node`);
    } catch (err) {
      // Fallback to building from source
      console.warn('Pre-built binary not found, building from source...');
      return require('./build/Release/juce_audio_processor.node');
    }
  }
  
  // For regular Node.js
  return require('./build/Release/juce_audio_processor.node');
}

// Export the native addon
module.exports = getBinaryPath();