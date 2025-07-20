#!/bin/bash

# Script for building the backend service on Render
# This handles the monorepo structure properly

echo "Building Node.js backend service..."

# Change to the root directory of the monorepo
cd ../..

# Install all dependencies using Yarn workspaces
echo "Installing dependencies..."
yarn install

# Build the backend service
echo "Building backend..."
yarn workspace nodejs-service build

echo "Build completed successfully!"