#!/usr/bin/env python3
"""
RAG Chatbot - Startup Script

This script starts the RAG-based chatbot API server.
"""
import uvicorn
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def main():
    print("Starting RAG Chatbot API Server...")
    print("Loading configuration from environment variables...")
    
    # Check if required environment variables are set
    required_vars = ['OPENAI_API_KEY', 'GOOGLE_API_KEY', 'QDRANT_URL']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Warning: Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file before running in production.")
    
    # Start the server
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    print(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "backend.src.api.main:app",
        host=host,
        port=port,
        reload=True if os.getenv("ENVIRONMENT") != "production" else False,
        log_level="info"
    )

if __name__ == "__main__":
    main()