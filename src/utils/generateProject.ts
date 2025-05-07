import fs from "fs-extra";
import path from "path";
// import { fileURLToPath } from "url";

import { ProjectConfig } from "../types";
import copyRecursiveSync from "./copyRecursiveSync";

async function generateProject(config: ProjectConfig) {
  const templateSourceDir = path.resolve(
    __dirname,
    "..",
    "templates",
    config.language
  );
  // config.projectName is the path relative to cwd (e.g., "my-app", "./my-app", ".") or an absolute path to cwd.
  const projectDestDir = path.resolve(process.cwd(), config.projectName);

  let projectPackageName: string;

  // Determine the name for package.json
  if (projectDestDir === process.cwd()) {
    // If project is in current directory, use current directory's name
    projectPackageName = path.basename(process.cwd());
  } else {
    // Otherwise, use the last segment of the destination path
    projectPackageName = path.basename(projectDestDir);
  }

  // Sanitize the project name for package.json
  projectPackageName = projectPackageName
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9_-]+/g, ""); // Remove other invalid characters (keeps letters, numbers, _,

  // Further checks for typical npm package name rules (simplified)
  if (!projectPackageName) {
    projectPackageName = "my-app"; // Fallback if sanitization results in empty string
    console.warn(
      `Warning: Could not derive a valid project name. Using "${projectPackageName}". You may need to adjust package.json manually.`
    );
  } else if (projectPackageName.length > 214) {
    projectPackageName = projectPackageName.substring(0, 214); // Max length for package name
    console.warn(
      `Warning: Derived project name was too long and has been truncated to "${projectPackageName}". You may need to adjust package.json manually.`
    );
  }

  if (
    projectPackageName.startsWith(".") ||
    projectPackageName.startsWith("_")
  ) {
    const originalName = projectPackageName;
    projectPackageName = `app-${projectPackageName.replace(/^[._]+/, "")}`; // Prepend "app-" if it starts with . or _
    if (!projectPackageName || projectPackageName === "app-")
      projectPackageName = "my-app"; // Ensure it's not empty after modification
    console.warn(
      `Warning: Derived project name "${originalName}" started with an invalid character and was adjusted to "${projectPackageName}". You may need to adjust package.json manually.`
    );
  }

  if (!fs.existsSync(templateSourceDir)) {
    throw new Error(`Template directory not found: ${templateSourceDir}`);
  }

  console.log(templateSourceDir, projectDestDir, projectPackageName);

  copyRecursiveSync(
    templateSourceDir,
    projectDestDir,
    projectPackageName,
    true
  );
}

export default generateProject;
