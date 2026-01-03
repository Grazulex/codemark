import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import type { LinterResult, FileResult, Issue } from "./index.js";

export class StylelintLinter {
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  async lint(): Promise<LinterResult | null> {
    try {
      if (!this.hasStylelint()) {
        return null;
      }

      const patterns = this.getPatterns();
      const files = patterns.join(" ");

      // Run stylelint with JSON formatter
      const output = execSync(`npx stylelint "${files}" --formatter json`, {
        cwd: this.projectDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      const results = JSON.parse(output);
      return this.transformResults(results);
    } catch (error: any) {
      // Stylelint exits with non-zero when issues found
      if (error.stdout) {
        try {
          const results = JSON.parse(error.stdout);
          return this.transformResults(results);
        } catch {
          return this.createEmptyResult();
        }
      }
      return this.createEmptyResult();
    }
  }

  private hasStylelint(): boolean {
    const configPaths = [
      join(this.projectDir, ".stylelintrc"),
      join(this.projectDir, ".stylelintrc.json"),
      join(this.projectDir, ".stylelintrc.yaml"),
      join(this.projectDir, ".stylelintrc.yml"),
      join(this.projectDir, ".stylelintrc.js"),
      join(this.projectDir, "stylelint.config.js"),
      join(this.projectDir, "package.json"),
    ];

    return configPaths.some((path) => existsSync(path));
  }

  private getPatterns(): string[] {
    return [
      "**/*.css",
      "**/*.scss",
      "**/*.sass",
      "**/*.less",
      "**/*.styl",
      "!node_modules/**",
      "!dist/**",
    ];
  }

  private transformResults(results: any): LinterResult {
    const files: FileResult[] = [];
    let totalErrors = 0;
    let totalWarnings = 0;

    const fileMap = new Map<string, FileResult>();

    for (const result of results) {
      if (!result.warnings || result.warnings.length === 0) continue;

      const filePath = result.source;
      let fileResult = fileMap.get(filePath);

      if (!fileResult) {
        fileResult = {
          path: filePath,
          errors: [],
          warnings: [],
        };
        fileMap.set(filePath, fileResult);
      }

      for (const warning of result.warnings) {
        const issue: Issue = {
          line: warning.line,
          column: warning.column,
          message: warning.text,
          rule: warning.rule,
          severity: warning.severity === "error" ? "error" : "warning",
        };

        if (issue.severity === "error") {
          fileResult.errors.push(issue);
          totalErrors++;
        } else {
          fileResult.warnings.push(issue);
          totalWarnings++;
        }
      }
    }

    return {
      tool: "Stylelint",
      files: Array.from(fileMap.values()),
      totalErrors,
      totalWarnings,
    };
  }

  private createEmptyResult(): LinterResult {
    return {
      tool: "Stylelint",
      files: [],
      totalErrors: 0,
      totalWarnings: 0,
    };
  }

  async fix(): Promise<void> {
    const patterns = this.getPatterns();
    const files = patterns.join(" ");

    try {
      execSync(`npx stylelint "${files}" --fix`, {
        cwd: this.projectDir,
        stdio: "inherit",
      });
    } catch (error) {
      // Stylelint may exit with non-zero even when fixing succeeds
    }
  }
}
