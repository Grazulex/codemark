---
id: 3
title: Implement dependency security scanning
status: Done
priority: high
assignees:
  - Claude
labels: []
subtasks: []
dependencies: []
blocked_by: []
created_date: '2026-01-03T02:46:17.803Z'
updated_date: '2026-01-03T03:05:31.368Z'
closed_date: '2026-01-03T03:05:31.368Z'
changelog:
  - timestamp: '2026-01-03T02:46:17.803Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2026-01-03T03:05:06.008Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2026-01-03T03:05:06.806Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2026-01-03T03:05:31.368Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: "## Implementation Plan for Dependency Security Scanning\n\n### Phase 1: npm audit (Node.js/TypeScript)\n1. Detect package.json\n2. Run `npm audit --json`\n3. Parse vulnerabilities from JSON output\n4. Show severity levels: Critical, High, Moderate, Low\n5. Provide fix recommendations (npm update, npm audit fix)\n\n### Phase 2: composer audit (PHP)\n1. Detect composer.json\n2. Run `composer audit --format=json`\n3. Parse vulnerabilities from JSON output\n4. Show severity levels\n5. Provide fix recommendations (composer update)\n\n### Phase 3: Unified Interface\n1. Create src/dependency-auditor/\n2. Auto-detect project type\n3. Run appropriate audit\n4. Display results in CodeMark format\n5. Update deps command to use real scanning\n\n### Files to Create:\n- src/dependency-auditor/npm.ts\n- src/dependency-auditor/composer.ts\n- src/dependency-auditor/index.ts\n- Update src/commands/deps.ts\n\n### Security Levels:\n- \U0001F534 Critical - Fix immediately\n- \U0001F7E0 High - Fix soon\n- \U0001F7E1 Moderate - Consider fixing\n- \U0001F7E2 Low - Fix when convenient"
---
Add npm audit and vulnerability checking to the deps check command. Parse package.json and lock files for security issues.
