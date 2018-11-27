#!/usr/bin/env node --harmony
/* global process */

const { spawn } = require('child_process');
const path = require('path');

spawn(
  'electron',
  [path.resolve(__dirname, 'lib/main.prod.js')],
  {
    shell: true,
    stdio: 'inherit',
  },
)
  .on('close', code => process.exit(code))
  .on('error', spawnError => console.error(spawnError));
