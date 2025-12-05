FROM node:20-bookworm

WORKDIR /app

# Set CI to 1 to avoid interactive prompts
ENV CI=1
# Ensure browsers are downloaded (0 = don't skip)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
# Set browsers path to 0 as requested (though unusual, following specific instruction)
ENV PLAYWRIGHT_BROWSERS_PATH=0

COPY package.json package-lock.json ./

RUN npm ci

# Install browsers with dependencies using npx as requested, relies on package.json version
RUN ./node_modules/.bin/playwright install --with-deps chromium firefox webkit

COPY . .

# Use local binary to avoid npx prompt
CMD ["./node_modules/.bin/playwright", "test"]
