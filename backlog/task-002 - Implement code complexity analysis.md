---
id: 2
title: Implement code complexity analysis
status: Done
priority: high
assignees:
  - Claude
labels: []
subtasks: []
dependencies: []
blocked_by: []
created_date: '2026-01-03T02:46:17.066Z'
updated_date: '2026-01-03T03:05:05.279Z'
closed_date: '2026-01-03T03:05:05.279Z'
changelog:
  - timestamp: '2026-01-03T02:46:17.066Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2026-01-03T03:04:04.805Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2026-01-03T03:04:05.585Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2026-01-03T03:05:05.279Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: |-
  ## Implementation Plan for Code Complexity Analysis

  ### Core Metrics to Implement:
  1. **Cyclomatic Complexity (CC)** - McCabe complexity
     - Count decision points (if, for, while, case, catch, etc.)
     - Function-level and file-level scores

  2. **Halstead Metrics**
     - Unique operators (η1)
     - Unique operands (η2)
     - Total operators (N1)
     - Total operands (N2)
     - Program length (N)
     - Vocabulary (η)
     - Difficulty (D)
     - Effort (E)

  3. **Maintainability Index (MI)**
     - Based on CC, Halstead, and Lines of Code
     - Score from 0-100 (higher is better)

  ### Files to Create:
  - src/analyzers/complexity.ts
  - src/analyzers/halstead.ts  
  - src/analyzers/index.ts (unified interface)
  - Update src/commands/report.ts to show complexity metrics

  ### Implementation Approach:
  - Parse source code (simple regex-based for now)
  - Calculate metrics for each function
  - Aggregate to file level
  - Provide color-coded output (green/yellow/red)
---
Add cyclomatic complexity analysis and metrics calculation to the report command. Track complexity by file and function.
