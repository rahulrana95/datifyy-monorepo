#!/bin/bash

# Script to build the backend service with Docker
# This handles the monorepo yarn workspace setup

echo "Building Datifyy Backend with Docker..."

# Option 1: Try to build from monorepo root (recommended)
echo "Attempting to build from monorepo root..."
cd ../.. 

if [ -f "yarn.lock" ]; then
    echo "Found yarn.lock in monorepo root. Building with monorepo context..."
    docker build -f services/nodejs-service/Dockerfile.monorepo -t datifyy-backend:local .
    exit $?
fi

# Option 2: Build standalone (requires copying yarn.lock)
echo "Building standalone. Copying yarn.lock from root..."
cd services/nodejs-service

# Copy yarn.lock from root if it exists
if [ -f "../../yarn.lock" ]; then
    cp ../../yarn.lock .
    echo "Copied yarn.lock from root"
fi

# Build the image
docker build -f Dockerfile.standalone -t datifyy-backend:local .
BUILD_RESULT=$?

# Clean up copied yarn.lock
if [ -f "yarn.lock" ] && [ -f "../../yarn.lock" ]; then
    rm yarn.lock
    echo "Cleaned up temporary yarn.lock"
fi

exit $BUILD_RESULT