# syntax=docker/dockerfile:1

# Use official Playwright image with browsers
FROM mcr.microsoft.com/playwright:v1.48.2-jammy

# Use a portable working directory inside the image
WORKDIR /app

# Copy only package.json first for better layer caching
COPY package.json ./

# Install dependencies (CI-friendly)
RUN npm ci --no-audit --no-fund

# Copy the rest of the test suite files
COPY . .

# Default command prints working directory and runs tests (can be overridden)
CMD ["/bin/bash", "-lc", "echo \"PWD: $(pwd)\" && ls -la && npm test"]
