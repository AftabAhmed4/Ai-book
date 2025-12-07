---
id: module-metadata-schema
title: Textbook Module Metadata Schema
---

# Textbook Module Metadata Schema

This document defines the metadata schema for textbook modules based on the data model.

## Module Metadata Structure

Each textbook module should include the following metadata:

```yaml
# Required fields
id: "unique-module-id"
title: "Module Title"
description: "Brief description of the module"

# Learning-focused fields
learningObjectives:
  - "Objective 1"
  - "Objective 2"
  - "Objective 3"

# Content structure
contentPath: "./path/to/content.md"
exercisesPath: "./path/to/exercises.md"
diagramsPath: "./path/to/diagrams/"
codeExamplesPath: "./path/to/code-examples/"

# Academic fields
prerequisites: 
  - "prerequisite-module-id"
  - "other-prerequisite"
authors:
  - "Author Name"
status: "draft" # draft, review, published
version: "1.0.0"

# Additional metadata
lastUpdated: "YYYY-MM-DD"
difficulty: "beginner" # beginner, intermediate, advanced
estimatedTime: 60 # in minutes
tags:
  - "tag1"
  - "tag2"

# Content-specific fields
relatedModules:
  - "related-module-id"
```

## Status Lifecycle

Modules follow this status lifecycle:
- `draft` → `review` → `published`
- `published` → `draft` (if updates are needed)

## Validation Rules

1. `id` must be unique within the textbook
2. `title` is required and must be 3-100 characters
3. `learningObjectives` must contain at least one objective
4. `status` must be one of: draft, review, published
5. `lastUpdated` must be a valid date
6. `difficulty` must be one of: beginner, intermediate, advanced

## Example

```yaml
id: "ch1-intro-physical-ai"
title: "Introduction to Physical AI"
description: "An overview of physical AI concepts and applications"
learningObjectives:
  - "Define physical AI and distinguish from traditional AI"
  - "Identify key applications of physical AI"
  - "Explain the importance of embodiment in AI systems"
contentPath: "./docs/textbook/chapter1/intro.md"
exercisesPath: "./docs/textbook/chapter1/exercises.md"
prerequisites: []
authors:
  - "AI Assistant with Human Expert Review"
status: "draft"
version: "1.0.0"
lastUpdated: "2025-12-07"
difficulty: "intermediate"
estimatedTime: 45
tags:
  - "introduction"
  - "foundations"
  - "ai-concepts"
relatedModules:
  - "ch1-foundations-robotics"
```