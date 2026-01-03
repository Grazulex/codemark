import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import type { LinterResult, FileResult, Issue } from "./index.js";

export class BiomeLinter {
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  async lint(): Promise<LinterResult | null> {
    try {
      if (!this.hasBiome()) {
        return null;
      }

      const patterns = this.getPatterns();
      const files = patterns.join(" ");

      const output = execSync(`npx @biomejs/biome check ${files} --diagnostic-level=error --reporter=verbose`, {
        cwd: this.projectDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      return this.parseOutput(output);
    } catch (error: any) {
      if (error.stdout) {
        return this.parseOutput(error.stdout);
      }
      return this.createEmptyResult();
    }
  }

  private hasBiome(): boolean {
    const configPaths = [
      join(this.projectDir, "biome.json"),
      join(this.projectDir, "biome.jsonc"),
      join(this.projectDir, "package.json"),
    ];

    return configPaths.some((path) => existsSync(path));
  }

  private getPatterns(): string[] {
    return [
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.js",
      "src/**/*.jsx",
    ];
  }

  private parseOutput(output: string): LinterResult {
    const files: FileResult[] = [];
    const lines = output.split("\n");

    let currentFile: FileResult | null = null;

    for (const line of lines) {
      // Match line format: "  × file.ts"
      const fileMatch = line.match(/\s+×\s+(.+)$/);
      if (fileMatch) {
        if (currentFile) {
          files.push(currentFile);
        }
        currentFile = {
          path: join(this.projectDir, fileMatch[1]),
          errors: [],
          warnings: [],
        };
        continue;
      }

      // Match diagnostic lines
      const diagMatch = line.match(/\s+→\s+(.+)$/);
      if (diagMatch && currentFile) {
        const severity = line.includes("error") ? "error" : "warning";
        const issue: Issue = {
          message: diagMatch[1],
          rule: "biome",
          severity,
        };

        if (severity === "error") {
          currentFile.errors.push(issue);
        } else {
          currentFile.warnings.push(issue);
        }
      }
    }

    if (currentFile) {
      files.push(currentFile);
    }

    return {
      tool: "Biome",
      files,
      totalErrors: files.reduce((sum, f) => sum + f.errors.length, 0),
      totalWarnings: files.reduce((sum, f) => sum + f.warnings.length, 0),
    };
  }

  private createEmptyResult(): LinterResult {
    return {
      tool: "Biome",
      files: [],
      totalErrors: 0,
      totalWarnings: 0,
    };
  }

  async fix(): Promise<void> {
    const patterns = this.getPatterns();
    const files = patterns.join(" ");

    try {
      execSync(`npx @biomejs/biome check --write ${files}`, {
        cwd: this.projectDir,
        stdio: "inherit",
      });
    } catch (error) {
      // Biome may exit with non-zero even when fixing succeeds
    }
  }
}
