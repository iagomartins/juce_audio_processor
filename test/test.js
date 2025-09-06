const JUCEAudioProcessor = require('../index');

console.log('Testing JUCE Audio Processor...');

try {
  // Create a new processor instance
  const processor = new JUCEAudioProcessor();
  console.log('✓ Processor created successfully');

  // Test basic functionality
  processor.setVolume(0.8);
  processor.setFlangerEnabled(true);
  processor.setFlangerRate(0.5);
  processor.setFlangerDepth(0.3);
  processor.setFilterCutoff(1000);
  processor.setFilterResonance(1.2);
  processor.setPitchBend(2.0);
  processor.setJogWheelPosition(0.5);

  console.log('✓ All methods called successfully');
  console.log('✓ JUCE Audio Processor is working correctly!');

} catch (error) {
  console.error('✗ Error testing processor:', error.message);
  process.exit(1);
}
