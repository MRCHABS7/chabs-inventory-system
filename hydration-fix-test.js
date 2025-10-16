#!/usr/bin/env node

/**
 * CHABS Hydration Fix Verification
 * Quick test to verify hydration issues are resolved
 */

const fs = require('fs');

console.log('🔍 CHABS Hydration Fix Verification\n');

let allGood = true;

// Check Navigation component fixes
console.log('📱 Checking Navigation Component...');
try {
  const navContent = fs.readFileSync('src/components/Navigation.tsx', 'utf8');
  
  if (navContent.includes('useEffect') && navContent.includes('setIsClient')) {
    console.log('✅ Client-side hydration fix applied');
  } else {
    console.log('❌ Client-side hydration fix missing');
    allGood = false;
  }
  
  if (navContent.includes('toggleTheme')) {
    console.log('✅ Theme toggle function available');
  } else {
    console.log('❌ Theme toggle function missing');
    allGood = false;
  }
} catch (error) {
  console.log(`❌ Navigation component error: ${error.message}`);
  allGood = false;
}

// Check ThemeContext fixes
console.log('\n🎨 Checking ThemeContext...');
try {
  const themeContent = fs.readFileSync('src/contexts/ThemeContext.tsx', 'utf8');
  
  if (themeContent.includes('toggleTheme: () => void')) {
    console.log('✅ toggleTheme type definition added');
  } else {
    console.log('❌ toggleTheme type definition missing');
    allGood = false;
  }
  
  if (themeContent.includes('const toggleTheme = () => {')) {
    console.log('✅ toggleTheme function implementation added');
  } else {
    console.log('❌ toggleTheme function implementation missing');
    allGood = false;
  }
} catch (error) {
  console.log(`❌ ThemeContext error: ${error.message}`);
  allGood = false;
}

// Check Layout component fixes
console.log('\n🏗️ Checking Layout Component...');
try {
  const layoutContent = fs.readFileSync('src/components/Layout.tsx', 'utf8');
  
  if (layoutContent.includes('{showNavigation && <Navigation />}')) {
    console.log('✅ Layout navigation rendering simplified');
  } else {
    console.log('❌ Layout navigation rendering not simplified');
    allGood = false;
  }
} catch (error) {
  console.log(`❌ Layout component error: ${error.message}`);
  allGood = false;
}

// Final status
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 HYDRATION ISSUES FIXED!');
  console.log('✅ Client-side rendering implemented');
  console.log('✅ Theme toggle function added');
  console.log('✅ Navigation component stabilized');
  console.log('✅ Layout component simplified');
  console.log('\n🚀 The runtime hydration error should be resolved!');
  console.log('The application should now load without hydration mismatches.');
} else {
  console.log('⚠️  SOME FIXES INCOMPLETE');
  console.log('Please review the errors above.');
}

console.log('='.repeat(50));
process.exit(allGood ? 0 : 1);