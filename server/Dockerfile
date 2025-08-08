# Building layer
FROM node:20-alpine as development

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Authenticate NPM registry

# Install dependencies from package-lock.json
RUN npm ci

# Copy application sources (.ts, .tsx, .js) and .hbs files
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:20-alpine as production

ENV NODE_ENV production

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Authenticate NPM registry

# Install runtime dependencies (without dev/test dependencies)
RUN npm ci --omit=dev

# Copy production build and .hbs files from development stage
COPY --from=development /app/dist/ ./dist/
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
# Expose application port
EXPOSE 3000

# Start application
CMD ["./docker-entrypoint.sh"]