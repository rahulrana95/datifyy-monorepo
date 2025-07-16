#!/bin/bash

# Exit on error
set -e

echo "Building dependencies..."
yarn build:shared

echo "Building frontend..."
cd apps/frontend && yarn build

echo "Build completed successfully!"