import { ESLinter } from "./eslint.js";
import { PintLinter } from "./pint.js";
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

export type Language = "typescript" | "php" | "javascript";

export async function runLinters(
  projectDir: string,
  languages: Language[]
): Promise<LinterResult[]> {
  const results: LinterResult[] = [];

  for (const language of languages) {
    switch (language) {
      case "typescript":
      case "javascript":
        const eslint = new ESLinter(projectDir);
        const eslintResult = await eslint.lint();
        if (eslintResult) {
          results.push(eslintResult);
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
