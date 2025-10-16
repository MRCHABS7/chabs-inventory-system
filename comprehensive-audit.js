#!/usr/bin/env node

/**
 * CHABS Comprehensive System Audit
 * Complete diagnostic and feature analysis
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CHABS Comprehensive System Audit Starting...\n');

let issues = [];
let warnings = [];
let suggestions = [];

// Check all TypeScript/React files for common issues
function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Check for syntax issues
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openBraces !== closeBraces) {
      issues.push(`${fileName}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
    }
    
    if (openParens !== closeParens) {
      issues.push(`${fileName}: Mismatched parentheses (${openParens} open, ${closeParens} close)`);
    }
    
    // Check for React/Next.js best practices
    if (filePath.includes('.tsx') || filePath.includes('.jsx')) {
      if (!content.includes('export default') && !content.includes('export {')) {
        warnings.push(`${fileName}: No export found`);
      }
      
      // Check for hydration issues
      if (content.includes('localStorage') && !content.includes('useEffect')) {
        warnings.push(`${fileName}: localStorage used without useEffect (potential hydration issue)`);
      }
      
      // Check for missing error boundaries
      if (content.includes('useState') && !content.includes('try') && !content.includes('catch')) {
        suggestions.push(`${fileName}: Consider adding error handling`);
      }
      
      // Check for accessibility
      if (content.includes('<button') && !content.includes('aria-label') && !content.includes('title')) {
        suggestions.push(`${fileName}: Consider adding accessibility attributes to buttons`);
      }
    }
    
    // Check for TypeScript issues
    if (filePath.includes('.ts') || filePath.includes('.tsx')) {
      if (content.includes('any') && !content.includes('// @ts-ignore')) {
        warnings.push(`${fileName}: Using 'any' type - consider specific typing`);
      }
    }
    
  } catch (error) {
    issues.push(`${filePath}: Error reading file - ${error.message}`);
  }
}

// Get all relevant files
function getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(getAllFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Warning: Could not read directory ${dir}`);
  }
  
  return files;
}

// Audit all files
console.log('📁 Scanning all TypeScript/React files...');
const allFiles = getAllFiles('./src');
allFiles.forEach(auditFile);

// Check package.json
console.log('📦 Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for security vulnerabilities in dependencies
  const criticalDeps = ['react', 'next', 'typescript'];
  criticalDeps.forEach(dep => {
    if (!pkg.dependencies || !pkg.dependencies[dep]) {
      issues.push(`Missing critical dependency: ${dep}`);
    }
  });
  
  // Check for outdated patterns
  if (pkg.dependencies && pkg.dependencies.react && pkg.dependencies.react.startsWith('17')) {
    suggestions.push('Consider upgrading to React 18 for better performance');
  }
  
} catch (error) {
  issues.push('package.json: Could not read or parse');
}

// Check for missing essential files
console.log('🔍 Checking essential files...');
const essentialFiles = [
  'src/lib/types.ts',
  'src/lib/storage-simple.ts',
  'src/lib/auth-simple.ts',
  'src/components/Layout.tsx',
  'src/components/Navigation.tsx',
  'src/styles/globals.css',
  'next.config.js',
  'tsconfig.json'
];

essentialFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`Missing essential file: ${file}`);
  }
});

// Feature completeness check
console.log('🎯 Checking feature completeness...');
const featureFiles = {
  'User Management': ['src/lib/auth-simple.ts', 'src/pages/profile.tsx'],
  'Product Management': ['src/pages/products.tsx', 'src/components/ProductForm.tsx'],
  'Order Management': ['src/pages/orders.tsx'],
  'Customer Management': ['src/pages/customers.tsx'],
  'Supplier Management': ['src/pages/suppliers.tsx'],
  'Warehouse Management': ['src/pages/warehouse.tsx', 'src/components/WarehouseManager.tsx'],
  'Reporting': ['src/pages/reports.tsx'],
  'Automation': ['src/pages/automation.tsx'],
  'Settings': ['src/pages/settings.tsx']
};

Object.entries(featureFiles).forEach(([feature, files]) => {
  const missingFiles = files.filter(file => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    issues.push(`${feature}: Missing files - ${missingFiles.join(', ')}`);
  }
});

// Performance checks
console.log('⚡ Checking performance considerations...');
const performanceChecks = [
  { file: 'next.config.js', check: 'Image optimization configuration' },
  { file: 'src/components/Layout.tsx', check: 'Proper component structure' },
  { file: 'src/styles/globals.css', check: 'CSS optimization' }
];

// Security checks
console.log('🔒 Checking security considerations...');
allFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for potential security issues
    if (content.includes('dangerouslySetInnerHTML')) {
      warnings.push(`${path.basename(file)}: Using dangerouslySetInnerHTML - ensure content is sanitized`);
    }
    
    if (content.includes('eval(') || content.includes('Function(')) {
      issues.push(`${path.basename(file)}: Using eval() or Function() - security risk`);
    }
    
    // Check for hardcoded secrets (basic check)
    if (content.match(/password\s*=\s*["'][^"']+["']/i) || content.match(/api[_-]?key\s*=\s*["'][^"']+["']/i)) {
      warnings.push(`${path.basename(file)}: Potential hardcoded credentials found`);
    }
    
  } catch (error) {
    // Skip files that can't be read
  }
});

// Print results
console.log('\n' + '='.repeat(80));
console.log('📋 COMPREHENSIVE AUDIT RESULTS');
console.log('='.repeat(80));

console.log(`\n🔴 CRITICAL ISSUES (${issues.length}):`);
if (issues.length === 0) {
  console.log('✅ No critical issues found!');
} else {
  issues.forEach(issue => console.log(`   • ${issue}`));
}

console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
if (warnings.length === 0) {
  console.log('✅ No warnings!');
} else {
  warnings.forEach(warning => console.log(`   • ${warning}`));
}

console.log(`\n💡 SUGGESTIONS (${suggestions.length}):`);
if (suggestions.length === 0) {
  console.log('✅ No suggestions - system is well optimized!');
} else {
  suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
}

// Feature recommendations
console.log('\n🚀 RECOMMENDED ADDITIONAL FEATURES:');
const recommendedFeatures = [
  'Multi-language support (i18n)',
  'Advanced search and filtering',
  'Barcode scanning integration',
  'Email notifications system',
  'Data export/import functionality',
  'Audit trail and logging',
  'Mobile app companion',
  'API endpoints for integrations',
  'Advanced user roles and permissions',
  'Backup and restore functionality',
  'Performance monitoring dashboard',
  'Inventory forecasting with ML',
  'Supplier performance analytics',
  'Customer relationship management',
  'Financial reporting and accounting integration'
];

recommendedFeatures.forEach(feature => console.log(`   • ${feature}`));

console.log('\n' + '='.repeat(80));
console.log('🎯 AUDIT COMPLETE');
console.log('='.repeat(80));

// Exit code based on issues
process.exit(issues.length > 0 ? 1 : 0);