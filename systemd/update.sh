#!/bin/bash

# Save the path of the original repo (i.e., this script)
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_DIR=$(dirname "$SCRIPT_DIR")

# Define a temporary path for cloning the repo
TEMP_DIR="/root/Portfolio_temp"

echo "📦 Removing temporary directory if it exists..."
rm -rf "$TEMP_DIR"

echo "📥 Cloning from the original repository..."
git clone https://github.com/hod25/Portfolio.git "$TEMP_DIR"

echo "📦 Installing packages..."
cd "$TEMP_DIR" || exit 1
npm install

echo "⚙️ Building the project..."
npm run build

echo "🚚 Replacing old version with the new one..."
rm -rf "$REPO_DIR"
mv "$TEMP_DIR" "$REPO_DIR"

echo "🔁 Restarting the service..."
systemctl restart portfolio

echo "✅ Deployment completed successfully."
