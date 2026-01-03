import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import Table from "cli-table3";

export const trendsCommand = new Command("trends")
  .description("Show code quality trends over time")
  .option("--days <n>", "Show trends for last n days", "30")
  .action(async (options) => {
    console.log(chalk.cyan.bold(`\n📈 Quality Trends (Last ${options.days} days)\n`));

    const spinner = ora("Loading historical data...").start();

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      spinner.succeed("Data loaded!");

      const table = new Table({
        head: [chalk.cyan("Date"), chalk.cyan("Score"), chalk.cyan("Coverage"), chalk.cyan("Issues")],
        colWidths: [20, 15, 15, 15],
      });

      // Mock data
      const dates = [
        "2025-12-01",
        "2025-12-05",
        "2025-12-10",
        "2025-12-15",
        "2025-12-20",
        "2025-12-25",
        "2025-12-30",
        "2026-01-01",
        "2026-01-03",
      ];

      dates.forEach((date, index) => {
        const score = 75 + index * 2;
        const coverage = 80 + index * 1;
        const issues = Math.max(0, 15 - index * 2);

        table.push([date, `${score}/100`, `${coverage}%`, issues.toString()]);
      });

      console.log(table.toString());

      console.log(chalk.green("\n📊 Trend Analysis:"));
      console.log(chalk.white("  Quality score: +22 points"));
      console.log(chalk.white("  Test coverage: +9%"));
      console.log(chalk.white("  Issues resolved: -15\n"));
    } catch (error) {
      spinner.fail("Failed to load trends");
      console.error(error);
      process.exit(1);
    }
  });
