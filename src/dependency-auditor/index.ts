import { NpmAuditor } from "./npm.js";
import { ComposerAuditor } from "./composer.js";
import { existsSync } from "fs";
import { join } from "path";

export interface Vulnerability {
  package: string;
  version: string;
  severity: "critical" | "high" | "moderate" | "low";
  title: string;
  url?: string;
  patch?: {
    versions: string[];
  };
}

export interface AuditResult {
  tool: "npm" | "composer";
  vulnerabilities: Vulnerability[];
  totalVulnerabilities: number;
  critical: number;
  high: number;
  moderate: number;
  low: number;
}

export async function auditDependencies(
  projectDir: string
): Promise<AuditResult | null> {
  const packageJson = join(projectDir, "package.json");
  const composerJson = join(projectDir, "composer.json");

  if (existsSync(packageJson)) {
    const npmAuditor = new NpmAuditor(projectDir);
    return await npmAuditor.audit();
  } else if (existsSync(composerJson)) {
    const composerAuditor = new ComposerAuditor(projectDir);
    return await composerAuditor.audit();
  }

  return null;
}
