#!/usr/bin/env node

console.log('🔍 SIMPLE SUPABASE TEST...');
console.log('=' .repeat(40));

// Read environment variables manually
const fs = require('fs');
const path = require('path');

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('✅ .env.local file found');
  
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
  
  console.log(`📡 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseKey ? 'Found (' + supabaseKey.length + ' chars)' : 'Not found'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials');
    process.exit(1);
  }
  
  // Test basic HTTP connection
  console.log('\n🌐 Testing HTTP connection...');
  
  const https = require('https');
  const url = new URL(supabaseUrl);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: '/rest/v1/',
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  };
  
  const req = https.request(options, (res) => {
    console.log(`✅ HTTP Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('🎉 Supabase connection successful!');
    } else {
      console.log('⚠️  Unexpected status code');
    }
  });
  
  req.on('error', (error) => {
    console.log('❌ Connection error:', error.message);
  });
  
  req.setTimeout(10000, () => {
    console.log('❌ Connection timeout');
    req.destroy();
  });
  
  req.end();
  
} catch (error) {
  console.log('❌ Error:', error.message);
}