#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { checkCommand } from "./commands/check.js";
import { fixCommand } from "./commands/fix.js";
import { reportCommand } from "./commands/report.js";
import { trendsCommand } from "./commands/trends.js";
import { depsCommand } from "./commands/deps.js";
import { standardsCommand } from "./commands/standards.js";

const program = new Command();

program
  .name("codemark")
  .description("Code quality and standards management CLI tool")
  .version("0.1.0");

// Add commands
program.addCommand(initCommand);
program.addCommand(checkCommand);
program.addCommand(fixCommand);
program.addCommand(reportCommand);
program.addCommand(trendsCommand);
program.addCommand(depsCommand);
program.addCommand(standardsCommand);

// Parse arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
