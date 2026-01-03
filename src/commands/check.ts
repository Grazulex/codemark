import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { runLinters, detectLanguages } from "../linters/index.js";

export const checkCommand = new Command("check")
  .description("Run all code quality checks")
  .option("--fix", "Auto-fix issues")
  .action(async (options) => {
    console.log(chalk.cyan.bold("\n🔍 CodeMark Checks\n"));

    const configPath = join(process.cwd(), ".codemark.yml");

    if (!existsSync(configPath)) {
      console.log(chalk.red("❌ CodeMark not initialized in this project"));
      console.log(chalk.gray("Run 'codemark init' to get started\n"));
      process.exit(1);
    }

    const languages = detectLanguages(process.cwd());
    const spinner = ora("Running code quality checks...").start();

    try {
      spinner.text = `Linting with ${languages.join(", ")}...`;

      const results = await runLinters(process.cwd(), languages);

      if (results.length === 0) {
        spinner.warn("No linters available");
        console.log(chalk.yellow("\n⚠️  No linters found or installed.\n"));
        console.log(chalk.white("For TypeScript/JavaScript: ensure ESLint is installed"));
        console.log(chalk.white("For PHP: ensure Laravel Pint is installed (composer require laravel/pint --dev)\n"));
        return;
      }

      spinner.succeed("Checks completed!");

      let totalErrors = 0;
      let totalWarnings = 0;
      let filesWithIssues = 0;

      for (const result of results) {
        totalErrors += result.totalErrors;
        totalWarnings += result.totalWarnings;
        filesWithIssues += result.files.filter((f) => f.errors.length > 0 || f.warnings.length > 0).length;

        console.log(chalk.yellow(`\n📦 ${result.tool}\n`));

        for (const file of result.files) {
          if (file.errors.length > 0 || file.warnings.length > 0) {
            const relPath = file.path.replace(process.cwd(), "");
            console.log(chalk.white(`  ${relPath}`));

            for (const error of [...file.errors, ...file.warnings]) {
              const severity = error.severity === "error" ? chalk.red("✗") : chalk.yellow("⚠");
              const location = error.line ? `:${error.line}` : "";
              console.log(`    ${severity} ${error.message}${location} [${error.rule}]`);
            }
          }
        }
      }

      console.log(chalk.gray("\n─────────────────────────────────────"));
      console.log(chalk.white(`  Files analyzed: ${results.reduce((acc, r) => acc + r.files.length, 0)}`));
      console.log(chalk.red(`  Errors: ${totalErrors}`));
      console.log(chalk.yellow(`  Warnings: ${totalWarnings}`));
      console.log(chalk.white(`\n✅ Checks completed!\n`));

      if (totalErrors > 0) {
        process.exit(1);
      }
    } catch (error) {
      spinner.fail("Checks failed");
      console.error(error);
      process.exit(1);
    }
  });
