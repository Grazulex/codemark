import { execSync } from "child_process";
import type { AuditResult, Vulnerability } from "./index.js";

export class ComposerAuditor {
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  async audit(): Promise<AuditResult | null> {
    try {
      const output = execSync("composer audit --format=json", {
        cwd: this.projectDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      const data = JSON.parse(output);
      return this.transformResults(data);
    } catch (error: any) {
      // composer audit exits with non-zero when vulnerabilities found
      if (error.stdout) {
        try {
          const data = JSON.parse(error.stdout);
          return this.transformResults(data);
        } catch {
          // composer not available or no vulnerabilities
          return null;
        }
      }
      return null;
    }
  }

  private transformResults(data: any): AuditResult | null {
    const vulnerabilities: Vulnerability[] = [];
    const advisory = data.advised_packages || [];

    for (const pkg of advisory) {
      vulnerabilities.push({
        package: pkg.name,
        version: pkg.version || "unknown",
        severity: pkg.cve ? this.normalizeSeverity(pkg.severity) : "moderate",
        title: pkg.title || "Security issue",
        url: pkg.link,
      });
    }

    return {
      tool: "composer",
      vulnerabilities,
      totalVulnerabilities: vulnerabilities.length,
      critical: vulnerabilities.filter((v) => v.severity === "critical").length,
      high: vulnerabilities.filter((v) => v.severity === "high").length,
      moderate: vulnerabilities.filter((v) => v.severity === "moderate").length,
      low: vulnerabilities.filter((v) => v.severity === "low").length,
    };
  }

  private normalizeSeverity(severity: string): "critical" | "high" | "moderate" | "low" {
    const s = severity.toLowerCase();
    if (s === "critical") return "critical";
    if (s === "high") return "high";
    if (s === "moderate") return "moderate";
    return "low";
  }

  async fix(): Promise<void> {
    try {
      execSync("composer update", {
        cwd: this.projectDir,
        stdio: "inherit",
      });
    } catch (error) {
      // May exit with non-zero
    }
  }
}
