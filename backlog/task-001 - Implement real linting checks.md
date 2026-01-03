---
id: 1
title: Implement real linting checks
status: Done
priority: high
assignees:
  - Claude
labels: []
subtasks: []
dependencies: []
blocked_by: []
created_date: '2026-01-03T02:46:16.310Z'
updated_date: '2026-01-03T03:00:23.605Z'
closed_date: '2026-01-03T03:00:23.605Z'
changelog:
  - timestamp: '2026-01-03T02:46:16.310Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2026-01-03T02:57:27.583Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2026-01-03T02:57:28.338Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2026-01-03T03:00:23.605Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: |-
  ## Implementation Plan for TypeScript + PHP Linting

  ### Phase 1: TypeScript/JavaScript Linting
  1. Install and integrate ESLint
  2. Parse .eslintrc.* and eslint.config.* files
  3. Execute eslint --format json for programmatic results
  4. Map ESLint results to CodeMark format

  ### Phase 2: PHP Linting
  1. Use Laravel Pint (standard PHP linter)
  2. Parse pint.json configuration
  3. Execute vendor/bin/pint --test --format=json
  4. Map Pint results to CodeMark format

  ### Phase 3: Unified Interface
  1. Detect project type (TS/JS vs PHP)
  2. Run appropriate linter
  3. Combine results in report
  4. Support multiple languages in mixed projects

  ### Files to Create/Modify:
  - src/linters/eslint.ts
  - src/linters/pint.ts
  - src/linters/index.ts (unified interface)
  - Update src/commands/check.ts to use real linters
  - Add dependencies: @eslint/types, @eslint/js
---
Add ESLint, Prettier, and Biome integration to the check command. Parse actual config files and run real linting checks on code files.
