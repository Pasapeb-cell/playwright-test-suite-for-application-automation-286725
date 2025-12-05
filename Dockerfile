# syntax=docker/dockerfile:1

# Use Node 18 LTS for Playwright
FROM mcr.microsoft.com/playwright:v1.48.2-jammy

# Set correct working directory (single-level path)
WORKDIR /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725

# Copy only package.json first for caching, then the rest
COPY package.json ./

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy the rest of the test suite files
COPY . .

# Default command prints working directory and runs tests (can be overridden)
CMD ["/bin/bash", "-lc", "echo \"PWD: $(pwd)\" && ls -la && npm test"]
