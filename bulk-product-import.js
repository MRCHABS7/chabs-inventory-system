// Bulk Product Import Tool
// This script helps import the large product list efficiently

const fs = require('fs');

// Sample products from your list - you can expand this
const sampleProducts = [
  // RF27 Series
  { name: "RF27X50 RETURN FLANGER X 3M STRAIGHT PG", sku: "RF27X50-STR-3M", category: "Return Flangers", unit: "each", costPrice: 150, sellingPrice: 200, stock: 10, minimumStock: 5 },
  { name: "RF27X50 HORIZONTAL ELBOW PG", sku: "RF27X50-HE", category: "Return Flangers", unit: "each", costPrice: 120, sellingPrice: 160, stock: 15, minimumStock: 5 },
  { name: "RF27X50 INTERNAL ELBOW PG", sku: "RF27X50-IE", category: "Return Flangers", unit: "each", costPrice: 125, sellingPrice: 165, stock: 12, minimumStock: 5 },
  { name: "RF27X50 EXTERNAL ELBOW PG", sku: "RF27X50-EE", category: "Return Flangers", unit: "each", costPrice: 125, sellingPrice: 165, stock: 12, minimumStock: 5 },
  { name: "RF27X50 TEE PG", sku: "RF27X50-TEE", category: "Return Flangers", unit: "each", costPrice: 180, sellingPrice: 240, stock: 8, minimumStock: 3 },
  { name: "RF27X50 4WAY PG", sku: "RF27X50-4WAY", category: "Return Flangers", unit: "each", costPrice: 220, sellingPrice: 290, stock: 5, minimumStock: 2 },
  
  // RF27X75 Series
  { name: "RF27X75 RETURN FLANGER X 3M STRAIGHT PG", sku: "RF27X75-STR-3M", category: "Return Flangers", unit: "each", costPrice: 170, sellingPrice: 225, stock: 8, minimumStock: 4 },
  { name: "RF27X75 HORIZONTAL ELBOW PG", sku: "RF27X75-HE", category: "Return Flangers", unit: "each", costPrice: 140, sellingPrice: 185, stock: 12, minimumStock: 5 },
  { name: "RF27X75 TEE PG", sku: "RF27X75-TEE", category: "Return Flangers", unit: "each", costPrice: 200, sellingPrice: 265, stock: 6, minimumStock: 3 },
  
  // RF50 Series
  { name: "RF50X50 RETURN FLANGER X 3M STRAIGHT PG", sku: "RF50X50-STR-3M", category: "Return Flangers", unit: "each", costPrice: 180, sellingPrice: 240, stock: 10, minimumStock: 5 },
  { name: "RF50X100 HORIZONTAL ELBOW PG", sku: "RF50X100-HE", category: "Return Flangers", unit: "each", costPrice: 160, sellingPrice: 210, stock: 9, minimumStock: 4 },
  { name: "RF50X150 TEE PG", sku: "RF50X150-TEE", category: "Return Flangers", unit: "each", costPrice: 250, sellingPrice: 330, stock: 4, minimumStock: 2 },
  
  // Add some test products for search functionality
  { name: "HORIZONTAL BEAM SUPPORT", sku: "HBS-001", category: "Structural", unit: "each", costPrice: 85, sellingPrice: 115, stock: 20, minimumStock: 10 },
  { name: "POWER SKIRT ASSEMBLY", sku: "PSA-001", category: "Power Components", unit: "each", costPrice: 320, sellingPrice: 425, stock: 6, minimumStock: 3 },
  { name: "HEAVY DUTY CONNECTOR", sku: "HDC-001", category: "Connectors", unit: "each", costPrice: 45, sellingPrice: 65, stock: 50, minimumStock: 20 },
];

// Generate import script
const importScript = `
// Import these products into your system
// Copy and paste this into your browser console on the products page

const productsToImport = ${JSON.stringify(sampleProducts, null, 2)};

console.log('🚀 Starting bulk product import...');
console.log(\`📦 Importing \${productsToImport.length} products\`);

let imported = 0;
let errors = 0;

productsToImport.forEach((product, index) => {
  try {
    // Add unique ID
    const productWithId = {
      id: 'bulk-' + Date.now() + '-' + index,
      ...product,
      description: \`Imported product: \${product.name}\`
    };
    
    // Import using the createProduct function
    createProduct(productWithId);
    imported++;
    console.log(\`✅ [\${index + 1}/\${productsToImport.length}] Imported: \${product.name}\`);
  } catch (error) {
    errors++;
    console.error(\`❌ [\${index + 1}/\${productsToImport.length}] Failed: \${product.name}\`, error);
  }
});

console.log(\`\\n📊 Import Summary:\`);
console.log(\`✅ Successfully imported: \${imported} products\`);
console.log(\`❌ Errors: \${errors} products\`);
console.log(\`🎉 Import complete! Refresh the page to see your products.\`);
`;

console.log('📦 BULK PRODUCT IMPORT TOOL');
console.log('============================');
console.log(`Generated import script for ${sampleProducts.length} sample products`);
console.log('');
console.log('🔧 INSTRUCTIONS:');
console.log('1. Go to your Products page in the browser');
console.log('2. Open browser console (F12)');
console.log('3. Copy and paste the generated script');
console.log('4. Press Enter to run the import');
console.log('');
console.log('📝 Generated script saved to: bulk-import-script.js');

// Save the import script to a file
fs.writeFileSync('bulk-import-script.js', importScript);

console.log('✅ Ready to import products!');
console.log('');
console.log('🔍 SEARCH TEST PRODUCTS INCLUDED:');
console.log('- Type "h" to find "HORIZONTAL BEAM SUPPORT"');
console.log('- Type "power" to find "POWER SKIRT ASSEMBLY"');
console.log('- Type "skirt" to find "POWER SKIRT ASSEMBLY"');
console.log('- All RF27 and RF50 series products for comprehensive testing');