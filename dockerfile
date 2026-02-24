FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Copy remaining project files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]