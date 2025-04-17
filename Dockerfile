# Stage 1: Development & Build Environment
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Expose default port (may be overridden in docker-compose.yml)
EXPOSE 3000

# Set environment variable to development by default
ENV NODE_ENV=development

# Start development server with hot reloading
CMD ["npm", "run", "dev"]

# Stage 2: Build Stage
FROM development AS build

# Set environment to production for build
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 3: Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Set environment variable to production
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]

