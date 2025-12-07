// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  textbookSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Chapter 1: Foundations of Physical AI',
      items: [
        'textbook/chapter1/intro',
        'textbook/chapter1/theory',
        'textbook/chapter1/practical',
        'textbook/chapter1/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'glossary-template',
        'references-template',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      items: [
        'book-yaml-generator',
        'content-generation-workflow',
        'textbook/template/module-template',
        'textbook/template/module-metadata-schema',
      ],
    },
  ],
};

export default sidebars;