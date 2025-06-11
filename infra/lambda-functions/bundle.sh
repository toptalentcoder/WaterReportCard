#!/bin/bash
set -e

# Clean up any existing files
rm -rf node_modules package.json package-lock.json

# Initialize new package.json
npm init -y

# Install dependencies
npm install pg@8.16.0 dotenv@16.5.0 --no-package-lock 