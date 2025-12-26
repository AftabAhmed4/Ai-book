import React from 'react';
import OriginalDocItem from '@theme-original/DocItem';
import ChatBot from '@site/src/components/ChatBot';

export default function DocItem(props) {
  return (
    <>
      <OriginalDocItem {...props} />
      <ChatBot />
    </>
  );
}