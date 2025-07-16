#!/bin/bash

# Exit on error
set -e

echo "Installing dependencies..."
yarn install

echo "Building shared utils..."
yarn workspace @datifyy/shared-utils build

echo "Building frontend..."
yarn workspace frontend build

echo "Build completed successfully!"