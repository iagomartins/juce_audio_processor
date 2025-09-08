const JUCEAudioProcessor = require('../index');

console.log('JUCE Audio Processor Node.js Example');
console.log('=====================================');

try {
  // Create a new processor instance
  const processor = new JUCEAudioProcessor();
  console.log('✓ Processor created successfully');

  // Configure some default settings
  processor.setVolume(0.8);
  processor.setFlangerEnabled(false);
  processor.setFilterCutoff(1000);
  processor.setFilterResonance(1.0);
  processor.setPitchBend(0.0);
  processor.setJogWheelPosition(0.5);

  console.log('✓ Default settings applied');

  // Demonstrate different effects
  console.log('\n--- Testing Audio Effects ---');
  
  // Test volume control
  console.log('Setting volume to 0.5...');
  processor.setVolume(0.5);
  
  // Test flanger
  console.log('Enabling flanger...');
  processor.setFlangerEnabled(true);
  processor.setFlangerRate(0.3);
  processor.setFlangerDepth(0.4);
  
  // Test filter
  console.log('Setting filter cutoff to 2000 Hz...');
  processor.setFilterCutoff(2000);
  processor.setFilterResonance(1.5);
  
  // Test pitch bend
  console.log('Setting pitch bend to +2 semitones...');
  processor.setPitchBend(2.0);
  
  // Test jog wheel
  console.log('Setting jog wheel position to 0.8...');
  processor.setJogWheelPosition(0.8);

  console.log('\n✓ All effects configured successfully!');
  console.log('\nThis is a basic demonstration of the JUCE Audio Processor.');
  console.log('In a real application, you would:');
  console.log('- Connect to audio input/output devices');
  console.log('- Process real audio buffers');
  console.log('- Handle real-time audio processing');
  console.log('- Integrate with your audio framework');

} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
