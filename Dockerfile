FROM node:20-bookworm

WORKDIR /app

# Set CI to true to avoid interactive prompts
ENV CI=true
# Ensure browsers are downloaded (0 = don't skip)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
# Set browsers path to 0 as requested in prompt examples (though unusual, following specific instruction)
ENV PLAYWRIGHT_BROWSERS_PATH=0

COPY package.json package-lock.json ./

RUN npm ci

RUN npx playwright install --with-deps chromium firefox webkit

COPY . .

CMD ["./node_modules/.bin/playwright", "test"]
