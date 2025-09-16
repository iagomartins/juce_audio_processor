# JUCE Audio Processor

A high-performance native audio processor built with JUCE for Node.js and Electron applications, specifically designed for DJ software and real-time audio processing.

[![npm version](https://badge.fury.io/js/juce-audio-processor.svg)](https://badge.fury.io/js/juce-audio-processor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/iagomartins/juce-audio-processor)

## 🎵 Features

- **Real-time Audio Processing**: Built on JUCE's industry-standard audio processing framework
- **DJ Effects**: Includes flanger, filter, pitch shifting, and volume control
- **Dual Runtime Support**: Works with both Node.js and Electron applications
- **Cross-platform**: Supports Windows, macOS, and Linux
- **High Performance**: Native C++ implementation for low-latency audio processing
- **Lazy Initialization**: Safe initialization for Electron environments
- **Comprehensive Logging**: Built-in debug logging for troubleshooting

## 📋 Requirements

### System Requirements

- **Node.js**: 14.0.0 or higher
- **CMake**: 3.15 or higher
- **C++ Compiler**: C++17 compatible compiler
- **JUCE Framework**: Version 6.0 or higher

### Platform-Specific Requirements

#### Windows

- **Visual Studio**: 2019 or 2022 (with C++ build tools)
- **Windows SDK**: 10.0 or higher
- **Architecture**: x64 (ARM64 support available)

#### macOS

- **Xcode**: 12.0 or higher
- **macOS**: 10.15 or higher
- **Architecture**: x64 and ARM64 (Apple Silicon)

#### Linux

- **GCC**: 7.0 or higher
- **CMake**: 3.15 or higher
- **Architecture**: x64 and ARM64

## 🚀 Installation

### For Node.js Applications

```bash
npm install juce-audio-processor
```

### For Electron Applications

```bash
npm install juce-audio-processor
# The package will automatically detect Electron and build accordingly
```

### Development Installation

```bash
git clone https://github.com/iagomartins/juce-audio-processor.git
cd juce-audio-processor
npm install
npm run build
```

## 📖 Usage

### Basic Usage

```javascript
const JUCEAudioProcessor = require("juce-audio-processor");

// Create a new processor instance
const processor = new JUCEAudioProcessor();

// Check if processor is initialized
if (processor.isInitialized()) {
  console.log("Processor is ready!");
}

// Configure effects
processor.setVolume(0.8); // Set volume (0.0 to 1.0)
processor.setFlangerEnabled(true); // Enable/disable flanger
processor.setFlangerRate(0.5); // Set flanger rate (0.0 to 1.0)
processor.setFlangerDepth(0.3); // Set flanger depth (0.0 to 1.0)
processor.setFilterCutoff(1000); // Set filter cutoff frequency (Hz)
processor.setFilterResonance(1.2); // Set filter resonance (0.0 to 2.0)
processor.setPitchBend(2.0); // Set pitch bend in semitones
processor.setJogWheelPosition(0.5); // Set jog wheel position (0.0 to 1.0)

// Process audio
processor.processAudio(audioBuffer);
```

### Electron Integration

```javascript
const { app, BrowserWindow } = require("electron");
const JUCEAudioProcessor = require("juce-audio-processor");

app.whenReady().then(() => {
  try {
    const processor = new JUCEAudioProcessor();

    if (processor.isInitialized()) {
      console.log("Audio processor ready in Electron!");
      // Configure your audio processing here
    }
  } catch (error) {
    console.error("Failed to initialize audio processor:", error);
  }
});
```

## 🔧 API Reference

### Constructor

- `new JUCEAudioProcessor()` - Creates a new audio processor instance

### Initialization

- `isInitialized()` - Returns `true` if the processor is ready to use

### Volume Control

- `setVolume(volume)` - Set master volume (0.0 to 1.0)

### Flanger Effect

- `setFlangerEnabled(enabled)` - Enable or disable flanger effect (boolean)
- `setFlangerRate(rate)` - Set flanger rate (0.0 to 1.0)
- `setFlangerDepth(depth)` - Set flanger depth (0.0 to 1.0)

### Filter

- `setFilterCutoff(cutoff)` - Set low-pass filter cutoff frequency in Hz
- `setFilterResonance(resonance)` - Set filter resonance (0.0 to 2.0)

### Pitch Control

- `setPitchBend(semitones)` - Set pitch bend in semitones

### Jog Wheel

- `setJogWheelPosition(position)` - Set jog wheel position (0.0 to 1.0)

### Audio Processing

- `processAudio(buffer)` - Process audio buffer (implementation depends on your audio system)

## �� Project Structure

```
juce-audio-processor/
├── src/
│   ├── binding.cpp              # N-API bindings
│   ├── juce_audio_processor.h   # JUCE processor header
│   └── juce_audio_processor.cpp # JUCE processor implementation
├── test/
│   ├── test.js                  # Node.js tests
│   ├── electron-test.js         # Electron tests
│   └── electron-test.html       # Electron test UI
├── scripts/
│   └── build-auto.js            # Auto-build script
├── build/                       # Build output directory
├── CMakeLists.txt              # CMake configuration
├── package.json                # NPM package configuration
├── index.js                    # Main entry point
└── README.md                   # This file
```

## 🔄 Version Compatibility

| Package Version | Node.js | Electron | JUCE | CMake |
| --------------- | ------- | -------- | ---- | ----- |
| 1.0.14+         | 14.0.0+ | 37.0.0+  | 6.0+ | 3.15+ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/iagomartins/juce-audio-processor.git
cd juce-audio-processor
npm install
npm run build
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [JUCE Framework](https://juce.com/) for the audio processing foundation
- [Node.js N-API](https://nodejs.org/api/n-api.html) for native addon support
- [CMake.js](https://github.com/cmake-js/cmake-js) for cross-platform building

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/iagomartins/juce-audio-processor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/iagomartins/juce-audio-processor/discussions)
- **Email**: iagomartinsgamedesign@gmail.com

## 🔗 Links

- **Homepage**: [https://github.com/iagomartins/juce-audio-processor](https://github.com/iagomartins/juce-audio-processor)
- **NPM Package**: [https://www.npmjs.com/package/juce-audio-processor](https://www.npmjs.com/package/juce-audio-processor)
- **Documentation**: [https://github.com/iagomartins/juce-audio-processor#readme](https://github.com/iagomartins/juce-audio-processor#readme)

---

Made with ❤️ for the audio development community
