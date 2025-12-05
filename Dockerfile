# syntax=docker/dockerfile:1.5

# Use official Node LTS (>=18 as required by package.json engines)
FROM mcr.microsoft.com/playwright:v1.46.1-jammy

# Ensure non-root home path aligns with expected workspace structure
# and set working directory to the correct repository root (no duplication)
WORKDIR /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725

# Copy only package manifests first to leverage Docker layer caching
COPY package.json ./
# Copy lockfile if present
# Note: Build will continue if no lockfile is provided
COPY package-lock.json* ./

# Install dependencies.
# Prefer deterministic install if lockfile exists, fallback to npm install.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the repository files
COPY . .

# Environment variables for Playwright baseURL discovery can be set at runtime:
#   - E2E_BASE_URL
#   - REACT_APP_FRONTEND_URL
# Playwright browsers are installed via postinstall already.

# Default command: run Playwright tests in headless mode.
# This can be overridden by passing a different command (e.g., "npm run test:ui")
CMD ["npm", "test"]
