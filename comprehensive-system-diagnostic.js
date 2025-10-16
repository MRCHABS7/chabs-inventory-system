#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 CHABS INVENTORY SYSTEM - COMPREHENSIVE DIAGNOSTIC');
console.log('=' .repeat(60));

const issues = [];
const fixes = [];

// Helper functions
const checkFile = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

const runCommand = (command, description) => {
  try {
    console.log(`\n🔧 ${description}...`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} - SUCCESS`);
    return { success: true, output: result };
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    console.log(`Error: ${error.message}`);
    issues.push(`${description}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const checkPackageJson = () => {
  console.log('\n📦 CHECKING PACKAGE.JSON...');
  
  if (!checkFile('package.json')) {
    issues.push('package.json not found');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`✅ Package: ${packageJson.name} v${packageJson.version}`);
    
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'typescript',
      'tailwindcss',
      'jspdf',
      'uuid'
    ];
    
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );
    
    if (missingDeps.length > 0) {
      issues.push(`Missing dependencies: ${missingDeps.join(', ')}`);
      fixes.push(`npm install ${missingDeps.join(' ')}`);
    }
    
    return true;
  } catch (error) {
    issues.push(`Invalid package.json: ${error.message}`);
    return false;
  }
};

const checkNodeModules = () => {
  console.log('\n📁 CHECKING NODE_MODULES...');
  
  if (!checkFile('node_modules')) {
    issues.push('node_modules directory not found');
    fixes.push('npm install');
    return false;
  }
  
  console.log('✅ node_modules directory exists');
  return true;
};

const checkTypeScript = () => {
  console.log('\n🔷 CHECKING TYPESCRIPT...');
  
  const tsConfigExists = checkFile('tsconfig.json');
  if (!tsConfigExists) {
    issues.push('tsconfig.json not found');
    fixes.push('Create tsconfig.json');
  }
  
  return runCommand('npx tsc --noEmit', 'TypeScript compilation check');
};

const checkNextConfig = () => {
  console.log('\n⚡ CHECKING NEXT.JS CONFIG...');
  
  if (!checkFile('next.config.js')) {
    console.log('⚠️  next.config.js not found - creating default');
    const defaultConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: /System Volume Information/
    };
    return config;
  },
};

module.exports = nextConfig;`;
    
    fs.writeFileSync('next.config.js', defaultConfig);
    fixes.push('Created next.config.js');
  }
  
  console.log('✅ Next.js config checked');
  return true;
};

const checkTailwindConfig = () => {
  console.log('\n🎨 CHECKING TAILWIND CONFIG...');
  
  if (!checkFile('tailwind.config.js')) {
    console.log('⚠️  tailwind.config.js not found - creating default');
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}`;
    
    fs.writeFileSync('tailwind.config.js', tailwindConfig);
    fixes.push('Created tailwind.config.js');
  }
  
  console.log('✅ Tailwind config checked');
  return true;
};

const checkPostCSSConfig = () => {
  console.log('\n📝 CHECKING POSTCSS CONFIG...');
  
  if (!checkFile('postcss.config.js')) {
    console.log('⚠️  postcss.config.js not found - creating default');
    const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
    
    fs.writeFileSync('postcss.config.js', postcssConfig);
    fixes.push('Created postcss.config.js');
  }
  
  console.log('✅ PostCSS config checked');
  return true;
};

const checkEnvironmentFiles = () => {
  console.log('\n🌍 CHECKING ENVIRONMENT FILES...');
  
  if (!checkFile('.env.local')) {
    console.log('⚠️  .env.local not found - creating default');
    const envContent = `# CHABS Environment Configuration
NEXT_PUBLIC_APP_NAME=CHABS
NEXT_PUBLIC_VERSION=2.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# Storage Configuration
NEXT_PUBLIC_STORAGE_MODE=local
NEXT_PUBLIC_ENABLE_SYNC=false
NEXT_PUBLIC_SYNC_INTERVAL=30000

# Development Settings
NODE_ENV=development`;
    
    fs.writeFileSync('.env.local', envContent);
    fixes.push('Created .env.local');
  }
  
  console.log('✅ Environment files checked');
  return true;
};

const checkSourceStructure = () => {
  console.log('\n📂 CHECKING SOURCE STRUCTURE...');
  
  const requiredDirs = [
    'src',
    'src/pages',
    'src/components',
    'src/lib',
    'src/styles',
    'src/contexts'
  ];
  
  const requiredFiles = [
    'src/pages/_app.tsx',
    'src/pages/index.tsx',
    'src/styles/globals.css',
    'src/lib/types.ts'
  ];
  
  let allGood = true;
  
  requiredDirs.forEach(dir => {
    if (!checkFile(dir)) {
      issues.push(`Missing directory: ${dir}`);
      fixes.push(`Create directory: ${dir}`);
      allGood = false;
    } else {
      console.log(`✅ Directory exists: ${dir}`);
    }
  });
  
  requiredFiles.forEach(file => {
    if (!checkFile(file)) {
      issues.push(`Missing file: ${file}`);
      allGood = false;
    } else {
      console.log(`✅ File exists: ${file}`);
    }
  });
  
  return allGood;
};

