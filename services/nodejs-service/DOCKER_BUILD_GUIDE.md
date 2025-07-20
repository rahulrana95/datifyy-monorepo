# Docker Build Guide for Datifyy Backend

## Prerequisites
- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)
- At least 4GB of free disk space

## Building the Backend Service

### Option 1: Build with Docker Compose (Recommended)
This will build the backend along with PostgreSQL and Redis:

```bash
# Navigate to the backend service directory
cd services/nodejs-service

# Build all services
docker-compose build

# Or build only the backend
docker-compose build backend
```

### Option 2: Build Standalone Docker Image
If you want to build just the backend image:

```bash
# Navigate to the backend service directory
cd services/nodejs-service

# Build the image
docker build -f Dockerfile.standalone -t datifyy-backend:local .

# For production build with specific tag
docker build -f Dockerfile.standalone -t datifyy-backend:v1.0.0 .
```

### Option 3: Build from Monorepo Root
If you need to include shared libraries:

```bash
# Navigate to monorepo root
cd ../..

# Build using the monorepo Dockerfile
docker build -f services/nodejs-service/Dockerfile -t datifyy-backend:monorepo .
```

## Running the Services

### Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Run Standalone Container
```bash
# Run the backend container
docker run -d \
  --name datifyy-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e JWT_SECRET=your_secret_here \
  -e DATABASE_URL=postgresql://user:pass@host:5432/datifyy \
  datifyy-backend:local
```

## Environment Variables
Create a `.env` file in the service directory:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=datifyy
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
MAILERSEND_API_KEY=your_api_key_here
```

## Troubleshooting

### Build Failures
1. **TypeScript Errors**: Ensure the code compiles locally first:
   ```bash
   yarn build
   ```

2. **Dependency Issues**: Clear yarn cache:
   ```bash
   yarn cache clean
   rm -rf node_modules
   yarn install
   ```

3. **Docker Cache Issues**: Build without cache:
   ```bash
   docker build --no-cache -f Dockerfile.standalone -t datifyy-backend:local .
   ```

### Runtime Issues
1. **Container Won't Start**: Check logs:
   ```bash
   docker logs datifyy-backend
   ```

2. **Database Connection**: Ensure database is running and accessible:
   ```bash
   docker-compose ps
   docker-compose logs db
   ```

3. **Port Already in Use**: Change the port mapping:
   ```bash
   docker run -p 5001:5000 datifyy-backend:local
   ```

## Production Deployment

### Build for Production
```bash
# Build with production optimizations
docker build \
  -f Dockerfile.standalone \
  -t datifyy-backend:prod \
  --build-arg NODE_ENV=production \
  .
```

### Push to Registry
```bash
# Tag for your registry
docker tag datifyy-backend:prod your-registry.com/datifyy-backend:latest

# Push to registry
docker push your-registry.com/datifyy-backend:latest
```

### Deploy on Render
Update your Render build command to:
```bash
docker build -f Dockerfile.standalone -t app .
```

## Health Check
The container includes a health check endpoint:
- URL: `http://localhost:5000/health`
- Expected response: `200 OK`

Test it:
```bash
curl http://localhost:5000/health
```

## Monitoring
View container stats:
```bash
docker stats datifyy-backend
```

View logs:
```bash
docker logs -f datifyy-backend
```

## Cleanup
Remove containers and images:
```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi datifyy-backend:local

# Remove all unused images
docker image prune -a
```