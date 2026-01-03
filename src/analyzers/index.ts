import { ComplexityAnalyzer } from "./complexity.js";
import { HalsteadAnalyzer } from "./halstead.js";

export interface ComplexityResult {
  file: string;
  functions: FunctionComplexity[];
  averageComplexity: number;
  maxComplexity: number;
  maintainabilityIndex: number;
}

export interface FunctionComplexity {
  name: string;
  complexity: number;
  linesOfCode: number;
  startLine: number;
  endLine: number;
}

export interface HalsteadMetrics {
  operators: number;
  operands: number;
  uniqueOperators: number;
  uniqueOperands: number;
  vocabulary: number;
  difficulty: number;
  effort: number;
}

export async function analyzeComplexity(
  filePath: string,
  content: string,
  language: "typescript" | "javascript" | "php"
): Promise<ComplexityResult> {
  const complexityAnalyzer = new ComplexityAnalyzer(content, language);
  const functions = complexityAnalyzer.analyze();

  const averageComplexity =
    functions.length > 0
      ? functions.reduce((sum, f) => sum + f.complexity, 0) / functions.length
      : 0;

  const maxComplexity =
    functions.length > 0
      ? Math.max(...functions.map((f) => f.complexity))
      : 0;

  const halsteadAnalyzer = new HalsteadAnalyzer(content, language);
  const halstead = halsteadAnalyzer.analyze();

  // Maintainability Index calculation (simplified)
  const maintainabilityIndex = calculateMaintainabilityIndex(
    averageComplexity,
    halstead.difficulty,
    content.split("\n").length
  );

  return {
    file: filePath,
    functions,
    averageComplexity: Math.round(averageComplexity * 100) / 100,
    maxComplexity,
    maintainabilityIndex: Math.floor(maintainabilityIndex),
  };
}

function calculateMaintainabilityIndex(
  avgComplexity: number,
  volume: number,
  loc: number
): number {
  // Simplified MI formula
  const mi = 171 - 5.2 * Math.log(avgComplexity) - 0.23 * avgComplexity - 16.2 * Math.log(loc) + 50 * Math.log(volume);
  return Math.max(0, Math.min(171, mi));
}

export function getComplexityLevel(complexity: number): {
  level: "low" | "medium" | "high";
  color: string;
} {
  if (complexity <= 5) {
    return { level: "low", color: "green" };
  } else if (complexity <= 10) {
    return { level: "medium", color: "yellow" };
  } else {
    return { level: "high", color: "red" };
  }
}
