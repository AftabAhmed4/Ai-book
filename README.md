# Physical AI & Humanoid Robotics Textbook

An AI-Native Textbook for Human-AI-Robot Collaboration

## About

This is a comprehensive textbook on Physical AI and Humanoid Robotics, designed for advanced undergraduate and graduate students, researchers, and engineers working in robotics and AI.

The textbook uses an AI-native approach to content development, combining AI-generated content with human expert review to ensure technical accuracy and pedagogical effectiveness.

## Features

- **AI-Native Content Development**: Content generated using AI tools with human expert review
- **Modular Academic Structure**: Self-contained modules that can be studied independently
- **Technical Accuracy**: Verified against current research and industry standards
- **Practical Application Focus**: Each concept includes practical examples, labs, and exercises
- **Human-AI Collaboration Centric**: Emphasizes collaboration between humans, AI, and robotic systems
- **Multi-Modal Learning Support**: Includes text, diagrams, code samples, and interactive elements

## Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

If you need to deploy manually:

**Using GitHub Actions (recommended):**
1. Push your changes to the `main` branch
2. The site will automatically be built and deployed via the GitHub Actions workflow

**Using Docusaurus CLI:**
1. Ensure you have the correct GitHub organization and project name in `docusaurus.config.js`
2. Run `npm run build` to build the static site
3. Run `npx docusaurus deploy` to deploy to GitHub Pages

**Using deployment script (Windows):**
1. Run `.\deploy.ps1` from the project root

**Using deployment script (Unix/Linux):**
1. Run `./deploy.sh` from the project root

## Local Development

1. Install dependencies: `npm install`
2. Start local development server: `npm start`
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

We welcome contributions to improve the textbook. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This textbook is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.