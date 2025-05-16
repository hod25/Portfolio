#!/bin/bash

set -e  # עוצר את הסקריפט אם יש שגיאה כלשהי

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
# move out of the target directory before removing it
cd /root

# Safety check: don't allow deletion of "/" or empty path
if [[ -n "$REPO_DIR" && "$REPO_DIR" != "/" && "$REPO_DIR" != "$TEMP_DIR" ]]; then
    rm -rf "$REPO_DIR"
    mv "$TEMP_DIR" "$REPO_DIR"
else
    echo "❌ ERROR: REPO_DIR='$REPO_DIR' is invalid or unsafe. Aborting."
    exit 1
fi

echo "🔁 Restarting the service..."
systemctl restart portfolio

echo "✅ Deployment completed successfully."