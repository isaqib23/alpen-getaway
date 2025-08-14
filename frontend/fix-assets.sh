#!/bin/bash

# Fix script for asset import issues across machines
echo "🔧 Fixing asset import issues..."

# 1. Clean cache and node_modules
echo "📦 Cleaning cache and dependencies..."
rm -rf node_modules/.vite
rm -rf node_modules/.cache
npm run build -- --force

# 2. Check if TypeScript paths are configured
echo "🔍 Checking TypeScript configuration..."
if ! grep -q "@assets/\*" tsconfig.json; then
    echo "❌ Missing @assets path mapping in tsconfig.json"
    echo "Please ensure your tsconfig.json has the following paths configuration:"
    echo '{
  "compilerOptions": {
    ...
    "paths": {
      ":bookcars-types": ["./src/types/bookcars-types"],
      ":bookcars-helper": ["./src/utils/bookcars-helper"],
      ":disable-react-devtools": ["./src/utils/disable-react-devtools"],
      "@/*": ["./src/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}'
else
    echo "✅ TypeScript paths are configured correctly"
fi

# 3. Verify key asset files exist
echo "🖼️  Verifying asset files..."
ASSETS=(
    "src/assets/images/404-error-img.png"
    "src/assets/images/about_us/about.jpg"
    "src/assets/images/about_us/driver_1.jpg"
    "src/assets/images/our_fleet/transparent_car_images/s_class.png"
)

for asset in "${ASSETS[@]}"; do
    if [ -f "$asset" ]; then
        echo "✅ $asset"
    else
        echo "❌ Missing: $asset"
    fi
done

# 4. Check Vite configuration
echo "⚙️  Checking Vite configuration..."
if grep -q "@assets" vite.config.ts; then
    echo "✅ Vite alias configuration found"
else
    echo "❌ Missing @assets alias in vite.config.ts"
fi

# 5. Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm ci

echo "🎉 Fix script completed!"
echo ""
echo "📋 Next steps for the other machine:"
echo "1. Run: chmod +x fix-assets.sh && ./fix-assets.sh"
echo "2. Delete node_modules and run: npm install"
echo "3. Try: npm run build"
echo ""
echo "If issues persist, also try:"
echo "- Clear npm cache: npm cache clean --force"
echo "- Delete package-lock.json and reinstall"
echo "- Check Node.js version compatibility"