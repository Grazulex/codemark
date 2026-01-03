import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export const initCommand = new Command("init")
  .description("Initialize CodeMark in your project")
  .action(async () => {
    console.log(chalk.cyan.bold("\n🎨 CodeMark Initialization\n"));

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: process.cwd().split("/").pop(),
      },
      {
        type: "list",
        name: "language",
        message: "Primary language:",
        choices: [
          { name: "TypeScript/JavaScript", value: "typescript" },
          { name: "Python", value: "python" },
          { name: "PHP", value: "php" },
          { name: "Go", value: "go" },
        ],
      },
      {
        type: "checkbox",
        name: "standards",
        message: "Select standards to enforce:",
        choices: [
          { name: "Line length (100 chars)", value: "line-length" },
          { name: "No console in production", value: "no-console" },
          { name: "Require semicolons (JS/TS)", value: "semicolons" },
          { name: "Single quotes", value: "single-quotes" },
          { name: "2 space indentation", value: "indentation" },
        ],
      },
      {
        type: "confirm",
        name: "enableAutoFix",
        message: "Enable automatic fixing?",
        default: true,
      },
    ]);

    const spinner = ora("Creating .codemark.yml configuration...").start();

    try {
      const config = {
        project: answers.projectName,
        language: answers.language,
        standards: answers.standards,
        autoFix: answers.enableAutoFix,
        patterns: {
          include: ["*.{js,ts,jsx,tsx,py,php,go}"],
          exclude: ["node_modules", "dist", "build", ".git"],
        },
      };

      writeFileSync(join(process.cwd(), ".codemark.yml"), JSON.stringify(config, null, 2));

      spinner.text = "Creating configuration files...";
      spinner.succeed("Configuration created successfully!");

      console.log(chalk.green("\n✅ CodeMark initialized!\n"));
      console.log(chalk.gray("Run these commands to get started:"));
      console.log(chalk.white("  codemark check     - Check code quality\n"));
      console.log(chalk.white("  codemark fix       - Auto-fix issues\n"));
      console.log(chalk.white("  codemark report    - Generate quality report\n"));
      console.log(chalk.white("  codemark trends    - Show quality trends\n"));
    } catch (error) {
      spinner.fail("Failed to initialize CodeMark");
      console.error(error);
    }
  });
