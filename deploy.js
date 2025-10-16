#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting CHABS Deployment Process...\n');

// Step 1: Clean previous builds
console.log('1. Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  console.log('✅ Build directories cleaned\n');
} catch (error) {
  console.log('⚠️  Warning: Could not clean all directories\n');
}

// Step 2: Install dependencies
console.log('2. Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Step 3: Run build
console.log('3. Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 4: Verify static export (handled by build)
console.log('4. Verifying static export...');
console.log('ℹ️  Static export is handled automatically by Next.js build\n');

// Step 5: Verify output
console.log('5. Verifying output...');
if (fs.existsSync('out') && fs.existsSync('out/index.html')) {
  console.log('✅ Static files generated successfully');
  console.log('📁 Output directory: ./out');
  
  // List key files
  const files = fs.readdirSync('out');
  console.log('📄 Generated files:', files.slice(0, 10).join(', '));
  if (files.length > 10) {
    console.log(`   ... and ${files.length - 10} more files`);
  }
} else {
  console.error('❌ Output verification failed');
  process.exit(1);
}

console.log('\n🎉 Deployment preparation completed!');
console.log('\n📋 Next Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your GitHub repo to Netlify');
console.log('3. Deploy automatically or manually upload the "out" folder');
console.log('\n🌐 Your app will be available at: https://your-app-name.netlify.app');