#!/usr/bin/env sh
# PUBLIC_INTERFACE
# run_playwright_local.sh
# Purpose: Run Playwright tests locally (without Docker) to avoid path duplication issues and
# verify the suite against a given external URL.
# Usage:
#   ./scripts/run_playwright_local.sh
#   E2E_BASE_URL="https://kanban-board-3.kavia.app/" ./scripts/run_playwright_local.sh
# Notes:
# - Requires Node.js >= 18
# - Will install dependencies if node_modules is missing.

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Install deps if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

export E2E_BASE_URL="${E2E_BASE_URL:-http://localhost:3000}"
echo "Running Playwright tests against: ${E2E_BASE_URL}"

# Execute tests
npx playwright test
