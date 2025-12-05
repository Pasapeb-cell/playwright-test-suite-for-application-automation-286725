#!/usr/bin/env sh
# PUBLIC_INTERFACE
# build_and_run.sh
# Purpose: Build and run the Playwright test suite container without path concatenation.
# Usage:
#   ./scripts/build_and_run.sh
#   E2E_BASE_URL="http://localhost:3000" ./scripts/build_and_run.sh
#
# Notes:
# - The Dockerfile WORKDIR is:
#     /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725
#   Do not append the project folder name twice when running inside the container.

set -eu

IMAGE_NAME="kanban-playwright-tests"
BUILD_CONTEXT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

echo "Building Docker image '${IMAGE_NAME}' from context: ${BUILD_CONTEXT_DIR}"
docker build -t "${IMAGE_NAME}" "${BUILD_CONTEXT_DIR}"

echo "Running tests in container..."
docker run --rm \
  -e E2E_BASE_URL="${E2E_BASE_URL:-http://localhost:3000}" \
  "${IMAGE_NAME}"
