# Deployment script for Physical AI & Humanoid Robotics textbook

# This script will build and deploy the Docusaurus site to GitHub Pages
# Make sure to run this from the project root directory

# Install dependencies
npm install

# Build the static site
npm run build

# Deploy to GitHub Pages
# This assumes you have properly configured your GitHub repository for GitHub Pages
npx docusaurus deploy