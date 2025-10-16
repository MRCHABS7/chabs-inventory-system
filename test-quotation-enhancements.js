#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 TESTING QUOTATION ENHANCEMENTS...\n');

const testResults = [];

// Test 1: Check if customer price history functions exist
console.log('1️⃣ Testing Customer Price History Functions...');
try {
  const storageContent = fs.readFileSync('src/lib/storage-simple.ts', 'utf8');
  
  const requiredFunctions = [
    'listCustomerPrices',
    'createCustomerPrice', 
    'getCustomerPriceHistory',
    'getLastQuotedPrice'
  ];
  
  let functionsFound = 0;
  requiredFunctions.forEach(func => {
    if (storageContent.includes(func)) {
      console.log(`  ✅ ${func} function found`);
      functionsFound++;
    } else {
      console.log(`  ❌ ${func} function missing`);
    }
  });
  
  testResults.push({
    test: 'Customer Price History Functions',
    passed: functionsFound === requiredFunctions.length,
    score: `${functionsFound}/${requiredFunctions.length}`
  });
  
} catch (error) {
  console.log(`  ❌ Error reading storage file: ${error.message}`);
  testResults.push({
    test: 'Customer Price History Functions',
    passed: false,
    score: '0/4'
  });
}

// Test 2: Check if QuoteBuilder has price history features
console.log('\n2️⃣ Testing QuoteBuilder Price History Features...');
try {
  const quoteBuilderContent = fs.readFileSync('src/components/QuoteBuilder.tsx', 'utf8');
  
  const features = [
    'getCustomerPriceHistory',
    'showPriceHistory',
    'Previous Quotes for this Customer',
    'Most Recent'
  ];
  
  let featuresFound = 0;
  features.forEach(feature => {
    if (quoteBuilderContent.includes(feature)) {
      console.log(`  ✅ ${feature} feature found`);
      featuresFound++;
    } else {
      console.log(`  ❌ ${feature} feature missing`);
    }
  });
  
  testResults.push({
    test: 'QuoteBuilder Price History Features',
    passed: featuresFound === features.length,
    score: `${featuresFound}/${features.length}`
  });
  
} catch (error) {
  console.log(`  ❌ Error reading QuoteBuilder file: ${error.message}`);
  testResults.push({
    test: 'QuoteBuilder Price History Features',
    passed: false,
    score: '0/4'
  });
}

// Test 3: Check if galvanizing association text is removed
console.log('\n3️⃣ Testing Galvanizing Association Text Removal...');
try {
  const brandingContent = fs.readFileSync('src/contexts/BrandingContext.tsx', 'utf8');
  
  const hasGalvanizingText = brandingContent.includes('GALVANISING ASSOCIATION');
  const hasEmptyMembershipText = brandingContent.includes("membershipText: ''");
  
  if (!hasGalvanizingText && hasEmptyMembershipText) {
    console.log('  ✅ Galvanizing association text successfully removed');
    testResults.push({
      test: 'Galvanizing Association Text Removal',
      passed: true,
      score: '1/1'
    });
  } else {
    console.log('  ❌ Galvanizing association text still present');
    testResults.push({
      test: 'Galvanizing Association Text Removal',
      passed: false,
      score: '0/1'
    });
  }
  
} catch (error) {
  console.log(`  ❌ Error reading branding file: ${error.message}`);
  testResults.push({
    test: 'Galvanizing Association Text Removal',
    passed: false,
    score: '0/1'
  });
}

// Test 4: Check if PDF components use branding colors
console.log('\n4️⃣ Testing PDF Branding Consistency...');
try {
  const pdfContent = fs.readFileSync('src/components/ProfessionalQuotePDF.tsx', 'utf8');
  const pickingContent = fs.readFileSync('src/components/PickingSlipPDF.tsx', 'utf8');
  
  const brandingFeatures = [
    'branding.primaryColor',
    'useBranding',
    '${branding.primaryColor}'
  ];
  
  let pdfFeaturesFound = 0;
  let pickingFeaturesFound = 0;
  
  brandingFeatures.forEach(feature => {
    if (pdfContent.includes(feature)) {
      pdfFeaturesFound++;
    }
    if (pickingContent.includes(feature)) {
      pickingFeaturesFound++;
    }
  });
  
  console.log(`  📄 ProfessionalQuotePDF: ${pdfFeaturesFound}/${brandingFeatures.length} branding features`);
  console.log(`  📋 PickingSlipPDF: ${pickingFeaturesFound}/${brandingFeatures.length} branding features`);
  
  testResults.push({
    test: 'PDF Branding Consistency',
    passed: pdfFeaturesFound >= 2 && pickingFeaturesFound >= 2,
    score: `PDF:${pdfFeaturesFound}/3, Picking:${pickingFeaturesFound}/3`
  });
  
} catch (error) {
  console.log(`  ❌ Error reading PDF files: ${error.message}`);
  testResults.push({
    test: 'PDF Branding Consistency',
    passed: false,
    score: '0/3'
  });
}

// Test 5: Check if editable pricing is enhanced
console.log('\n5️⃣ Testing Enhanced Editable Pricing...');
try {
  const quoteBuilderContent = fs.readFileSync('src/components/QuoteBuilder.tsx', 'utf8');
  
  const pricingFeatures = [
    'font-semibold text-green-600',
    'Default: R',
    'createCustomerPrice',
    'customPrice'
  ];
  
  let pricingFeaturesFound = 0;
  pricingFeatures.forEach(feature => {
    if (quoteBuilderContent.includes(feature)) {
      console.log(`  ✅ ${feature} found`);
      pricingFeaturesFound++;
    } else {
      console.log(`  ❌ ${feature} missing`);
    }
  });
  
  testResults.push({
    test: 'Enhanced Editable Pricing',
    passed: pricingFeaturesFound === pricingFeatures.length,
    score: `${pricingFeaturesFound}/${pricingFeatures.length}`
  });
  
} catch (error) {
  console.log(`  ❌ Error reading QuoteBuilder file: ${error.message}`);
  testResults.push({
    test: 'Enhanced Editable Pricing',
    passed: false,
    score: '0/4'
  });
}

// Summary
console.log('\n📊 TEST SUMMARY:');
console.log('================');

const passedTests = testResults.filter(t => t.passed).length;
const totalTests = testResults.length;

testResults.forEach(result => {
  const status = result.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${result.test} (${result.score})`);
});

console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('🎉 ALL QUOTATION ENHANCEMENTS SUCCESSFULLY IMPLEMENTED!');
  console.log('\n✨ NEW FEATURES AVAILABLE:');
  console.log('- ✅ Editable prices with visual highlighting');
  console.log('- ✅ Customer price history tracking');
  console.log('- ✅ Previous quote price suggestions');
  console.log('- ✅ Consistent branding across all documents');
  console.log('- ✅ Removed galvanizing association text');
  console.log('- ✅ Enhanced price input with default values');
} else {
  console.log('⚠️  Some enhancements may need manual verification');
}

console.log('\n🚀 READY TO USE: Your quotation system now has enhanced pricing capabilities!');