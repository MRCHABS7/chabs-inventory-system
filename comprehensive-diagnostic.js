#!/usr/bin/env node

/**
 * Comprehensive CHABS System Diagnostic
 * Identifies and reports all potential issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CHABS Comprehensive System Diagnostic\n');

let issues = [];
let warnings = [];
let suggestions = [];

// Check 1: File Structure
console.log('1️⃣ Checking File Structure...');
const criticalFiles = [
  'src/pages/index.tsx',
  'src/pages/dashboard.tsx',
  'src/components/Layout.tsx',
  'src/components/Navigation.tsx',
  'src/lib/storage-simple.ts',
  'src/lib/types.ts',
  'src/styles/globals.css'
];

criticalFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`Missing critical file: ${file}`);
  }
});

// Check 2: Package.json Dependencies
console.log('2️⃣ Checking Dependencies...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'next', 'typescript'];
  
  requiredDeps.forEach(dep => {
    if (!pkg.dependencies || !pkg.dependencies[dep]) {
      issues.push(`Missing dependency: ${dep}`);
    }
  });
  
  if (!pkg.devDependencies || !pkg.devDependencies['@types/react']) {
    warnings.push('Missing TypeScript types for React');
  }
} catch (error) {
  issues.push('Cannot read package.json');
}

// Check 3: TypeScript Configuration
console.log('3️⃣ Checking TypeScript Configuration...');
if (!fs.existsSync('tsconfig.json')) {
  issues.push('Missing tsconfig.json');
} else {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.strict) {
      warnings.push('TypeScript strict mode not enabled');
    }
  } catch (error) {
    issues.push('Invalid tsconfig.json');
  }
}

// Check 4: Environment Configuration
console.log('4️⃣ Checking Environment Configuration...');
if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
  suggestions.push('Consider creating .env.local for environment variables');
}

// Check 5: Component Syntax Check
console.log('5️⃣ Checking Component Syntax...');
const componentFiles = [
  'src/components/Layout.tsx',
  'src/components/Navigation.tsx',
  'src/components/SmartDashboard.tsx',
  'src/components/WarehouseManager.tsx'
];

componentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for common syntax issues
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        issues.push(`${file}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
      }
      
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        issues.push(`${file}: Mismatched parentheses (${openParens} open, ${closeParens} close)`);
      }
      
      // Check for export default
      if (!content.includes('export default')) {
        warnings.push(`${file}: Missing export default`);
      }
      
      // Check for React import
      if (!content.includes('import') || (!content.includes('from \'react\'') && !content.includes('from "react"'))) {
        if (content.includes('useState') || content.includes('useEffect')) {
          issues.push(`${file}: Uses React hooks but missing React import`);
        }
      }
      
    } catch (error) {
      issues.push(`${file}: Cannot read file - ${error.message}`);
    }
  }
});

// Check 6: Storage System Issues
console.log('6️⃣ Checking Storage System...');
const storageFiles = [
  'src/lib/storage-simple.ts',
  'src/lib/storage-enhanced.ts',
  'src/lib/storage-hybrid.ts'
];

storageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for localStorage usage
      if (content.includes('localStorage') && !content.includes('typeof window')) {
        warnings.push(`${file}: localStorage used without window check (SSR issue)`);
      }
      
      // Check for proper error handling
      if (content.includes('JSON.parse') && !content.includes('try') && !content.includes('catch')) {
        warnings.push(`${file}: JSON.parse without error handling`);
      }
      
    } catch (error) {
      issues.push(`${file}: Cannot analyze - ${error.message}`);
    }
  }
});

// Check 7: CSS Issues
console.log('7️⃣ Checking CSS...');
if (fs.existsSync('src/styles/globals.css')) {
  try {
    const css = fs.readFileSync('src/styles/globals.css', 'utf8');
    
    // Check for common CSS issues
    if (!css.includes('.btn')) {
      warnings.push('globals.css: Missing button styles');
    }
    
    if (!css.includes('.card')) {
      warnings.push('globals.css: Missing card styles');
    }
    
  } catch (error) {
    issues.push('Cannot read globals.css');
  }
}

// Check 8: Next.js Configuration
console.log('8️⃣ Checking Next.js Configuration...');
if (fs.existsSync('next.config.js')) {
  try {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    if (nextConfig.includes('experimental')) {
      suggestions.push('Review experimental Next.js features');
    }
  } catch (error) {
    warnings.push('Cannot read next.config.js');
  }
}

// Check 9: Import/Export Issues
console.log('9️⃣ Checking Import/Export Issues...');
const pageFiles = [
  'src/pages/dashboard.tsx',
  'src/pages/products.tsx',
  'src/pages/orders.tsx'
];

pageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for circular imports (basic check)
      const imports = content.match(/import.*from ['"](.*)['"];?/g) || [];
      imports.forEach(importLine => {
        if (importLine.includes('../') && importLine.includes(path.basename(file, '.tsx'))) {
          warnings.push(`${file}: Potential circular import detected`);
        }
      });
      
    } catch (error) {
      issues.push(`${file}: Cannot analyze imports - ${error.message}`);
    }
  }
});

// Check 10: Runtime Issues
console.log('🔟 Checking for Common Runtime Issues...');

// Check for hydration issues
const layoutFile = 'src/components/Layout.tsx';
if (fs.existsSync(layoutFile)) {
  try {
    const content = fs.readFileSync(layoutFile, 'utf8');
    if (content.includes('useEffect') && !content.includes('useState')) {
      warnings.push('Layout.tsx: useEffect without useState might cause hydration issues');
    }
  } catch (error) {
    // Ignore
  }
}

// Check for authentication issues
const authFile = 'src/lib/auth-simple.ts';
if (fs.existsSync(authFile)) {
  try {
    const content = fs.readFileSync(authFile, 'utf8');
    if (content.includes('localStorage') && !content.includes('typeof window')) {
      issues.push('auth-simple.ts: localStorage used without window check');
    }
  } catch (error) {
    warnings.push('Cannot check auth-simple.ts');
  }
}

// Report Results
console.log('\n' + '='.repeat(60));
console.log('🔍 DIAGNOSTIC RESULTS');
console.log('='.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ NO ISSUES FOUND - System appears healthy!');
} else {
  if (issues.length > 0) {
    console.log(`❌ CRITICAL ISSUES (${issues.length}):`);
    issues.forEach((issue, idx) => {
      console.log(`   ${idx + 1}. ${issue}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach((warning, idx) => {
      console.log(`   ${idx + 1}. ${warning}`);
    });
  }
}

if (suggestions.length > 0) {
  console.log(`\n💡 SUGGESTIONS (${suggestions.length}):`);
  suggestions.forEach((suggestion, idx) => {
    console.log(`   ${idx + 1}. ${suggestion}`);
  });
}

console.log('\n🎯 NEXT STEPS:');
if (issues.length > 0) {
  console.log('1. Fix critical issues first');
  console.log('2. Address warnings if they affect functionality');
  console.log('3. Consider suggestions for improvements');
} else {
  console.log('✅ System is healthy! No critical issues found.');
  console.log('💡 Review warnings and suggestions for optimization.');
}

console.log('\n📞 If you\'re seeing specific errors:');
console.log('   • Share the exact error messages');
console.log('   • Mention when/where they occur');
console.log('   • Include browser console output');

process.exit(issues.length > 0 ? 1 : 0);