# Content Generation Workflow for AI-Native Textbook

## Overview
This document outlines the workflow for generating content using AI tools with human expert review.

## Tools Used
- Primary AI Tools: Claude Code, Qwen Code
- Version Control: Git
- Content Management: Docusaurus
- Quality Assurance: Human Expert Review

## Workflow Steps

### 1. Content Drafting
- Use Claude Code or Qwen Code to generate initial content drafts
- Follow the modular structure outlined in the data model
- Include learning objectives and exercises in the initial draft
- Ensure content aligns with the textbook's learning outcomes

### 2. Diagram Generation
- Describe the diagram needed in text format
- Use AI tools to generate SVG diagrams or other visual assets
- Place generated diagrams in `static/img/diagrams/`
- Ensure all diagrams have appropriate alt text for accessibility

### 3. Code Sample Creation
- Use AI to generate code examples that match the theoretical content
- Place code files in appropriate language directories under `static/code/`
- Verify code examples compile and run as expected
- Ensure code follows best practices and is well-documented

### 4. Exercise Generation
- Create practice problems and labs using AI assistance
- Align exercises with learning objectives of each module
- Include solution files where appropriate

### 5. Human Expert Review
- All AI-generated content must undergo human expert review
- Experts verify technical accuracy and educational value
- Feedback is incorporated into the content iteratively

### 6. Iterative Improvement
- Collect feedback from educators and students
- Continuously improve content based on feedback
- Update content regularly to reflect new developments in the field

## Quality Assurance
- All content must meet technical accuracy requirements
- Content must follow accessibility guidelines (WCAG 2.1 AA)
- Multi-modal learning elements must be included where appropriate
- Content must be modifiable and maintainable for future updates