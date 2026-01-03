import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { LinterResult, FileResult, Issue } from "./index.js";

export class PintLinter {
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  async lint(): Promise<LinterResult | null> {
    try {
      if (!this.hasPint()) {
        return null;
      }

      const patterns = this.getPatterns();
      const files = patterns.join(" ");

      const output = execSync(`vendor/bin/pint ${files} --test --format=json`, {
        cwd: this.projectDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      const results = JSON.parse(output);
      return this.transformResults(results);
    } catch (error) {
      // Pint found issues or not installed
      if (error && typeof error === "object" && "stdout" in error) {
        try {
          if ((error as any).stdout.includes("not found")) {
            return null;
          }
          const results = JSON.parse((error as any).stdout);
          return this.transformResults(results);
        } catch {
          return this.createEmptyResult();
        }
      }

      return this.createEmptyResult();
    }
  }

  private hasPint(): boolean {
    const pintPath = join(this.projectDir, "vendor/bin/pint");
    const composerPath = join(this.projectDir, "composer.json");

    return existsSync(pintPath) && existsSync(composerPath);
  }

  private getPatterns(): string[] {
    const patterns = [
      "**/*.php",
      "!vendor/**",
      "!node_modules/**",
      "!storage/**",
      "!bootstrap/cache/**",
      "!public/hot",
    ];

    return patterns;
  }

  private transformResults(results: any): LinterResult {
    const files: FileResult[] = [];
    let totalErrors = 0;
    let totalWarnings = 0;

    // Pint returns a different structure
    for (const file of results.files || []) {
      const fileResult: FileResult = {
        path: file.name,
        errors: [],
        warnings: [],
      };

      for (const message of file.messages || []) {
        const issue: Issue = {
          line: message.line,
          column: message.column,
          message: message.message,
          rule: message.rule,
          severity: message.severity === "error" ? "error" : "warning",
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
      tool: "Laravel Pint",
      files,
      totalErrors,
      totalWarnings,
    };
  }

  private createEmptyResult(): LinterResult {
    return {
      tool: "Laravel Pint",
      files: [],
      totalErrors: 0,
      totalWarnings: 0,
    };
  }

  async fix(patterns?: string[]): Promise<void> {
    const files = patterns?.join(" ") || this.getPatterns().join(" ");

    try {
      execSync(`vendor/bin/pint ${files}`, {
        cwd: this.projectDir,
        stdio: "inherit",
      });
    } catch (error) {
      // Pint may exit with non-zero even when fixing succeeds
    }
  }
}
