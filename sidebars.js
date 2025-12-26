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
      label: 'Chapter 2: Sensory Systems and Perception',
      items: [
        'textbook/chapter2/intro',
        'textbook/chapter2/theory',
        'textbook/chapter2/practical',
        'textbook/chapter2/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Motor Control and Actuation Systems',
      items: [
        'textbook/chapter3/intro',
        'textbook/chapter3/theory',
        'textbook/chapter3/practical',
        'textbook/chapter3/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 4: Motion Planning and Navigation',
      items: [
        'textbook/chapter4/intro',
        'textbook/chapter4/theory',
        'textbook/chapter4/practical',
        'textbook/chapter4/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 5: Human-Robot Interaction and Social Robotics',
      items: [
        'textbook/chapter5/intro',
        'textbook/chapter5/theory',
        'textbook/chapter5/practical',
        'textbook/chapter5/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'glossary-template',
        'references-template',
        'chatbot',  // Added chatbot documentation
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