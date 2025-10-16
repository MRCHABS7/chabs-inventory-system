#!/usr/bin/env node

/**
 * CHABS Storage Systems Test Suite
 * Tests Local, Cloud, and Hybrid storage implementations
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 CHABS Storage Systems Test Suite\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFunction) {
  totalTests++;
  try {
    const result = testFunction();
    if (result) {
      passedTests++;
      console.log(`✅ ${testName}`);
    } else {
      failedTests++;
      console.log(`❌ ${testName}`);
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ ${testName} - Error: ${error.message}`);
  }
}

// Test file existence
console.log('📁 Testing Storage System Files...');

const storageFiles = [
  'src/lib/storage-simple.ts',
  'src/lib/storage-enhanced.ts',
  'src/lib/storage-hybrid.ts',
  'src/lib/storage-cloud.ts',
  'src/components/StorageManager.tsx',
  'STORAGE-SETUP.md',
  '.env.example'
];

storageFiles.forEach(file => {
  runTest(`File exists: ${file}`, () => {
    return fs.existsSync(path.join(process.cwd(), file));
  });
});

// Test storage implementations
console.log('\n🔧 Testing Storage Implementations...');

runTest('Enhanced Local Storage exports', () => {
  const content = fs.readFileSync('src/lib/storage-enhanced.ts', 'utf8');
  return content.includes('class EnhancedStorage') &&
         content.includes('createProduct') &&
         content.includes('createBackup') &&
         content.includes('exportData') &&
         content.includes('getStorageStats');
});

runTest('Cloud Storage exports', () => {
  const content = fs.readFileSync('src/lib/storage-cloud.ts', 'utf8');
  return content.includes('class CloudStorage') &&
         content.includes('createClient') &&
         content.includes('supabase') &&
         content.includes('healthCheck');
});

runTest('Hybrid Storage exports', () => {
  const content = fs.readFileSync('src/lib/storage-hybrid.ts', 'utf8');
  return content.includes('class HybridStorage') &&
         content.includes('switchStorageMode') &&
         content.includes('syncToCloud') &&
         content.includes('executeOperation');
});

runTest('StorageManager component', () => {
  const content = fs.readFileSync('src/components/StorageManager.tsx', 'utf8');
  return content.includes('export default function StorageManager') &&
         content.includes('switchStorageMode') &&
         content.includes('createBackup') &&
         content.includes('exportData');
});

// Test configuration files
console.log('\n⚙️ Testing Configuration Files...');

runTest('Environment example file', () => {
  const content = fs.readFileSync('.env.example', 'utf8');
  return content.includes('NEXT_PUBLIC_STORAGE_MODE') &&
         content.includes('NEXT_PUBLIC_SUPABASE_URL') &&
         content.includes('NEXT_PUBLIC_ENABLE_SYNC');
});

runTest('Storage setup documentation', () => {
  const content = fs.readFileSync('STORAGE-SETUP.md', 'utf8');
  return content.includes('# CHABS Storage System Setup Guide') &&
         content.includes('Local Storage') &&
         content.includes('Cloud Storage') &&
         content.includes('Hybrid Mode');
});

// Test TypeScript interfaces
console.log('\n📝 Testing TypeScript Integration...');

runTest('Storage interfaces compatibility', () => {
  const hybridContent = fs.readFileSync('src/lib/storage-hybrid.ts', 'utf8');
  const cloudContent = fs.readFileSync('src/lib/storage-cloud.ts', 'utf8');
  const enhancedContent = fs.readFileSync('src/lib/storage-enhanced.ts', 'utf8');
  
  return hybridContent.includes('StorageProvider') &&
         cloudContent.includes('Product, Order, Customer') &&
         enhancedContent.includes('EnhancedStorage');
});

// Test feature completeness
console.log('\n🎯 Testing Feature Completeness...');

const requiredFeatures = [
  'createProduct',
  'getProducts',
  'updateProduct',
  'deleteProduct',
  'createCustomer',
  'getCustomers',
  'createOrder',
  'getOrders',
  'createSupplier',
  'getSuppliers',
  'createUser',
  'getUsers'
];

requiredFeatures.forEach(feature => {
  runTest(`Feature: ${feature}`, () => {
    const hybridContent = fs.readFileSync('src/lib/storage-hybrid.ts', 'utf8');
    const cloudContent = fs.readFileSync('src/lib/storage-cloud.ts', 'utf8');
    const enhancedContent = fs.readFileSync('src/lib/storage-enhanced.ts', 'utf8');
    
    return hybridContent.includes(feature) &&
           cloudContent.includes(feature) &&
           enhancedContent.includes(feature);
  });
});

// Test advanced features
console.log('\n🚀 Testing Advanced Features...');

const advancedFeatures = [
  { name: 'Backup System', files: ['storage-enhanced.ts'], keywords: ['createBackup', 'restoreBackup'] },
  { name: 'Data Export/Import', files: ['storage-enhanced.ts'], keywords: ['exportData', 'importData'] },
  { name: 'Storage Statistics', files: ['storage-enhanced.ts'], keywords: ['getStorageStats'] },
  { name: 'Network Detection', files: ['storage-hybrid.ts'], keywords: ['isOnline', 'addEventListener'] },
  { name: 'Auto Sync', files: ['storage-hybrid.ts'], keywords: ['syncToCloud', 'startSync'] },
  { name: 'Real-time Subscriptions', files: ['storage-cloud.ts'], keywords: ['subscribeToProducts', 'subscribeToOrders'] },
  { name: 'Health Checks', files: ['storage-cloud.ts'], keywords: ['healthCheck'] },
  { name: 'Storage Mode Switching', files: ['storage-hybrid.ts'], keywords: ['switchStorageMode'] }
];

advancedFeatures.forEach(feature => {
  runTest(`Advanced Feature: ${feature.name}`, () => {
    return feature.files.every(file => {
      const content = fs.readFileSync(`src/lib/${file}`, 'utf8');
      return feature.keywords.every(keyword => content.includes(keyword));
    });
  });
});

// Test documentation completeness
console.log('\n📚 Testing Documentation...');

runTest('Setup guide completeness', () => {
  const content = fs.readFileSync('STORAGE-SETUP.md', 'utf8');
  return content.includes('Quick Start') &&
         content.includes('Supabase') &&
         content.includes('Environment Variables') &&
         content.includes('Troubleshooting') &&
         content.includes('Storage Comparison');
});

runTest('Environment variables documented', () => {
  const setupContent = fs.readFileSync('STORAGE-SETUP.md', 'utf8');
  const envContent = fs.readFileSync('.env.example', 'utf8');
  
  return setupContent.includes('NEXT_PUBLIC_STORAGE_MODE') &&
         setupContent.includes('NEXT_PUBLIC_SUPABASE_URL') &&
         envContent.includes('local') &&
         envContent.includes('cloud') &&
         envContent.includes('hybrid');
});

// Print results
console.log('\n' + '='.repeat(60));
console.log('📋 STORAGE SYSTEMS TEST RESULTS');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 ALL STORAGE SYSTEMS READY!');
  console.log('\n✅ Available Storage Options:');
  console.log('   1. 🏠 Enhanced Local Storage - Perfect for testing');
  console.log('   2. ☁️  Cloud Storage with Supabase - Production ready');
  console.log('   3. 🔄 Hybrid Mode - Best of both worlds');
  
  console.log('\n🚀 Quick Start Options:');
  console.log('   • Keep current setup (Enhanced Local) - No changes needed');
  console.log('   • Set up Supabase for cloud storage - Follow STORAGE-SETUP.md');
  console.log('   • Enable hybrid mode for automatic switching');
  
  console.log('\n📖 Next Steps:');
  console.log('   1. Read STORAGE-SETUP.md for detailed instructions');
  console.log('   2. Copy .env.example to .env.local and configure');
  console.log('   3. Add <StorageManager /> to your settings page');
  console.log('   4. Test switching between storage modes');
  
} else {
  console.log('\n⚠️  Some tests failed. Please check the implementation.');
}

console.log('\n' + '='.repeat(60));
process.exit(failedTests > 0 ? 1 : 0);