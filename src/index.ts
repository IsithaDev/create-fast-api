#!/usr/bin/env node

import * as p from "@clack/prompts";
import chalk from "chalk";

async function main() {
  p.intro(chalk.bgCyan(chalk.bold.black(" Create Node.js REST API ")));

  const project = await p.group(
    {
      projectName: () =>
        p.text({
          message: chalk.bold.cyan("What is your project name?"),
          placeholder: "server",
          validate(value) {
            if (!value) return "Project name is required!";
            if (!/^[a-z0-9-_]+$/i.test(value))
              return "Project name can only contain letters, numbers, hyphens, and underscores";
            return;
          },
        }),
      language: () =>
        p.select({
          message: chalk.bold.cyan("Select the language for your project:"),
          options: [
            { value: "typescript", label: "TypeScript" },
            { value: "javascript", label: "JavaScript" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  const s = p.spinner();
  s.start(chalk.bold.greenBright("Generating project..."));
}

main().catch(console.error);
