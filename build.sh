#!/bin/bash

# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Build the server
cd server && pnpm run build

# For production deployment
echo "Build completed successfully" 