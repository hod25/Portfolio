#!/bin/bash

# שמור את הנתיב של הריפו המקורי (כלומר הקובץ הזה)
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_DIR=$(dirname "$SCRIPT_DIR")

# הגדר נתיב זמני לשיבוט הריפו
TEMP_DIR="/root/Portfolio_temp"

echo "📦 מוחק את התיקייה הזמנית אם קיימת..."
rm -rf "$TEMP_DIR"

echo "📥 קלאונינג מהריפו המקורי..."
git clone https://github.com/hod25/Portfolio.git "$TEMP_DIR"

echo "📦 מתקין חבילות..."
cd "$TEMP_DIR" || exit 1
npm install

echo "⚙️ בונה את הפרויקט..."
npm run build

echo "🚚 מחליף גרסה ישנה בחדשה..."
rm -rf "$REPO_DIR"
mv "$TEMP_DIR" "$REPO_DIR"

echo "🔁 מריץ מחדש את השירות..."
systemctl restart portfolio

echo "✅ סיום פריסה בהצלחה."
