# API Contract: Textbook Content Management

## Get Textbook Structure
- **Endpoint**: `GET /api/textbook/structure`
- **Description**: Retrieve the complete structure of the textbook including all chapters and modules
- **Parameters**: None
- **Response**:
  - `200 OK`: Textbook structure object containing chapters, modules, and metadata
  - `404 Not Found`: Textbook resource not found

## Get Chapter Content
- **Endpoint**: `GET /api/chapter/{chapterId}`
- **Description**: Retrieve content for a specific chapter including all modules
- **Parameters**: 
  - `chapterId` (string): ID of the chapter to retrieve
- **Response**:
  - `200 OK`: Chapter object with modules and content
  - `404 Not Found`: Chapter not found

## Get Module Content
- **Endpoint**: `GET /api/module/{moduleId}`
- **Description**: Retrieve content for a specific module
- **Parameters**: 
  - `moduleId` (string): ID of the module to retrieve
- **Response**:
  - `200 OK`: Module object with content, exercises, and related materials
  - `404 Not Found`: Module not found

## Search Content
- **Endpoint**: `GET /api/search`
- **Description**: Search across all textbook content
- **Parameters**:
  - `query` (string): Search query string
  - `type` (string, optional): Filter by content type (theory, practical, exercise)
- **Response**:
  - `200 OK`: List of matching content resources with relevance scores