import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { LinterResult, FileResult, Issue } from "./index.js";

export class ESLinter {
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  async lint(): Promise<LinterResult | null> {
    try {
      if (!this.hasESLint()) {
        return null;
      }

      const patterns = this.getPatterns();
      const files = patterns.join(" ");

      const output = execSync(`npx eslint ${files} --format json`, {
        cwd: this.projectDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      const results = JSON.parse(output);
      return this.transformResults(results);
    } catch (error: any) {
      // ESLint found issues or no errors (exit code 1 means there were issues)
      const stdout = error.stdout || error.stderr || "";

      if (stdout.length > 0) {
        try {
          const results = JSON.parse(stdout);
          return this.transformResults(results);
        } catch {
          return this.createEmptyResult();
        }
      }

      return this.createEmptyResult();
    }
  }

  private hasESLint(): boolean {
    const configPaths = [
      join(this.projectDir, "eslint.config.js"),
      join(this.projectDir, "eslint.config.mjs"),
      join(this.projectDir, ".eslintrc.js"),
      join(this.projectDir, ".eslintrc.json"),
      join(this.projectDir, ".eslintrc.yml"),
      join(this.projectDir, ".eslintrc.yaml"),
      join(this.projectDir, ".eslintrc"),
      join(this.projectDir, "package.json"),
    ];

    return configPaths.some((path) => existsSync(path));
  }

  private getPatterns(): string[] {
    const patterns = [
      "src/**/*.ts",
    ];

    return patterns;
  }

  private transformResults(results: any): LinterResult {
    const files: FileResult[] = [];
    let totalErrors = 0;
    let totalWarnings = 0;

    for (const result of results) {
      const fileResult: FileResult = {
        path: result.filePath,
        errors: [],
        warnings: [],
      };

      for (const message of result.messages || []) {
        const issue: Issue = {
          line: message.line,
          column: message.column,
          message: message.message,
          rule: message.ruleId || "unknown",
          severity: message.severity === 2 ? "error" : "warning",
        };

        if (issue.severity === "error") {
          fileResult.errors.push(issue);
          totalErrors++;
        } else {
          fileResult.warnings.push(issue);
          totalWarnings++;
        }
      }

      files.push(fileResult);
    }

    return {
      tool: "ESLint",
      files,
      totalErrors,
      totalWarnings,
    };
  }

  private createEmptyResult(): LinterResult {
    return {
      tool: "ESLint",
      files: [],
      totalErrors: 0,
      totalWarnings: 0,
    };
  }

  async fix(patterns?: string[]): Promise<void> {
    const files = patterns?.join(" ") || this.getPatterns().join(" ");

    try {
      execSync(`npx eslint ${files} --fix`, {
        cwd: this.projectDir,
        stdio: "inherit",
      });
    } catch (error) {
      // ESLint may exit with non-zero even when fixing succeeds
    }
  }
}
