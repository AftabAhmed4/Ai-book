import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to implement timeout for fetch
  const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the backend API with timeout
      const response = await fetchWithTimeout('https://ai-book-nine-navy.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      }, 30000); // 30 second timeout

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      const botMessage = {
        role: 'bot',
        content: data.response || "Sorry, I didn't receive a response from the server."
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The server might be taking too long to respond.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the AI backend. Please ensure the backend server is running at https://ai-book-nine-navy.vercel.app.';
      }

      const errorBotMessage = {
        role: 'bot',
        content: errorMessage
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`${styles.chatFloatButton} chatbot-float-button`}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* Chat Container */}
      {isOpen && (
        <div
          className={`${styles.chatContainer} chatbot-container`}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '380px',
            height: '500px',
            backgroundColor: 'var(--ifm-background-color)',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: '1000',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          {/* Chat Header */}
          <div
            className="chatbot-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: 'var(--ifm-card-background-color)',
              color: 'var(--ifm-color-content)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottom: '1px solid var(--ifm-color-emphasis-300)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px' }}>AI Textbook Assistant</h3>
            <button
              onClick={closeChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ifm-color-emphasis-600)',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div
            className="chatbot-messages"
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              backgroundColor: 'var(--ifm-card-background-color)',
              color: 'var(--ifm-color-content)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'var(--ifm-color-emphasis-600)',
                  padding: '20px',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🤖</div>
                <h4>Hello! I'm your AI textbook assistant</h4>
                <p>Ask me anything about Physical AI & Humanoid Robotics</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: msg.role === 'user'
                      ? 'var(--ifm-color-primary-lighter)'
                      : 'var(--ifm-color-emphasis-200)',
                    color: 'var(--ifm-color-content)',
                  }}
                >
                  {msg.content}
                </div>
              ))
            )}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: 'var(--ifm-color-emphasis-200)',
                  color: 'var(--ifm-color-content)',
                }}
              >
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSubmit}
            className="chatbot-input-form"
            style={{
              display: 'flex',
              padding: '12px',
              backgroundColor: 'var(--ifm-card-background-color)',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              borderTop: '1px solid var(--ifm-color-emphasis-300)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Physical AI & Robotics..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-surface-color)',
                color: 'var(--ifm-color-content)',
                marginRight: '8px',
              }}
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              style={{
                padding: '12px 20px',
                backgroundColor: inputValue.trim() && !isLoading
                  ? 'var(--ifm-color-primary)'
                  : 'var(--ifm-color-emphasis-200)',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontWeight: '500',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;