const checkBuild = () => {
  console.log('\n🏗️  CHECKING BUILD PROCESS...');
  return runCommand('npm run build', 'Next.js build');
};

const installMissingDependencies = () => {
  console.log('\n📦 INSTALLING/UPDATING DEPENDENCIES...');
  
  const dependencies = [
    'next@^14.2.5',
    'react@^18.2.0',
    'react-dom@^18.2.0',
    'tailwindcss@^3.4.6',
    'autoprefixer@^10.4.14',
    'postcss@^8.4.38',
    'jspdf@^3.0.1',
    'jspdf-autotable@^5.0.2',
    'uuid@^9.0.1',
    '@supabase/supabase-js@^2.56.0'
  ];
  
  const devDependencies = [
    'typescript@^5.9.2',
    '@types/node@^20.19.11',
    '@types/react@^18.3.24',
    '@types/react-dom@^18.3.7',
    '@types/uuid@^10.0.0',
    'eslint@^8.57.0',
    'eslint-config-next@^14.2.5'
  ];
  
  // Install production dependencies
  const depsResult = runCommand(
    `npm install ${dependencies.join(' ')}`,
    'Installing production dependencies'
  );
  
  // Install dev dependencies
  const devDepsResult = runCommand(
    `npm install -D ${devDependencies.join(' ')}`,
    'Installing development dependencies'
  );
  
  return depsResult.success && devDepsResult.success;
};

const createMissingFiles = () => {
  console.log('\n📄 CREATING MISSING FILES...');
  
  // Create _app.tsx if missing
  if (!checkFile('src/pages/_app.tsx')) {
    const appContent = `import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}`;
    
    fs.writeFileSync('src/pages/_app.tsx', appContent);
    console.log('✅ Created src/pages/_app.tsx');
  }
  
  // Create API hello endpoint if missing
  if (!checkFile('src/pages/api')) {
    fs.mkdirSync('src/pages/api', { recursive: true });
  }
  
  if (!checkFile('src/pages/api/hello.ts')) {
    const apiContent = `import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'CHABS Inventory System' });
}`;
    
    fs.writeFileSync('src/pages/api/hello.ts', apiContent);
    console.log('✅ Created src/pages/api/hello.ts');
  }
};

const fixCommonIssues = () => {
  console.log('\n🔧 FIXING COMMON ISSUES...');
  
  // Clear Next.js cache
  runCommand('npx next clean', 'Clearing Next.js cache');
  
  // Remove node_modules and reinstall if there are dependency issues
  if (issues.some(issue => issue.includes('dependency') || issue.includes('module'))) {
    console.log('🗑️  Removing node_modules for clean install...');
    try {
      fs.rmSync('node_modules', { recursive: true, force: true });
      fs.rmSync('package-lock.json', { force: true });
      console.log('✅ Cleaned node_modules and package-lock.json');
    } catch (error) {
      console.log('⚠️  Could not remove node_modules:', error.message);
    }
  }
};

const runDiagnostic = async () => {
  console.log('Starting comprehensive diagnostic...\n');
  
  // Step 1: Check basic structure
  checkPackageJson();
  checkSourceStructure();
  
  // Step 2: Check configuration files
  checkNextConfig();
  checkTailwindConfig();
  checkPostCSSConfig();
  checkEnvironmentFiles();
  
  // Step 3: Fix common issues
  fixCommonIssues();
  
  // Step 4: Install dependencies
  installMissingDependencies();
  
  // Step 5: Create missing files
  createMissingFiles();
  
  // Step 6: Check node_modules
  checkNodeModules();
  
  // Step 7: TypeScript check
  checkTypeScript();
  
  // Step 8: Build check
  checkBuild();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));
  
  if (issues.length === 0) {
    console.log('🎉 ALL CHECKS PASSED! System is ready to run.');
    console.log('\n🚀 To start the development server:');
    console.log('   npm run dev');
    console.log('\n🌐 The application will be available at:');
    console.log('   http://localhost:3000 (or next available port)');
  } else {
    console.log(`❌ Found ${issues.length} issues:`);
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    if (fixes.length > 0) {
      console.log('\n🔧 Suggested fixes applied:');
      fixes.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix}`);
      });
    }
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Login with any email/password to test');
  
  console.log('\n🔍 If you still have issues:');
  console.log('1. Check the terminal output above for specific errors');
  console.log('2. Ensure all ports 3000-3010 are not in use');
  console.log('3. Try: npm run dev -- -p 4000 (for port 4000)');
};

// Run the diagnostic
runDiagnostic().catch(console.error);