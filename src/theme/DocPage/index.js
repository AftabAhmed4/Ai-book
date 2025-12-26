import React from 'react';
import OriginalDocPage from '@theme-original/DocPage';
import ChatBot from '@site/src/components/ChatBot';

export default function DocPage(props) {
  return (
    <>
      <OriginalDocPage {...props} />
      <ChatBot />
    </>
  );
}