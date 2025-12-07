# PowerShell deployment script for Physical AI & Humanoid Robotics textbook

# This script will build and deploy the Docusaurus site to GitHub Pages
# Make sure to run this from the project root directory

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Building the site..." -ForegroundColor Green
npm run build

Write-Host "Deploying to GitHub Pages..." -ForegroundColor Green
npx docusaurus deploy

Write-Host "Deployment complete!" -ForegroundColor Green