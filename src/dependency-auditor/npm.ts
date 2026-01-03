import { execSync } from "child_process";
import type { AuditResult, Vulnerability } from "./index.js";

export class NpmAuditor {
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  async audit(): Promise<AuditResult | null> {
    try {
      const output = execSync("npm audit --json", {
        cwd: this.projectDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      const data = JSON.parse(output);
      return this.transformResults(data);
    } catch (error: any) {
      // npm audit exits with non-zero when vulnerabilities found
      if (error.stdout) {
        try {
          const data = JSON.parse(error.stdout);
          return this.transformResults(data);
        } catch {
          // npm not available or no vulnerabilities
          return null;
        }
      }
      return null;
    }
  }

  private transformResults(data: any): AuditResult | null {
    const vulnerabilities: Vulnerability[] = [];
    const advisories = data.vulnerabilities || {};
    const metadata = data.metadata || {};

    for (const [packageName, info] of Object.entries(advisories)) {
      const vulnInfo = info as any;
      vulnerabilities.push({
        package: packageName,
        version: vulnInfo.via?.[0]?.range || "unknown",
        severity: this.normalizeSeverity(vulnInfo.severity),
        title: vulnInfo.name || "Security issue",
        url: vulnInfo.url,
        patch: vulnInfo.patch,
      });
    }

    return {
      tool: "npm",
      vulnerabilities,
      totalVulnerabilities: vulnerabilities.length,
      critical: vulnerabilities.filter((v) => v.severity === "critical").length,
      high: vulnerabilities.filter((v) => v.severity === "high").length,
      moderate: vulnerabilities.filter((v) => v.severity === "moderate").length,
      low: vulnerabilities.filter((v) => v.severity === "low").length,
    };
  }

  private normalizeSeverity(severity: number): "critical" | "high" | "moderate" | "low" {
    if (severity >= 900) return "critical";
    if (severity >= 700) return "high";
    if (severity >= 400) return "moderate";
    return "low";
  }

  async fix(): Promise<void> {
    try {
      execSync("npm audit fix", {
        cwd: this.projectDir,
        stdio: "inherit",
      });
    } catch (error) {
      // May exit with non-zero
    }
  }
}
