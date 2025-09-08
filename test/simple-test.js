console.log('Simple test starting...');

try {
  const addon = require('../build/Release/juce_audio_processor.node');
  console.log('Addon loaded:', typeof addon);
  console.log('Addon keys:', Object.keys(addon));
  
  if (addon.JUCEAudioProcessor) {
    console.log('JUCEAudioProcessor found:', typeof addon.JUCEAudioProcessor);
    const processor = new addon.JUCEAudioProcessor();
    console.log('Processor created:', typeof processor);
  } else {
    console.log('JUCEAudioProcessor not found');
  }
} catch (error) {
  console.error('Error:', error.message);
}
