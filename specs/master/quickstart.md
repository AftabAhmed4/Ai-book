# Quickstart: Physical AI & Humanoid Robotics Textbook

**Feature**: Physical AI & Humanoid Robotics Textbook
**Date**: 2025-12-07
**Author**: AI Assistant

## Getting Started

This guide will help you get up and running with the Physical AI & Humanoid Robotics textbook development environment.

### Prerequisites

- Node.js (version 18.x or higher)
- Git
- A code editor (VS Code recommended)
- Access to AI tools (Claude Code or Qwen Code)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Docusaurus development server**
   ```bash
   npm start
   ```
   This will start a local development server at `http://localhost:3000` with live reloading.

4. **Verify the setup**
   - Navigate to `http://localhost:3000` in your browser
   - You should see the textbook homepage
   - Make a small change to a markdown file to verify live reloading works

### Adding New Content

1. **To add a new chapter**, create a new directory in `docs/textbook/`:
   ```bash
   mkdir docs/textbook/chapterX
   touch docs/textbook/chapterX/intro.md
   ```

2. **To add a new module**, create markdown files in the appropriate chapter directory:
   - `theory.md` - Theoretical content
   - `practical.md` - Practical applications
   - `exercises.md` - Exercises and problems

3. **Update the `book.yaml`** to include your new chapter/module in the navigation structure

### Using AI Tools for Content Generation

1. **For content drafting**:
   - Use Claude Code or Qwen Code to generate initial drafts
   - Follow the modular structure outlined in the data model
   - Include learning objectives and exercises in the initial draft

2. **For diagram generation**:
   - Describe the diagram needed in text format
   - Use AI tools to generate SVG diagrams or other visual assets
   - Place generated diagrams in `static/img/diagrams/`

3. **For code examples**:
   - Use AI to generate code examples that match the theoretical content
   - Place code files in appropriate language directories under `static/code/`
   - Verify code examples compile and run as expected

### Building for Production

To build the static site for deployment:

```bash
npm run build
```

This will generate the complete static site in the `build/` directory.

### Deployment

The textbook is deployed automatically via GitHub Pages when changes are merged to the main branch. To deploy manually:

1. Build the site: `npm run build`
2. Push changes to the `gh-pages` branch or merge to `main`