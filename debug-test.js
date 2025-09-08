const path = require('path');

console.log('Testing native addon loading...');

try {
  // Try to load the native addon directly
  const addon = require('./build/Release/juce_audio_processor.node');
  console.log('✓ Native addon loaded successfully');
  console.log('Available exports:', Object.keys(addon));
  
  // Check if JUCEAudioProcessor is available
  if (addon.JUCEAudioProcessor) {
    console.log('✓ JUCEAudioProcessor found');
    console.log('JUCEAudioProcessor type:', typeof addon.JUCEAudioProcessor);
    
    // Try to create an instance
    try {
      const processor = new addon.JUCEAudioProcessor();
      console.log('✓ Processor created successfully');
    } catch (err) {
      console.error('✗ Error creating processor:', err.message);
    }
  } else {
    console.error('✗ JUCEAudioProcessor not found in exports');
  }
  
} catch (error) {
  console.error('✗ Error loading native addon:', error.message);
  console.error('Stack trace:', error.stack);
}
