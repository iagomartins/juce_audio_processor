const path = require('path');
const os = require('os');

// Determine the correct binary path based on platform and architecture
function getBinaryPath() {
  const platform = os.platform();
  const arch = os.arch();
  
  console.log('Platform:', platform, 'Architecture:', arch);
  console.log('Node version:', process.version);
  if (process.versions.electron) {
    console.log('Electron version:', process.versions.electron);
  }
  
  // Try to load the pre-built binary
  try {
    const addonPath = path.join(__dirname, 'build', 'Release', 'juce_audio_processor.node');
    console.log('Trying to load:', addonPath);
    
    const addon = require(addonPath);
    console.log('✓ Native addon loaded successfully');
    console.log('Available exports:', Object.keys(addon));
    
    return addon;
  } catch (err) {
    console.error('✗ Failed to load native addon:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Check if the file exists
    const fs = require('fs');
    const addonPath = path.join(__dirname, 'build', 'Release', 'juce_audio_processor.node');
    if (!fs.existsSync(addonPath)) {
      throw new Error(`Native addon file not found at ${addonPath}. Please run 'npm run build' first.`);
    } else {
      throw new Error(`Failed to load native addon: ${err.message}. This usually means the addon was built for a different Node.js/Electron version. Try running 'npm run rebuild'.`);
    }
  }
}

// Load the native addon
const nativeAddon = getBinaryPath();

// Export the JUCEAudioProcessor class
if (nativeAddon.JUCEAudioProcessor) {
  module.exports = nativeAddon.JUCEAudioProcessor;
} else {
  console.error('Available exports:', Object.keys(nativeAddon));
  throw new Error('JUCEAudioProcessor not found in native addon exports');
}