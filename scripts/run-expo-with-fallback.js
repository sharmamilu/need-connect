#!/usr/bin/env node

const { spawn } = require('child_process');

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function startExpo(args, mode) {
  console.log(`\nStarting Expo in ${mode} mode...`);

  const child = spawn(npxCommand, ['expo', 'start', ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
    shell: true,
  });

  child.on('error', (error) => {
    console.error(`Failed to start Expo in ${mode} mode:`, error.message);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (code === 0) {
      process.exit(0);
    }

    if (signal) {
      console.error(`Expo ${mode} mode stopped with signal ${signal}.`);
      process.exit(1);
    }

    console.error(`Expo ${mode} mode exited with code ${code}.`);
  });
}

function runWithFallback() {
  const tunnelArgs = ['--tunnel', '--clear'];
  const fallbackArgs = ['--lan', '--clear'];

  const tunnelProcess = spawn(npxCommand, ['expo', 'start', ...tunnelArgs], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
    shell: true,
  });

  tunnelProcess.on('error', (error) => {
    console.error('Expo tunnel startup failed:', error.message);
    console.warn('Falling back to LAN mode so the app can still be launched.');
    startExpo(fallbackArgs, 'LAN');
  });

  tunnelProcess.on('exit', (code, signal) => {
    if (code === 0) {
      process.exit(0);
    }

    if (signal) {
      console.warn(`Expo tunnel stopped with signal ${signal}; falling back to LAN mode.`);
    } else {
      console.warn(`Expo tunnel exited with code ${code}; falling back to LAN mode.`);
    }

    startExpo(fallbackArgs, 'LAN');
  });
}

runWithFallback();
