#!/bin/bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_DIR=$(dirname "$SCRIPT_DIR")

echo "📥 Pulling latest changes in $REPO_DIR..."
cd "$REPO_DIR"
git fetch origin
git pull --ff-only

echo "📦 Installing dependencies..."
npm ci

echo "⚙️ Building the project..."
npm run build

echo "🔁 Restarting the service..."
systemctl restart portfolio

echo "✅ Deployment completed successfully."
