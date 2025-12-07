// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An AI-Native Textbook for Human-AI-Robot Collaboration',
  favicon: 'img/favicon.ico',

  // GitHub Pages production URL - assuming root deployment for now
  url: 'https://AftabAhmed4.github.io',
  // Temporary fix: Using root baseUrl to test if that solves the loading issue
  baseUrl: '/',
  // GitHub Pages adds a trailing slash by default, so let's match that behavior
  trailingSlash: true,

  // GitHub repo configuration
  organizationName: 'AftabAhmed4',
  projectName: 'Ai-book',

  onBrokenLinks: 'warn', // Changed to 'warn' to allow build despite broken links during development
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

          // Update edit URL to your actual repository
          editUrl: 'https://github.com/AftabAhmed4/Ai-book/edit/main/',

          // Docs will be hosted at / (due to base URL change) 
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
          href: 'https://github.com/AftabAhmed4/Ai-book',
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
            { label: 'Introduction', to: '/docs/intro/' },
            { label: 'Chapter 1: Foundations', to: '/docs/textbook/chapter1/intro/' },
            { label: 'Glossary', to: '/docs/glossary-template/' },
            { label: 'References', to: '/docs/references-template/' }
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Content Generation Workflow', to: '/docs/content-generation-workflow/' },
            { label: 'Module Template', to: '/docs/textbook/template/module-template/' },
            { label: 'Book YAML Generator', to: '/docs/book-yaml-generator/' },
          ],
        },
        {
          title: 'More',
          items: [
            { href: 'https://github.com/AftabAhmed4/Ai-book', label: 'GitHub' },
            { href: 'https://github.com/AftabAhmed4/Ai-book/issues', label: 'Issues' },
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
