FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy remaining project files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]