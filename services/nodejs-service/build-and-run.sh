#!/bin/bash

echo "Building and running Datifyy Backend with Docker..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build TypeScript first
echo -e "${GREEN}Building TypeScript...${NC}"
yarn build
if [ $? -ne 0 ]; then
    echo -e "${RED}TypeScript build failed${NC}"
    exit 1
fi

# Create a temporary Dockerfile without needing yarn.lock
cat > Dockerfile.temp << 'EOF'
FROM node:20-alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install production dependencies using npm
ENV NODE_ENV=production
RUN npm install --production

# Copy built application
COPY dist ./dist
COPY src/methods ./src/methods

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
EOF

# Build Docker image
echo -e "${GREEN}Building Docker image...${NC}"
docker build -f Dockerfile.temp -t datifyy-backend:local . --no-cache

# Clean up
rm Dockerfile.temp

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
    echo ""
    echo "To run the container:"
    echo "  docker run -d -p 5000:5000 --name datifyy-backend datifyy-backend:local"
    echo ""
    echo "To run with environment variables:"
    echo "  docker run -d -p 5000:5000 --name datifyy-backend \\"
    echo "    -e NODE_ENV=production \\"
    echo "    -e JWT_SECRET=your_secret \\"
    echo "    -e DATABASE_URL=your_db_url \\"
    echo "    datifyy-backend:local"
else
    echo -e "${RED}Docker build failed${NC}"
    exit 1
fi