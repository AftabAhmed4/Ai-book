# RAG-Based Chatbot for Educational Content

This project implements a Retrieval-Augmented Generation (RAG) chatbot that allows students to ask questions about textbook content and receive AI-generated answers based on the provided materials.

## Features

- Natural language querying of textbook content
- Context-aware responses using vector similarity search
- Support for both OpenAI and Google Gemini APIs
- Session management to maintain conversation context
- RESTful API for easy integration with other applications

## Prerequisites

- Python 3.11+
- Docker and Docker Compose (for Qdrant vector database)
- API keys for OpenAI and Google Generative AI (for Gemini)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Set up the Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys and configuration
   ```

4. Start the Qdrant vector database:
   ```bash
   docker-compose up -d qdrant
   ```

## Running the Application

### Development Mode

```bash
python start_server.py
```

The API will be available at `http://localhost:8000`

### Using Uvicorn Directly

```bash
cd backend
uvicorn src.api.main:app --reload --port 8000
```

## API Usage

### Chat Endpoint

Send a question to the chatbot:

```bash
curl -X POST "http://localhost:8000/chat/" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain quantum computing in simple terms"
  }'
```

### Session-Based Chat

Create a session for maintaining context:

```bash
curl -X POST "http://localhost:8000/chat/session" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123"
  }'
```

Then use the returned session ID in chat requests:

```bash
curl -X POST "http://localhost:8000/chat/" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What was the first concept you explained?",
    "sessionId": "session-id-from-previous-request"
  }'
```

## Architecture

The application follows a service-oriented architecture:

- **Models**: Pydantic models for data validation and serialization
- **Services**: Business logic including RAG, vector storage, and AI providers
- **API Routes**: FastAPI endpoints for handling requests
- **Vector Store**: Qdrant for semantic search capabilities
- **AI Providers**: Abstraction layer supporting both OpenAI and Google Gemini

## Configuration

The application can be configured via environment variables in the `.env` file:

- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_API_KEY`: Your Google Generative AI API key
- `QDRANT_URL`: URL for the Qdrant vector database
- `AI_PROVIDER`: Either 'openai' or 'gemini'
- `DEFAULT_EMBEDDING_MODEL`: Model for generating embeddings
- `DEFAULT_LLM_MODEL`: Model for generating responses

## Indexing Book Content

To index book content for the chatbot to use:

1. Create BookContent objects with your textbook content
2. Use the RAGService to index the content:

```python
from backend.src.services.rag_service import RAGService
from backend.src.models.book_content import BookContent

rag_service = RAGService()

# Create book content with proper structure
book_content = BookContent.create_new(
    title="Chapter 1: Introduction to AI",
    content="Artificial Intelligence is a branch of computer science...",
    source_reference="book1-chapter1"
)

# Index the content
await rag_service.index_book_content(book_content)
```

## Testing

Run the unit tests:

```bash
cd backend
python -m pytest tests/unit/
```

## Docker Deployment

To run the entire application using Docker:

```bash
docker-compose up --build
```

## Project Structure

```
backend/
├── src/
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   └── api/
│       ├── main.py      # FastAPI application
│       └── routes/      # API endpoints
├── tests/              # Unit and integration tests
├── requirements.txt    # Python dependencies
└── config.py           # Configuration settings
```

## Next Steps

- Implement more sophisticated content indexing
- Add support for multiple textbooks
- Enhance the frontend integration for textbook interfaces
- Implement analytics and usage tracking
- Add more comprehensive error handling and fallback mechanisms