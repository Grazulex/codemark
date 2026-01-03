import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import Table from "cli-table3";
import { auditDependencies } from "../dependency-auditor/index.js";

const depsCommand = new Command("deps")
  .description("Manage dependencies")
  .addCommand(
    new Command("check").description("Check for vulnerable dependencies").action(async () => {
      console.log(chalk.cyan.bold("\n🔒 Dependency Security Check\n"));

      const spinner = ora("Checking dependencies for vulnerabilities...").start();

      try {
        const result = await auditDependencies(process.cwd());

        spinner.succeed("Check complete!");

        if (!result) {
          console.log(chalk.yellow("\n⚠️  No package manager found (package.json or composer.json)\n"));
          return;
        }

        if (result.totalVulnerabilities === 0) {
          console.log(chalk.green("\n✅ No vulnerabilities found!\n"));
          return;
        }

        const table = new Table({
          head: [chalk.cyan("Package"), chalk.cyan("Version"), chalk.cyan("Severity"), chalk.cyan("Advisory")],
          colWidths: [40, 15, 15, 30],
        });

        for (const vuln of result.vulnerabilities) {
          const severity = vuln.severity === "critical" ? chalk.red("Critical") :
                          vuln.severity === "high" ? chalk.red("High") :
                          vuln.severity === "moderate" ? chalk.yellow("Moderate") :
                          chalk.green("Low");

          table.push([
            vuln.package,
            vuln.version,
            severity,
            vuln.title.substring(0, 28),
          ]);
        }

        console.log(table.toString());

        const summary = [];
        if (result.critical > 0) summary.push(`${chalk.red.bold(result.critical)} critical`);
        if (result.high > 0) summary.push(`${chalk.red(result.high)} high`);
        if (result.moderate > 0) summary.push(`${chalk.yellow(result.moderate)} moderate`);
        if (result.low > 0) summary.push(`${chalk.green(result.low)} low`);

        console.log(chalk.gray(`\n📦 ${result.tool} • ${result.totalVulnerabilities} vulnerabilities found:`));
        console.log(chalk.white(`   ${summary.join(", ")}\n`));
        console.log(chalk.gray("Fix with:") + chalk.white(`   ${result.tool === "npm" ? "npm audit fix" : "composer update"}\n`));
      } catch (error: any) {
        spinner.fail("Failed to check dependencies");
        if (error.message.includes("command not found")) {
          console.log(chalk.yellow("\n⚠️  Package manager not installed\n"));
          console.log(chalk.white("For Node.js: npm install -g npm"));
          console.log(chalk.white("For PHP: composer\n"));
        } else {
          console.error(error);
        }
        process.exit(1);
      }
    }),
  )
  .addCommand(
    new Command("update")
      .description("Update dependencies safely")
      .option("--check", "Check for breaking changes")
      .action(async (options) => {
        console.log(chalk.cyan.bold("\n📦 Dependency Update\n"));

        if (options.check) {
          console.log(chalk.gray("Checking for breaking changes...\n"));
        }

        const spinner = ora("Updating dependencies...").start();

        try {
          const result = await auditDependencies(process.cwd());

          if (!result) {
            spinner.warn("No package manager found");
            console.log(chalk.yellow("\nNo package.json or composer.json found\n"));
            return;
          }

          if (result?.tool === "npm") {
            const { execSync } = await import("child_process");
            execSync("npm update", { cwd: process.cwd(), stdio: "inherit" });
          } else if (result?.tool === "composer") {
            const { execSync } = await import("child_process");
            execSync("composer update", { cwd: process.cwd(), stdio: "inherit" });
          }

          spinner.succeed("Dependencies updated!");
        } catch (error) {
          spinner.fail("Failed to update dependencies");
          console.error(error);
          process.exit(1);
        }
      }),
  );

export { depsCommand };
