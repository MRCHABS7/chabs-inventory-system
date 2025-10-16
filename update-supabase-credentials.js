#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

console.log('🔧 SUPABASE CREDENTIALS UPDATER');
console.log('=' .repeat(40));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateCredentials() {
  console.log('\n📝 Please enter your NEW Supabase credentials:');
  console.log('(Get these from Supabase → Settings → API)\n');
  
  const newUrl = await askQuestion('🌐 Enter your Supabase URL (https://xxxxx.supabase.co): ');
  const newKey = await askQuestion('🔑 Enter your Supabase anon key (eyJhbGc...): ');
  
  if (!newUrl || !newKey) {
    console.log('❌ Both URL and key are required!');
    rl.close();
    return;
  }
  
  if (!newUrl.includes('supabase.co')) {
    console.log('❌ URL should be in format: https://xxxxx.supabase.co');
    rl.close();
    return;
  }
  
  if (!newKey.startsWith('eyJ')) {
    console.log('❌ Anon key should start with "eyJ"');
    rl.close();
    return;
  }
  
  try {
    // Read current .env.local
    let envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Replace the URL and key
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_URL=.*/,
      `NEXT_PUBLIC_SUPABASE_URL=${newUrl}`
    );
    
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${newKey}`
    );
    
    // Write back to file
    fs.writeFileSync('.env.local', envContent);
    
    console.log('\n✅ Credentials updated successfully!');
    console.log('\n📋 Updated .env.local with:');
    console.log(`   URL: ${newUrl}`);
    console.log(`   Key: ${newKey.substring(0, 20)}...`);
    
    console.log('\n🔄 Next steps:');
    console.log('1. Test connection: node simple-supabase-test.js');
    console.log('2. Set up database: Copy supabase-setup-simple.sql to Supabase SQL Editor');
    console.log('3. Test locally: npm run dev');
    
  } catch (error) {
    console.log('❌ Error updating file:', error.message);
  }
  
  rl.close();
}

updateCredentials();