# JUCE Audio Processor

A high-performance native audio processor built with JUCE for Electron applications, specifically designed for DJ software.

## Features

- **Real-time Audio Processing**: Built on JUCE's industry-standard audio processing framework
- **DJ Effects**: Includes flanger, filter, pitch shifting, and volume control
- **Electron Compatible**: Designed specifically for Electron applications
- **Cross-platform**: Supports Windows, macOS, and Linux
- **High Performance**: Native C++ implementation for low-latency audio processing

## Installation

```bash
npm install juce-audio-processor
```

## Usage

```javascript
const JUCEAudioProcessor = require('juce-audio-processor');

// Create a new processor instance
const processor = new JUCEAudioProcessor();

// Configure effects
processor.setVolume(0.8);                    // Set volume (0.0 to 1.0)
processor.setFlangerEnabled(true);           // Enable/disable flanger
processor.setFlangerRate(0.5);               // Set flanger rate (0.0 to 1.0)
processor.setFlangerDepth(0.3);              // Set flanger depth (0.0 to 1.0)
processor.setFilterCutoff(1000);             // Set filter cutoff frequency (Hz)
processor.setFilterResonance(1.2);           // Set filter resonance (0.0 to 2.0)
processor.setPitchBend(2.0);                 // Set pitch bend in semitones
processor.setJogWheelPosition(0.5);          // Set jog wheel position (0.0 to 1.0)

// Process audio (placeholder - actual implementation depends on your audio system)
processor.processAudio(audioBuffer);
```

## API Reference

### Constructor
- `new JUCEAudioProcessor()` - Creates a new audio processor instance

### Methods

#### Volume Control
- `setVolume(volume)` - Set master volume (0.0 to 1.0)

#### Flanger Effect
- `setFlangerEnabled(enabled)` - Enable or disable flanger effect
- `setFlangerRate(rate)` - Set flanger rate (0.0 to 1.0)
- `setFlangerDepth(depth)` - Set flanger depth (0.0 to 1.0)

#### Filter
- `setFilterCutoff(cutoff)` - Set low-pass filter cutoff frequency in Hz
- `setFilterResonance(resonance)` - Set filter resonance (0.0 to 2.0)

#### Pitch Control
- `setPitchBend(semitones)` - Set pitch bend in semitones

#### Jog Wheel
- `setJogWheelPosition(position)` - Set jog wheel position (0.0 to 1.0)

#### Audio Processing
- `processAudio(buffer)` - Process audio buffer (implementation depends on your audio system)

## Requirements

- Node.js 14.0.0 or higher
- Electron 20.0.0 or higher
- CMake 3.15 or higher
- C++17 compatible compiler

## Building from Source

```bash
git clone https://github.com/yourusername/juce-audio-processor.git
cd juce-audio-processor
npm install
npm run build
```

## License

MIT License - see LICENSE.md for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
