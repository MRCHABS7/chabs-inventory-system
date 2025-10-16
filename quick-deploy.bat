@echo off
echo 🚀 CHABS Quick Deployment Script
echo.

echo Step 1: Adding files to Git...
git add .

echo Step 2: Committing changes...
git commit -m "CHABS v2.0.0 - Complete inventory management system"

echo Step 3: Setting up remote origin...
echo Please enter your GitHub username:
set /p username="GitHub Username: "
git remote add origin https://github.com/%username%/chabs-inventory-system.git

echo Step 4: Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo 📋 Next Steps:
echo 1. Go to https://supabase.com and create a new project
echo 2. Follow SUPABASE-SETUP-GUIDE.md to setup database
echo 3. Go to https://netlify.com and connect your GitHub repo
echo 4. Follow GITHUB-NETLIFY-DEPLOYMENT.md for deployment
echo.
echo 🎉 Your CHABS system will be live in minutes!
pause