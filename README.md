<div align="center">

<img src="assets/logo.png" alt="CodeMark Logo" width="120" />

# CodeMark

### 🎨 Code Quality and Standards Management Made Simple
**Beautiful CLI • Unified Standards • Full Control**

[![npm version](https://img.shields.io/npm/v/@grazulex/codemark.svg?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/@grazulex/codemark)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-codemark.tech-10B981?style=flat-square)](https://codemark.tech)

**Manage and enforce code quality standards across all your projects. Unified linting, automated fixing, quality metrics, vulnerability scanning—all from your terminal.**

[Website](https://codemark.tech) • [Quick Start](#-quick-start) • [Features](#-features) • [Commands](#-commands)

</div>

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g @grazulex/codemark

# Initialize in your project
cd ~/projects/my-app
codemark init

# Run checks
codemark check

# Auto-fix issues
codemark fix

# Generate quality report
codemark report
```

**That's it!** CodeMark will guide you through setting up code standards and help maintain them across all your projects.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔍 Multi-Language Linting
Support for TypeScript, JavaScript, and PHP with automatic language detection and unified reporting.

</td>
<td width="50%">

### 🔧 Intelligent Auto-Fix
Automatically fix 80% of common issues: formatting, imports, sorting, trailing spaces, and more.

</td>
</tr>
<tr>
<td>

### 📊 Quality Reports
Beautiful reports with metrics: coverage, complexity, maintainability, technical debt, and security scores.

</td>
<td>

### 📈 Trend Analysis
Track your code quality over time. See if your codebase is improving or accumulating technical debt.

</td>
</tr>
<tr>
<td>

### 🔒 Security Scanning
Automatically check for vulnerable dependencies and receive actionable update recommendations.

</td>
<td>

### 🔄 Sync Standards Across Projects
Share your coding standards across all projects and machines. Consistency at scale.

</td>
</tr>
</table>

### Supported Languages

| Language | Linter | Installation |
|----------|--------|--------------|
| **TypeScript/JavaScript** | ESLint | `npm install eslint --save-dev` |
| **PHP** | Laravel Pint | `composer require laravel/pint --dev` |

CodeMark automatically detects your project type by checking for `package.json` (TS/JS) or `composer.json` (PHP).

---

## 🖥️ Commands

### `codemark init`

Initialize CodeMark in your project with interactive setup.

```bash
codemark init
```

**Setup flow:**
- Project name
- Primary language (TypeScript, Python, PHP, Go)
- Standards to enforce (line length, semicolons, quotes, etc.)
- Auto-fix configuration

Creates `.codemark.yml` in your project root.

### `codemark check`

Run all code quality checks.

```bash
codemark check                    # Check all files
codemark check --fix               # Check and auto-fix
codemark check --file src/index.ts # Check specific file
```

**Checks performed:**
- Linting errors and warnings
- Code formatting
- Code complexity
- Duplication detection
- Security vulnerabilities
- Dependency issues

### `codemark fix`

Auto-fix code quality issues.

```bash
codemark fix                       # Fix all issues
codemark fix --dry-run            # Preview changes
codemark fix --file src/index.ts   # Fix specific file
```

### `codemark report`

Generate comprehensive code quality report.

```bash
codemark report                    # Table format
codemark report --format json      # JSON output
codemark report --format html      # HTML report
codemark report --output report.html # Save to file
```

**Metrics included:**
- Test coverage
- Average line length
- Cyclomatic complexity
- Code duplication
- Maintainability index
- Technical debt ratio
- Security issues
- Lint errors/warnings

### `codemark trends`

Show code quality trends over time.

```bash
codemark trends                    # Last 30 days
codemark trends --days 90          # Last 90 days
```

### `codemark deps`

Manage dependencies.

```bash
codemark deps check                # Check for vulnerabilities
codemark deps update               # Update safely
codemark deps update --check       # Check for breaking changes
```

### `codemark standards`

Manage code standards across projects.

```bash
codemark standards sync            # Sync with global library
codemark standards push            # Push to library
codemark standards pull            # Pull from library
codemark standards status          # Show compliance
```

---

## 📁 Configuration

CodeMark uses `.codemark.yml` for project configuration:

```yaml
project: my-app
language: typescript
standards:
  - line-length
  - no-console
  - semicolons
  - single-quotes
  - indentation
autoFix: true
patterns:
  include:
    - "*.{js,ts,jsx,tsx}"
  exclude:
    - node_modules
    - dist
    - build
```

---

## 🌟 Part of the Mark Ecosystem

| Tool | Purpose |
|------|---------|
| [**Backmark**](https://backmark.tech) | AI-powered task management |
| [**Stackmark**](https://stackmark.tech) | Docker environment management |
| [**Shipmark**](https://shipmark.tech) | Release and versioning automation |
| [**EnvMark**](https://envmark.tech) | Environment variable management |
| [**ContextMark**](https://contextmark.tech) | Claude Code context management |
| [**CodeMark**](https://codemark.tech) | Code quality and standards management |

---

## 📄 License

MIT © [Jean-Marc Strauven](https://github.com/Grazulex)

---

<div align="center">

**[🌐 Website](https://codemark.tech)** • **[📦 npm](https://www.npmjs.com/package/@grazulex/codemark)** • **[🐛 Issues](https://github.com/Grazulex/codemark/issues)** • **[💬 Discussions](https://github.com/Grazulex/codemark/discussions)**

---

**Built with ❤️ for developers who care about code quality**

*Star this repo if CodeMark helps your workflow!* ⭐

</div>
