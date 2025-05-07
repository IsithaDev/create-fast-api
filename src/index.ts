#!/usr/bin/env node

import * as p from "@clack/prompts";
import chalk from "chalk";
import path from "path";

import { ProjectConfig } from "./types";
import generateProject from "./utils/generateProject";

async function main() {
  p.intro(chalk.bgCyan(chalk.bold.black(" Create Node.js REST API ")));

  const project = await p.group(
    {
      projectName: () =>
        p.text({
          message: chalk.bold.cyan("What is your project name?"),
          placeholder: "server",
          validate(value) {
            if (!value) return "Project name/path is required!";

            // Overall character check (before normalization)
            if (/[^a-zA-Z0-9-_./\\]/.test(value)) {
              return "Input contains invalid characters. Use letters, numbers, hyphens, underscores, dots, slashes, backslashes.";
            }

            const normalizedPath = path.normalize(value);

            // Disallow '..' patterns
            if (
              normalizedPath === ".." ||
              normalizedPath.startsWith(".." + path.sep) ||
              normalizedPath.includes(path.sep + "..")
            ) {
              return "Path cannot contain or be '..', or start with '../' or '..\\'.";
            }

            // Check for absolute paths
            if (path.isAbsolute(value)) {
              // Allow if it resolves to the current working directory.
              if (path.resolve(value) !== process.cwd()) {
                return "Absolute paths are not allowed (unless it points to the current working directory).";
              }
            }

            const segments = normalizedPath.split(path.sep);

            for (const segment of segments) {
              // Allow "." as a segment, or an empty segment if it's the result of normalization (e.g. trailing slash)
              if (segment === "." || segment === "") continue;

              // Segment naming rule: allow alphanumeric, hyphen, underscore, and dots.
              // Must not be ONLY dots (e.g. "..." is bad; ".." is caught above).
              if (
                !/^[a-zA-Z0-9-_.]+$/.test(segment) ||
                (/^\.+$/.test(segment) && segment.length > 1)
              ) {
                return `Invalid path segment: "${segment}". Segments must be valid names (letters, numbers, '-', '_', '.') and not just multiple dots.`;
              }
            }

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

  try {
    await generateProject(project as ProjectConfig);

    s.stop(chalk.bold.green("Project generated successfully!"));

    p.outro(
      chalk.bold.green(
        `✅ Project "${project.projectName}" created successfully!\n\n` +
          `To get started:\n\n` +
          `  cd ${project.projectName}\n` +
          `  npm install\n` +
          `  npm run dev\n\n` +
          `Happy coding! 🚀`
      )
    );
  } catch (error) {
    s.stop(chalk.bold.red("Failed to generate project!"));
    p.log.error(
      chalk.red(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    process.exit(1);
  }
}

main().catch(console.error);
