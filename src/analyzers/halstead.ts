import type { HalsteadMetrics } from "./index.js";

export class HalsteadAnalyzer {
  private content: string;
  private language: "typescript" | "javascript" | "php";

  constructor(content: string, language: "typescript" | "javascript" | "php") {
    this.content = content;
    this.language = language;
  }

  analyze(): HalsteadMetrics {
    const operators = this.findOperators();
    const operands = this.findOperands();

    const uniqueOperators = new Set(operators).size;
    const uniqueOperands = new Set(operands).size;
    const totalOperators = operators.length;
    const totalOperands = operands.length;

    const length = totalOperators + totalOperands;
    const vocabulary = uniqueOperators + uniqueOperands;

    const volume = length * Math.log2(vocabulary || 1);
    const difficulty = (uniqueOperators / 2) * (totalOperands / (uniqueOperands || 1));
    const effort = difficulty * volume;

    return {
      operators: totalOperators,
      operands: totalOperands,
      uniqueOperators,
      uniqueOperands,
      vocabulary,
      difficulty: Math.round(difficulty * 100) / 100,
      effort: Math.round(effort * 100) / 100,
    };
  }

  private findOperators(): string[] {
    const operators: string[] = [];

    const operatorPatterns = [
      ["=", "+=", "-=", "*=", "/=", "%=", "&&=", "||=", "??="],
      ["+", "-", "*", "/", "%", "**"],
      ["&&", "||", "!"],
      ["<", "<=", ">", ">=", "==", "===", "!=", "!=="],
      ["?", ":", "??"],
      ["=", "->", "=>", "=>"],
      ["++", "--"],
      ["...", "..."],
    ];

    for (const group of operatorPatterns) {
      for (const op of group) {
        const regex = new RegExp(op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        const matches = this.content.match(regex);
        if (matches) {
          operators.push(...matches);
        }
      }
    }

    // Keywords as operators
    const keywords =
      this.language === "php"
        ? ["if", "else", "elseif", "for", "foreach", "while", "switch", "case", "catch", "throw", "return", "new", "use"]
        : ["if", "else", "for", "while", "switch", "case", "catch", "throw", "return", "new", "import", "export"];

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      const matches = this.content.match(regex);
      if (matches) {
        operators.push(...matches);
      }
    }

    return operators;
  }

  private findOperands(): string[] {
    // Find identifiers, strings, numbers
    const operands: string[] = [];

    // Numbers
    const numberRegex = /\b\d+(?:\.\d+)?\b/g;
    const numbers = this.content.match(numberRegex);
    if (numbers) {
      operands.push(...numbers);
    }

    // String literals
    const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
    const strings = this.content.match(stringRegex);
    if (strings) {
      operands.push(...strings);
    }

    // Identifiers (simplified)
    const identifierRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
    const identifiers = this.content.match(identifierRegex) || [];

    // Filter out keywords
    const keywords = new Set([
      "if", "else", "elseif", "for", "foreach", "while", "switch", "case", "catch", "throw", "return", "new", "function", "const", "let", "var", "class", "interface", "type", "import", "export", "from", "default", "async", "await", "try", "finally", "this", "super", "typeof", "instanceof", "void", "null", "undefined", "true", "false", "public", "private", "protected", "static", "use",
    ]);

    for (const id of identifiers) {
      if (!keywords.has(id)) {
        operands.push(id);
      }
    }

    return operands;
  }
}
