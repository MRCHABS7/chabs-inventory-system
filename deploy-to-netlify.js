#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 NETLIFY DEPLOYMENT AUTOMATION');
console.log('=' .repeat(50));

const runCommand = (command, description) => {
  try {
    console.log(`\n🔧 ${description}...`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    console.log(`Error: ${error.message}`);
    return false;
  }
};

const checkEnvironment = () => {
  console.log('\n🔍 Checking environment...');
  
  if (!fs.existsSync('.env.local')) {
    console.log('❌ .env.local not found');
    return false;
  }
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('❌ Missing Supabase credentials in .env.local');
    console.log('Please update your Supabase URL and key first');
    return false;
  }
  
  console.log('✅ Environment variables configured');
  return true;
};

const deployToNetlify = async () => {
  console.log('\n🚀 Starting deployment process...');
  
  // Step 1: Check environment
  if (!checkEnvironment()) {
    console.log('\n❌ Environment check failed. Please fix issues and try again.');
    return;
  }
  
  // Step 2: Install dependencies
  if (!runCommand('npm install', 'Installing dependencies')) {
    return;
  }
  
  // Step 3: Run build test
  if (!runCommand('npm run build', 'Testing production build')) {
    console.log('\n❌ Build failed. Please fix build errors and try again.');
    return;
  }
  
  // Step 4: Git operations
  console.log('\n📝 Preparing Git...');
  
  try {
    // Check if git is initialized
    execSync('git status', { stdio: 'pipe' });
  } catch (error) {
    console.log('🔧 Initializing Git repository...');
    runCommand('git init', 'Initialize Git');
  }
  
  // Add and commit files
  runCommand('git add .', 'Adding files to Git');
  
  try {
    runCommand('git commit -m "Deploy to Netlify - CHABS Inventory System"', 'Committing changes');
  } catch (error) {
    console.log('ℹ️  No changes to commit or already committed');
  }
  
  // Step 5: Instructions for Netlify
  console.log('\n' + '='.repeat(50));
  console.log('🎉 READY FOR NETLIFY DEPLOYMENT!');
  console.log('='.repeat(50));
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Push to GitHub:');
  console.log('   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git');
  console.log('   git branch -M main');
  console.log('   git push -u origin main');
  
  console.log('\n2. Deploy on Netlify:');
  console.log('   - Go to https://netlify.com');
  console.log('   - Click "Add new site" → "Import an existing project"');
  console.log('   - Connect your GitHub repository');
  console.log('   - Build settings are already configured in netlify.toml');
  
  console.log('\n3. Add Environment Variables in Netlify:');
  console.log('   Site Settings → Environment Variables → Add:');
  
  // Read and display current environment variables
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n').filter(line => 
    line.startsWith('NEXT_PUBLIC_') || line.startsWith('NODE_ENV=')
  );
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      console.log(`   ${line}`);
    }
  });
  
  console.log('\n4. Test Your Live Site:');
  console.log('   - Wait for deployment to complete');
  console.log('   - Visit your Netlify URL');
  console.log('   - Test login and basic functionality');
  
  console.log('\n🌐 Your site will be live at: https://YOUR-SITE-NAME.netlify.app');
  console.log('\n📚 For detailed instructions, see: NETLIFY-DEPLOYMENT-GUIDE.md');
};

deployToNetlify().catch(console.error);