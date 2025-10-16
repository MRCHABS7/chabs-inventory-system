#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🔍 TESTING DATABASE SETUP...');
console.log('=' .repeat(40));

// Read environment variables
const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1];
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1];
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('📊 Checking database tables...');
  
  const tables = [
    'products',
    'customers', 
    'suppliers',
    'orders',
    'quotations',
    'purchase_orders'
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table}': OK`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}': ${err.message}`);
      allTablesExist = false;
    }
  }
  
  if (allTablesExist) {
    console.log('\n🎉 ALL TABLES CREATED SUCCESSFULLY!');
    console.log('✅ Database is ready for deployment');
    
    // Test inserting sample data
    console.log('\n🧪 Testing data insertion...');
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: 'Test Product',
            selling_price: 99.99,
            stock_quantity: 10
          }
        ])
        .select();
      
      if (error) {
        console.log('⚠️  Data insertion test failed:', error.message);
      } else {
        console.log('✅ Data insertion test successful');
        
        // Clean up test data
        if (data && data[0]) {
          await supabase
            .from('products')
            .delete()
            .eq('id', data[0].id);
          console.log('✅ Test data cleaned up');
        }
      }
    } catch (err) {
      console.log('⚠️  Data insertion test error:', err.message);
    }
    
  } else {
    console.log('\n❌ SOME TABLES ARE MISSING!');
    console.log('Please run the SQL script in Supabase SQL Editor');
  }
  
  return allTablesExist;
}

testDatabase();