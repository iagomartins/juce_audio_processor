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
- **Version Agnostic**: Works with any Node.js (14+) or Electron (37+) version

## ⚠️ Prerequisites

**Before installing this package, you MUST install the following software:**

### Required Software

#### 1. CMake (Required)

- **Download**: [https://cmake.org/download/](https://cmake.org/download/)
- **Version**: 3.15 or higher
- **Installation**: Add CMake to your system PATH

#### 2. C++ Build Tools (Required)

**Windows:**

- **Visual Studio**: 2019 or 2022 (with C++ build tools)
- **Download**: [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/)
- **Required Components**: C++ CMake tools, Windows 10/11 SDK

**macOS:**

- **Xcode Command Line Tools**: `xcode-select --install`
- **Xcode**: 12.0 or higher (for full development)

**Linux:**

- **GCC**: 7.0 or higher
- **Build Essentials**: `sudo apt-get install build-essential`

#### 3. JUCE Framework (Required)

- **Download**: [https://juce.com/get-juce](https://juce.com/get-juce)
- **Version**: 6.0 or higher
- **Installation**: Extract to `C:\JUCE` (Windows) or `/usr/local/JUCE` (macOS/Linux)

### System Requirements

- **Node.js**: 14.0.0 or higher (any version)
- **Electron**: 37.0.0 or higher (any version)
- **Architecture**: x64 and ARM64 (Apple Silicon)

## 🚀 Installation

### Step 1: Install Prerequisites

Make sure you have installed all the required software above.

### Step 2: Install the Package

**For Node.js Applications:**

```bash
npm install juce-audio-processor
```

**For Electron Applications:**

```bash
npm install juce-audio-processor
# The package will automatically detect Electron and build accordingly
```

### Step 3: Verify Installation

```bash
# Test in Node.js
npm test

# Test in Electron
npm run test:electron
```

## Troubleshooting Installation

### Common Issues

#### 1. "CMake not found" Error

**Solution**: Install CMake and add it to your PATH

- Windows: Restart your terminal after installing CMake
- macOS: `brew install cmake`
- Linux: `sudo apt-get install cmake`

#### 2. "Visual Studio not found" Error (Windows)

**Solution**: Install Visual Studio with C++ build tools

- Download Visual Studio Community
- Select "Desktop development with C++" workload
- Include Windows 10/11 SDK

#### 3. "JUCE not found" Error

**Solution**: Download and install JUCE framework

- Extract to `C:\JUCE` (Windows) or `/usr/local/JUCE` (macOS/Linux)
- Update `CMakeLists.txt` if needed

#### 4. Build Fails During Installation

**Solution**: Check all prerequisites are installed

```bash
# Check CMake
cmake --version

# Check Visual Studio (Windows)
where cl

# Check GCC (macOS/Linux)
gcc --version
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

## ️ Building from Source

### Prerequisites

1. Install [CMake](https://cmake.org/download/)
2. Install [JUCE Framework](https://juce.com/get-juce)
3. Set up your platform-specific build tools

### Build Commands

```bash
# Clean build directory
npm run clean

# Build for Node.js
npm run build:node

# Build for Electron
npm run build:electron

# Build for both runtimes
npm run build

# Auto-detect runtime and build
npm run build:auto

# Rebuild (clean + build)
npm run rebuild
```

### Platform-Specific Build Instructions

#### Windows

```bash
# Ensure Visual Studio is installed
npm run build:electron
```

#### macOS

```bash
# Ensure Xcode command line tools are installed
xcode-select --install
npm run build:electron
```

#### Linux

```bash
# Install build essentials
sudo apt-get update
sudo apt-get install build-essential cmake
npm run build:electron
```

## Testing

### Run Tests

```bash
# Test in Node.js
npm test

# Test in Electron
npm run test:electron

# Run example
npm run example
```

### Debug Logging

The package includes comprehensive debug logging. Check these files:

- `juce_debug.log` - C++ and JavaScript logs
- `electron_debug.log` - Electron-specific logs

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module" Error

**Problem**: Native addon not found
**Solution**:

```bash
npm run clean
npm run build:electron
```

#### 2. "DLL initialization routine failed" Error

**Problem**: Runtime mismatch between Node.js and Electron
**Solution**: Rebuild for the correct runtime

```bash
npm run build:electron
```

#### 3. "napi.h not found" Error

**Problem**: Missing node-addon-api dependency
**Solution**:

```bash
npm install node-addon-api
npm run rebuild
```

#### 4. CMake Not Found

**Problem**: CMake not installed or not in PATH
**Solution**:

- Windows: Install from [cmake.org](https://cmake.org/download/)
- macOS: `brew install cmake`
- Linux: `sudo apt-get install cmake`

#### 5. JUCE Not Found

**Problem**: JUCE framework not installed
**Solution**:

1. Download JUCE from [juce.com](https://juce.com/get-juce)
2. Extract to `C:\JUCE` (Windows) or `/usr/local/JUCE` (macOS/Linux)
3. Update `CMakeLists.txt` if needed

### Debug Mode

Enable verbose logging:

```bash
# Set environment variable
set DEBUG=juce-audio-processor:*

# Run with debug output
npm run test:electron
```

## 📁 Project Structure

```
juce-audio-processor/
├── src/
│   ├── binding.cpp              # N-API bindings
│   ├── juce_audio_processor.h   # JUCE processor header
│   ├── juce_audio_processor.cpp # JUCE processor implementation
│   ├── audio-processor-mock.js  # Mock implementation
│   ├── audio-processor-child.js # Child process for Electron
│   └── audio-processor-wrapper.js # IPC wrapper
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
| 1.0.15+         | 14.0.0+ | 37.0.0+  | 6.0+ | 3.15+ |

**Note**: This package is designed to work with any Node.js version 14+ and any Electron version 37+. The build system automatically detects and builds for the correct runtime version.

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
