# Asset Import Troubleshooting Guide

This guide helps resolve asset import issues across different development machines.

## Quick Fix Commands

1. **Run the automated fix script:**
   ```bash
   chmod +x fix-assets.sh
   ./fix-assets.sh
   ```

2. **Manual steps if script doesn't work:**
   ```bash
   # Clear all cache
   rm -rf node_modules/.vite
   rm -rf node_modules/.cache
   rm -rf node_modules
   npm cache clean --force
   
   # Reinstall dependencies
   npm install
   
   # Force rebuild
   npm run build -- --force
   ```

## Common Issues and Solutions

### 1. Missing TypeScript Path Mappings

**Error:** `"@assets/images/..." could not be resolved`

**Solution:** Ensure your `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

### 2. Vite Alias Configuration

**Ensure** `vite.config.ts` has:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
});
```

### 3. Node.js Version Differences

**Check versions match:**
```bash
node --version
npm --version
```

**Recommended versions:**
- Node.js: 18.x or 20.x
- npm: 9.x or 10.x

### 4. Case Sensitivity Issues (macOS vs Linux)

**Verify exact filenames:**
```bash
ls -la src/assets/images/our_fleet/transparent_car_images/
```

All files should match exact case in imports:
- `s_class.png` (not `S_class.png` or `s_Class.png`)
- `about.jpg` (not `About.jpg`)

### 5. Cache and Dependencies

**Complete clean:**
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### 6. File Permissions

**On Unix systems:**
```bash
find src/assets -name "*.png" -o -name "*.jpg" | xargs chmod 644
```

## Verification Commands

**Check if assets exist:**
```bash
find src/assets -name "*.png" -o -name "*.jpg" -o -name "*.svg" | head -10
```

**Test Vite alias resolution:**
```bash
npm run dev
# Check browser console for any import errors
```

**Verify TypeScript configuration:**
```bash
npx tsc --noEmit --skipLibCheck
```

## Environment-Specific Issues

### Windows
- Use forward slashes in import paths
- Check for Windows-specific path separators

### Linux/Unix
- Verify file permissions (644 for files, 755 for directories)
- Check case sensitivity

### macOS
- Usually works out of the box
- Check for hidden .DS_Store files

## If Nothing Works

1. **Compare working vs non-working machines:**
   ```bash
   # On working machine
   npm list vite typescript
   node --version
   
   # Compare output with non-working machine
   ```

2. **Create minimal test:**
   ```typescript
   // test-import.ts
   import testImg from '@assets/images/404-error-img.png';
   console.log(testImg);
   ```

3. **Check Vite logs:**
   ```bash
   npm run dev -- --debug
   npm run build -- --debug
   ```

## Support Files Updated

- ✅ `tsconfig.json` - Added @assets path mapping
- ✅ `vite-env.d.ts` - Added asset type declarations  
- ✅ `utils/bookcars-helper.ts` - Fixed shuffle export
- ✅ `assets/css/slicknav.min.css` - Removed IE-specific CSS