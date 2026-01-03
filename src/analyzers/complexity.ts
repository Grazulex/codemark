import type { FunctionComplexity } from "./index.js";

export class ComplexityAnalyzer {
  private content: string;
  private language: "typescript" | "javascript" | "php";

  constructor(content: string, language: "typescript" | "javascript" | "php") {
    this.content = content;
    this.language = language;
  }

  analyze(): FunctionComplexity[] {
    const functions: FunctionComplexity[] = [];
    const lines = this.content.split("\n");

    // Simple regex-based function detection
    const functionPatterns =
      this.language === "php"
        ? [/function\s+(\w+)\s*\(/g, /public\s+function\s+(\w+)\s*\(/g, /private\s+function\s+(\w+)\s*\(/g]
        : [
            /function\s+(\w+)\s*\(/g,
            /const\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*{/g,
            /(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*{/g,
          ];

    for (const pattern of functionPatterns) {
      let match;
      while ((match = pattern.exec(this.content)) !== null) {
        const name = match[1] || match[2] || "anonymous";
        const startLine = this.getLineNumber(match.index);
        const { endLine, complexity } = this.analyzeFunction(
          match.index,
          pattern.lastIndex
        );

        functions.push({
          name,
          complexity,
          linesOfCode: endLine - startLine + 1,
          startLine,
          endLine,
        });
      }
    }

    return functions;
  }

  private analyzeFunction(startIndex: number, endIndex: number): {
    endLine: number;
    complexity: number;
  } {
    const functionContent = this.content.slice(startIndex, endIndex);
    const lines = functionContent.split("\n");
    const endLine = this.getLineNumber(startIndex) + lines.length - 1;

    let complexity = 1; // Base complexity
    const decisionKeywords = this.language === "php" ? ["if", "else", "elseif", "for", "foreach", "while", "switch", "case", "catch", "&&", "||", "?", ""] : ["if", "else if", "for", "while", "switch", "case", "catch", "&&", "||", "?", ""];

    for (const line of lines) {
      for (const keyword of decisionKeywords) {
        const regex = new RegExp(`\\b${keyword.replace(" ", "\\s+")}\\b`);
        const matches = line.match(regex);
        if (matches) {
          if (keyword === "&&" || keyword === "||" || keyword === "?") {
            complexity += (line.match(new RegExp(keyword, "g")) || []).length;
          } else {
            complexity += 1;
          }
        }
      }
    }

    return { endLine, complexity };
  }

  private getLineNumber(index: number): number {
    return this.content.substring(0, index).split("\n").length;
  }
}
