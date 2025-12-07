import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'AI-Native Content',
    description: (
      <>
        Content generated with AI tools and refined by human experts for maximum quality and efficiency.
      </>
    ),
  },
  {
    title: 'Modular Learning',
    description: (
      <>
        Organized into self-contained modules that can be studied independently, allowing for flexible learning paths.
      </>
    ),
  },
  {
    title: 'Practical Applications',
    description: (
      <>
        Each concept includes practical examples, labs, and exercises to reinforce learning through hands-on experience.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}