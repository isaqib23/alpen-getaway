#!/usr/bin/env node

/**
 * CSS Standardization Tool
 * Cleans up and standardizes all CSS files in the project
 */

const fs = require('fs');
const path = require('path');

const CSS_DIR = '/Volumes/Work/web/alpen-getaway/frontend/src/assets/css';

// Color mappings from old values to CSS variables
const COLOR_MAPPINGS = {
  // Primary colors
  '#131010': 'var(--primary-color)',
  '#fff8f6': 'var(--secondary-color)',
  '#ff3600': 'var(--accent-color)',
  '#FF6B35': 'var(--accent-color)',
  '#ff6b35': 'var(--accent-color)',
  '#ffffff': 'var(--white-color)',
  '#fff': 'var(--white-color)',
  
  // Text colors
  '#616161': 'var(--text-color)',
  '#1e293b': 'var(--text-dark)',
  '#64748b': 'var(--text-light)',
  '#6b7280': 'var(--text-muted)',
  '#a1a1a1': 'var(--text-disabled)',
  '#333': 'var(--text-color)',
  '#666': 'var(--text-light)',
  '#555': 'var(--text-color)',
  '#1a1a1a': 'var(--text-dark)',
  
  // Background colors
  '#f8f9fa': 'var(--bg-light)',
  '#f0f0f0': 'var(--bg-neutral)',
  '#fafafa': 'var(--bg-section)',
  
  // Border colors
  '#ececec': 'var(--border-color)',
  '#e5e7eb': 'var(--border-light)',
  '#dadada': 'var(--border-dark)',
  '#ddd': 'var(--border-focus)',
  '#eee': 'var(--border-light)',
  
  // Status colors
  '#22bba7': 'var(--success-color)',
  '#77bc23': 'var(--success-light)',
  '#d1f9d1': 'var(--success-bg)',
  '#ef6c00': 'var(--warning-color)',
  '#fbdcc2': 'var(--warning-bg)',
  '#e53935': 'var(--error-color)',
  '#fbdfde': 'var(--error-bg)',
  '#1e88e5': 'var(--info-color)',
  '#d9e7f4': 'var(--info-bg)',
  '#6e7c86': 'var(--neutral-color)',
  '#d9d9d9': 'var(--neutral-bg)',
};

// Font mappings
const FONT_MAPPINGS = {
  '"DM Sans", sans-serif': 'var(--font-primary)',
  '"Epilogue", sans-serif': 'var(--font-heading)',
  '"DM Sans"': 'var(--font-primary)',
  '"Epilogue"': 'var(--font-heading)',
};

// Size mappings (convert px to CSS variables)
const SIZE_MAPPINGS = {
  '12px': 'var(--font-size-xs)',
  '14px': 'var(--font-size-sm)',
  '16px': 'var(--font-size-base)',
  '18px': 'var(--font-size-lg)',
  '20px': 'var(--font-size-xl)',
  '24px': 'var(--font-size-2xl)',
  '32px': 'var(--font-size-3xl)',
  '40px': 'var(--font-size-4xl)',
  
  '4px': 'var(--spacing-xs)',
  '8px': 'var(--spacing-sm)',
  '16px': 'var(--spacing-md)',
  '24px': 'var(--spacing-lg)',
  '32px': 'var(--spacing-xl)',
  '48px': 'var(--spacing-2xl)',
  '64px': 'var(--spacing-3xl)',
};

function cleanupCSS(content) {
  let cleaned = content;
  
  // Remove gradients and replace with solid colors
  cleaned = cleaned.replace(/background:\s*linear-gradient\([^)]+\);/g, 'background: var(--accent-color);');
  cleaned = cleaned.replace(/background:\s*radial-gradient\([^)]+\);/g, 'background: var(--accent-color);');
  
  // Replace colors with CSS variables
  Object.entries(COLOR_MAPPINGS).forEach(([oldColor, newVar]) => {
    const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    cleaned = cleaned.replace(regex, newVar);
  });
  
  // Replace fonts with CSS variables
  Object.entries(FONT_MAPPINGS).forEach(([oldFont, newVar]) => {
    const regex = new RegExp(oldFont.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    cleaned = cleaned.replace(regex, newVar);
  });
  
  // Replace sizes with CSS variables (be careful with this)
  Object.entries(SIZE_MAPPINGS).forEach(([oldSize, newVar]) => {
    // Only replace in common properties
    const fontSizeRegex = new RegExp(`(font-size:\\s*)${oldSize.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
    cleaned = cleaned.replace(fontSizeRegex, `$1${newVar}`);
  });
  
  // Standardize transitions
  cleaned = cleaned.replace(/transition:\s*[^;]+ease[^;]*;/g, 'transition: var(--transition);');
  cleaned = cleaned.replace(/transition:\s*all\s+0\.3s[^;]*;/g, 'transition: var(--transition);');
  
  // Remove duplicate empty lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Standardize property formatting
  cleaned = cleaned.replace(/([a-zA-Z-]+):\s+([^;]+);/g, '$1: $2;');
  
  return cleaned;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanupCSS(content);
    
    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned);
      console.log(`✓ Processed: ${path.basename(filePath)}`);
    } else {
      console.log(`- No changes: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting CSS standardization...\n');
  
  // Get all CSS files
  const files = fs.readdirSync(CSS_DIR)
    .filter(file => file.endsWith('.css') && !file.startsWith('_'))
    .map(file => path.join(CSS_DIR, file));
  
  console.log(`Found ${files.length} CSS files to process:\n`);
  
  files.forEach(processFile);
  
  console.log('\n✅ CSS standardization complete!');
  console.log('\nNext steps:');
  console.log('1. Review the changes');
  console.log('2. Test the application');
  console.log('3. Add @import statements for _variables.css and _utilities.css');
}

if (require.main === module) {
  main();
}

module.exports = { cleanupCSS, COLOR_MAPPINGS, FONT_MAPPINGS, SIZE_MAPPINGS };
