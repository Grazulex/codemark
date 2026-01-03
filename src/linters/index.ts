import { ESLinter } from "./eslint.js";
import { PintLinter } from "./pint.js";
import { BiomeLinter } from "./biome.js";
import { StylelintLinter } from "./stylelint.js";
import { existsSync } from "fs";
import { join } from "path";

export interface LinterResult {
  tool: string;
  files: FileResult[];
  totalErrors: number;
  totalWarnings: number;
}

export interface FileResult {
  path: string;
  errors: Issue[];
  warnings: Issue[];
}

export interface Issue {
  line?: number;
  column?: number;
  message: string;
  rule: string;
  severity: "error" | "warning";
}

export type Language = "typescript" | "php" | "javascript" | "css";

export async function runLinters(
  projectDir: string,
  languages: Language[]
): Promise<LinterResult[]> {
  const results: LinterResult[] = [];

  // Always check for CSS/stylesheet files
  const hasCssFiles = await hasCssInProject(projectDir);
  if (hasCssFiles) {
    const stylelint = new StylelintLinter(projectDir);
    const stylelintResult = await stylelint.lint();
    if (stylelintResult) {
      results.push(stylelintResult);
    }
  }

  for (const language of languages) {
    switch (language) {
      case "typescript":
      case "javascript":
        // Prefer Biome if available, fallback to ESLint
        const biome = new BiomeLinter(projectDir);
        const biomeResult = await biome.lint();
        if (biomeResult) {
          results.push(biomeResult);
        } else {
          const eslint = new ESLinter(projectDir);
          const eslintResult = await eslint.lint();
          if (eslintResult) {
            results.push(eslintResult);
          }
        }
        break;
      case "php":
        const pint = new PintLinter(projectDir);
        const pintResult = await pint.lint();
        if (pintResult) {
          results.push(pintResult);
        }
        break;
    }
  }

  return results;
}

export function detectLanguages(projectDir: string): Language[] {
  const languages: Language[] = [];

  // Check for TypeScript/JavaScript files
  const packageJson = join(projectDir, "package.json");
  if (existsSync(packageJson)) {
    languages.push("typescript");
  }

  // Check for PHP files
  if (existsSync(join(projectDir, "composer.json")) ||
      existsSync(join(projectDir, "src/User.php"))) {
    languages.push("php");
  }

  return languages.length > 0 ? languages : ["typescript"];
}

async function hasCssInProject(projectDir: string): Promise<boolean> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const cssPatterns = [".css", ".scss", ".sass", ".less", ".styl"];

  async function checkFiles(dir: string): Promise<boolean> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "node_modules" && entry.name !== "dist" && entry.name !== ".git") {
            const found = await checkFiles(fullPath);
            if (found) return true;
          }
        } else if (cssPatterns.some((ext) => entry.name.endsWith(ext))) {
          return true;
        }
      }
    } catch {
      // Ignore permission errors
    }
    return false;
  }

  return await checkFiles(projectDir);
}
