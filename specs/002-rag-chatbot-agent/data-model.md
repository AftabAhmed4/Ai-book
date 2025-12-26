# Data Model: RAG-Based Chatbot for Educational Content

## Core Entities

### BookContent
- **id**: string (UUID) - Unique identifier for each piece of book content
- **title**: string - Title of the book section or chapter
- **content**: text - The actual text content of the book section
- **metadata**: object - Additional information (author, chapter number, etc.)
- **embedding**: vector - Vector representation for semantic search
- **source_reference**: string - Reference to the original book location
- **created_at**: datetime - Timestamp when the content was processed
- **updated_at**: datetime - Timestamp when the content was last updated

### UserQuery
- **id**: string (UUID) - Unique identifier for each query
- **query_text**: text - The natural language question from the user
- **embedding**: vector - Vector representation of the query for similarity matching
- **session_id**: string - ID of the conversation session (for context retention)
- **created_at**: datetime - Timestamp when the query was submitted
- **processed**: boolean - Whether the query has been processed

### ChatSession
- **id**: string (UUID) - Unique identifier for each conversation session
- **user_id**: string (optional) - ID of the user (if authenticated)
- **context_window**: array - List of previous interactions for context
- **created_at**: datetime - Timestamp when the session started
- **updated_at**: datetime - Timestamp of the last interaction
- **is_active**: boolean - Whether the session is still active

### AIResponse
- **id**: string (UUID) - Unique identifier for each response
- **session_id**: string - ID of the session this response belongs to
- **query_id**: string - ID of the query that generated this response
- **response_text**: text - The AI-generated answer to the user's query
- **source_chunks**: array - IDs of the book content chunks used to generate the response
- **confidence_score**: float - Confidence level of the response (0.0-1.0)
- **created_at**: datetime - Timestamp when the response was generated

### VectorEmbedding
- **id**: string (UUID) - Unique identifier for each embedding
- **content_id**: string - Reference to the original content
- **model_used**: string - Name of the model used to generate the embedding
- **embedding_data**: vector - The actual embedding values
- **created_at**: datetime - Timestamp when the embedding was generated

## Relationships

1. **BookContent** → **VectorEmbedding** (1:1)
   - Each piece of book content has exactly one vector embedding
   
2. **ChatSession** → **UserQuery** (1:many)
   - Each session can have multiple user queries over time
   
3. **UserQuery** → **AIResponse** (1:1)
   - Each query generates one response
   
4. **AIResponse** → **BookContent** (many:many through source_chunks)
   - Each response can reference multiple content chunks used in its generation

## Validation Rules

- BookContent:
  - Content must be non-empty (min length: 10 characters)
  - Title must be provided
  - Embedding must be a valid vector of expected dimensions

- UserQuery:
  - Query text must be non-empty (min length: 3 characters)
  - Session ID must be valid if provided

- ChatSession:
  - Session must have unique ID
  - Context window should not exceed 10 interactions to maintain performance

- AIResponse:
  - Response text must be non-empty
  - Confidence score must be between 0.0 and 1.0
  - Must have valid references to source content chunks

## State Transitions

### ChatSession States
- `created` → `active` when first query is received
- `active` → `inactive` after timeout period (30 minutes) or explicit end
- `inactive` → `archived` after a longer period (30 days)