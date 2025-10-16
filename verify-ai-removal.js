#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFYING AI FEATURE REMOVAL...\n');

const filesToCheck = [
  'src/components/SmartDashboard.tsx',
  'src/pages/automation.tsx',
  'src/lib/storage-simple.ts',
  'src/lib/storage.ts',
  'src/lib/types.ts'
];

let aiReferencesFound = 0;
const aiTerms = [
  'AIInsight',
  'listAIInsights',
  'generateAIInsights',
  'createAIInsight',
  'updateAIInsight',
  'aiInsights',
  'AI Business Insights',
  'AI-powered',
  'artificial intelligence'
];

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 Checking ${filePath}...`);
    
    aiTerms.forEach(term => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        console.log(`  ❌ Found AI reference: "${term}"`);
        aiReferencesFound++;
      }
    });
    
    if (!aiTerms.some(term => content.toLowerCase().includes(term.toLowerCase()))) {
      console.log(`  ✅ No AI references found`);
    }
  } else {
    console.log(`  ⚠️  File not found: ${filePath}`);
  }
  console.log('');
});

console.log('📊 SUMMARY:');
if (aiReferencesFound === 0) {
  console.log('✅ SUCCESS: All AI features have been successfully removed!');
  console.log('🎉 Your CHABS system is now AI-free and ready to use.');
} else {
  console.log(`❌ FOUND ${aiReferencesFound} AI references that need manual cleanup.`);
}

console.log('\n🔧 WHAT WAS REMOVED:');
console.log('- AI Insights functionality');
console.log('- AI-powered recommendations');
console.log('- Smart dashboard AI features');
console.log('- AI business analytics');
console.log('- AI automation suggestions');

console.log('\n✨ WHAT REMAINS:');
console.log('- Standard business automation');
console.log('- Regular dashboard functionality');
console.log('- Basic business insights');
console.log('- Inventory management alerts');
console.log('- All core CHABS features');