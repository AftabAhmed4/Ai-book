import React from 'react';
import ChatBot from '@site/src/components/ChatBot';

// A wrapper component to add the chatbot globally
export default function Root({ children }) {
  return React.createElement(
    React.Fragment,
    null,
    children,
    React.createElement(ChatBot, null)
  );
}