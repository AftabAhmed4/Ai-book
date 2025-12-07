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

  onBrokenLinks: 'throw',
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

          // Correct GitHub Editing URL for your repo
          editUrl: 'https://github.com/aftabahmed4/Ai-book/edit/main/',

          // Docs will be hosted at /Ai-book/docs/
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
          href: 'https://github.com/aftabahmed4/Ai-book',
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
            { label: 'Introduction', to: '/Ai-book/docs/intro' },
            { label: 'Chapter 1: Foundations', to: '/Ai-book/docs/textbook/chapter1/intro' },
            { label: 'Glossary', to: '/Ai-book/docs/glossary' },
            { label: 'References', to: '/Ai-book/docs/references' }
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Content Generation Workflow', to: '/Ai-book/docs/content-generation-workflow' },
            { label: 'Module Template', to: '/Ai-book/docs/textbook/template/module-template' },
            { label: 'Book YAML Generator', to: '/Ai-book/docs/book-yaml-generator' },
          ],
        },
        {
          title: 'More',
          items: [
            { href: 'https://github.com/aftabahmed4/Ai-book', label: 'GitHub' },
            { href: 'https://github.com/aftabahmed4/Ai-book/issues', label: 'Issues' },
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
