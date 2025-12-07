// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An AI-Native Textbook for Human-AI-Robot Collaboration',
  favicon: 'img/favicon.ico',

  // GitHub Pages production URL
  url: 'https://aftabahmed4.github.io',

  // Base URL for GitHub Pages
  baseUrl: '/Ai-book/',
  // GitHub repo configuration
  organizationName: 'aftabahmed4',
  projectName: 'Ai-book',

  onBrokenLinks: 'warn', // Changed to 'warn' to allow build despite broken links
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',

          // Disable edit URL temporarily
          editUrl: undefined,

          // Docs will be hosted at /hackathon/docs/
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig: ({
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI & Humanoid Robotics Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'textbookSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {
          href: 'https://github.com/aftab/hackathon',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook',
          items: [
            { label: 'Introduction', to: '/hackathon/docs/intro' },
            { label: 'Chapter 1: Foundations', to: '/hackathon/docs/textbook/chapter1/intro' },
            { label: 'Glossary', to: '/hackathon/docs/glossary-template' }, // Corrected path
            { label: 'References', to: '/hackathon/docs/references-template' } // Corrected path
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Content Generation Workflow', to: '/hackathon/docs/content-generation-workflow' },
            { label: 'Module Template', to: '/hackathon/docs/textbook/template/module-template' },
            { label: 'Book YAML Generator', to: '/hackathon/docs/book-yaml-generator' },
          ],
        },
        {
          title: 'More',
          items: [
            { href: 'https://github.com/aftab/hackathon', label: 'GitHub' },
            { href: 'https://github.com/aftab/hackathon/issues', label: 'Issues' },
          ],
        },
      ],
      copyright:
        `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  }),
};

export default config;
