---
sidebar_position: 99
---

# AI Chatbot Assistant

## Overview

This textbook features an integrated AI chatbot assistant that can answer questions about Physical AI & Humanoid Robotics based on the content of this textbook. The assistant uses a Retrieval Augmented Generation (RAG) system to provide accurate and contextually relevant responses.

## How to Use

The chatbot is available as a floating button on the bottom right corner of every page. Simply click the 💬 icon to open the chat interface, type your question, and press Send.

## Backend Setup

To use the chatbot, you need to run the backend server:

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   # or if using poetry
   poetry install
   ```

3. Set up your environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   COHERE_API_KEY=your_cohere_api_key_here
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   ```

4. Start the backend server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

5. The chatbot will now be able to connect to the backend at `https://ai-book-nine-navy.vercel.app/chat`

## Troubleshooting

- If the chatbot shows a connection error, make sure the backend server is running
- Check that the correct API keys are configured in your `.env` file
- Verify that port 8000 is not being used by another application

## Features

- Context-aware responses based on textbook content
- Conversational interface
- Responsive design that works on all devices
- Dark/light mode support matching the textbook theme
- Error handling and timeout management