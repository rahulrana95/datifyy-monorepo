# Use Node.js LTS version
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files from root (for workspaces)
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./

# Copy workspace package files
COPY apps/frontend/package.json ./apps/frontend/
COPY services/nodejs-service/package.json ./services/nodejs-service/
COPY libs/shared-constants/package.json ./libs/shared-constants/

# Install dependencies using Yarn workspaces
RUN yarn install --immutable

# Copy source code
COPY apps/frontend ./apps/frontend
COPY services/nodejs-service ./services/nodejs-service
COPY libs/shared-constants ./libs/shared-constants

# Build the backend service
WORKDIR /app/services/nodejs-service
RUN yarn build

# Production stage
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/services/nodejs-service/package.json ./services/nodejs-service/
COPY --from=builder /app/libs/shared-constants/package.json ./libs/shared-constants/

# Install production dependencies only
ENV NODE_ENV production
RUN yarn workspaces focus nodejs-service --production

# Copy built application
COPY --from=builder /app/services/nodejs-service/dist ./services/nodejs-service/dist
COPY --from=builder /app/libs/shared-constants ./libs/shared-constants

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Set working directory to backend service
WORKDIR /app/services/nodejs-service

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]