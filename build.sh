#!/bin/bash
set -e

# Handle both local and Render environments
if [ -d "src" ]; then
  echo "Found src directory, moving to project root..."
  cd ..
fi

echo "Current directory: $(pwd)"
echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Build complete!"
