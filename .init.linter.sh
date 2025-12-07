#!/usr/bin/env bash
set -euo pipefail

cd /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725

if [ ! -d node_modules ]; then
  npm ci --no-audit --no-fund || npm install --no-audit --no-fund
fi

npm run lint
