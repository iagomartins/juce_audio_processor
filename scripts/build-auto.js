const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function detectRuntime() {
  // Check if we're in Electron
  if (process.versions.electron) {
    return {
      runtime: 'electron',
      version: process.versions.electron
    };
  }
  
  // Check if we're in Node.js
  if (process.versions.node) {
    return {
      runtime: 'node',
      version: process.versions.node
    };
  }
  
  // Default fallback
  return {
    runtime: 'node',
    version: '18.0.0'
  };
}

function buildForRuntime(runtime, version) {
  console.log(`Building for ${runtime} ${version}...`);
  
  try {
    // First, try to clean any existing build
    const buildDir = path.join(__dirname, '..', 'build');
    if (fs.existsSync(buildDir)) {
      console.log('Cleaning existing build directory...');
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
    
    const command = `cmake-js build --runtime ${runtime} --runtime-version ${version} --verbose`;
    console.log(`Running: ${command}`);
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log(`✓ Successfully built for ${runtime} ${version}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to build for ${runtime} ${version}:`, error.message);
    return false;
  }
}

function main() {
  console.log('Auto-detecting runtime...');
  
  const runtimeInfo = detectRuntime();
  console.log(`Detected: ${runtimeInfo.runtime} ${runtimeInfo.version}`);
  
  // Try to build for the detected runtime
  if (buildForRuntime(runtimeInfo.runtime, runtimeInfo.version)) {
    console.log('✓ Build completed successfully');
    process.exit(0);
  } else {
    console.log('⚠ Build failed, trying fallback...');
    
    // Try different Node.js versions as fallback
    const fallbackVersions = ['18.0.0', '16.0.0', '20.0.0'];
    
    for (const version of fallbackVersions) {
      console.log(`Trying Node.js ${version} fallback...`);
      if (buildForRuntime('node', version)) {
        console.log('✓ Fallback build completed');
        process.exit(0);
      }
    }
    
    console.error('✗ All build attempts failed');
    console.error('Please check:');
    console.error('1. CMake is installed and in PATH');
    console.error('2. Visual Studio Build Tools are installed');
    console.error('3. Node.js version is compatible');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { detectRuntime, buildForRuntime };
