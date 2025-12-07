# Data Model: Physical AI & Humanoid Robotics Textbook

**Feature**: Physical AI & Humanoid Robotics Textbook
**Date**: 2025-12-07
**Author**: AI Assistant

## Entities

### Textbook Module
- **Description**: A self-contained section of the textbook with learning objectives, content, and exercises
- **Fields**:
  - `id` (string): Unique identifier for the module
  - `title` (string): Title of the module
  - `description` (string): Brief description of the module
  - `learningObjectives` (array of strings): List of learning objectives
  - `prerequisites` (array of strings): List of prerequisite modules or concepts
  - `contentPath` (string): Path to the main content file
  - `exercisesPath` (string): Path to exercises file
  - `diagramsPath` (string): Path to diagrams for this module
  - `codeExamplesPath` (string): Path to code examples for this module
  - `status` (enum): draft, review, published
  - `authors` (array of strings): List of authors/contributors
  - `lastUpdated` (date): Date of last update
  - `version` (string): Version of the content

### Chapter
- **Description**: A collection of related modules forming a complete chapter
- **Fields**:
  - `id` (string): Unique identifier for the chapter
  - `title` (string): Title of the chapter
  - `description` (string): Brief description of the chapter
  - `modules` (array of TextbookModule): List of modules in the chapter
  - `sequenceNumber` (integer): Order of the chapter in the textbook
  - `prerequisites` (array of strings): List of prerequisite chapters or concepts
  - `learningOutcomes` (array of strings): List of learning outcomes for the chapter

### Textbook
- **Description**: The complete textbook containing all chapters and metadata
- **Fields**:
  - `id` (string): Unique identifier for the textbook
  - `title` (string): Full title of the textbook
  - `subtitle` (string): Subtitle of the textbook
  - `authors` (array of strings): List of all authors
  - `contributors` (array of strings): List of all contributors
  - `version` (string): Version of the textbook
  - `chapters` (array of Chapter): List of all chapters
  - `glossary` (string): Path to glossary file
  - `references` (string): Path to references/bibliography file
  - `license` (string): License information
  - `publicationDate` (date): Date of publication
  - `lastUpdated` (date): Date of last update

### Lab/Exercise
- **Description**: Practical application activities for students
- **Fields**:
  - `id` (string): Unique identifier for the lab/exercise
  - `title` (string): Title of the lab/exercise
  - `description` (string): Brief description
  - `difficulty` (enum): beginner, intermediate, advanced
  - `estimatedTime` (integer): Estimated time in minutes
  - `prerequisites` (array of strings): Prerequisites for the lab/exercise
  - `instructions` (string): Path to detailed instructions
  - `materials` (array of strings): List of required materials/resources
  - `objectives` (array of strings): Learning objectives
  - `solutionPath` (string): Path to solution or answer key
  - `relatedModules` (array of strings): IDs of related modules

### Code Example
- **Description**: Code samples and implementations referenced in the textbook
- **Fields**:
  - `id` (string): Unique identifier for the code example
  - `title` (string): Title/description of the example
  - `language` (string): Programming language (Python, C++, etc.)
  - `filePath` (string): Path to the code file
  - `description` (string): Brief description of what the code does
  - `relatedModules` (array of strings): IDs of related modules
  - `executionType` (enum): snippet, complete, library
  - `difficulty` (enum): beginner, intermediate, advanced
  - `lastUpdated` (date): Date of last update

### Diagram/Visual Asset
- **Description**: Diagrams, images, and other visual learning aids
- **Fields**:
  - `id` (string): Unique identifier for the asset
  - `title` (string): Title/description of the diagram
  - `filePath` (string): Path to the asset file
  - `assetType` (enum): diagram, photograph, illustration, animation
  - `description` (string): Brief description of the content
  - `relatedModules` (array of strings): IDs of related modules
  - `altText` (string): Alternative text for accessibility
  - `license` (string): License information for the asset
  - `lastUpdated` (date): Date of last update

## Relationships

1. **Textbook** contains many **Chapters**
2. **Chapter** contains many **Textbook Modules**
3. **Textbook Module** can have many **Lab/Exercises** and **Code Examples**
4. **Lab/Exercise** can be related to many **Textbook Modules**
5. **Code Example** can be related to many **Textbook Modules**
6. **Diagram/Visual Asset** can be related to many **Textbook Modules**

## Validation Rules

1. **Textbook Module**:
   - `id` must be unique within the textbook
   - `title` is required and must be 3-100 characters
   - `learningObjectives` must contain at least one objective
   - `status` must be one of the defined enum values
   - `lastUpdated` must be a valid date

2. **Chapter**:
   - `id` must be unique within the textbook
   - `title` is required and must be 3-100 characters
   - Must contain at least one module
   - `sequenceNumber` must be unique within the textbook

3. **Lab/Exercise**:
   - `id` must be unique within the textbook
   - `title` is required and must be 3-100 characters
   - `difficulty` must be one of the defined enum values
   - `estimatedTime` must be a positive number

## State Transitions

1. **Textbook Module**:
   - `draft` → `review` (when initial content is complete)
   - `review` → `draft` (when changes are requested)
   - `review` → `published` (when approved by subject matter expert)
   - `published` → `draft` (when updates are needed)

2. **Chapter**:
   - `draft` → `review` (when all modules are in review status)
   - `review` → `published` (when all modules are published)