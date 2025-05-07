import fs from "fs-extra";
import path from "path";

function copyRecursiveSync(
  source: string,
  target: string,
  projectPackageName: string,
  isTopLevelCall: boolean = true
) {
  const targetExists = fs.existsSync(target);

  // Create target directory if it doesn't exist
  // For the top-level call, if the target is not the current working directory, create it.
  // For subsequent calls (subdirectories), always create if it doesn't exist.
  if (isTopLevelCall) {
    if (target !== process.cwd() && !targetExists) {
      fs.mkdirSync(target, { recursive: true });
    }
    // If target is CWD, or already exists, do nothing here for creation.
  } else {
    // This case handles creation of subdirectories like 'src', 'src/config' etc.
    if (!targetExists) {
      fs.mkdirSync(target, { recursive: true });
    }
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    // Skip files/folders that should not be part of the generated project
    if (entry.name === "node_modules" || entry.name === "pnpm-lock.yaml") {
      continue;
    }

    if (entry.isDirectory()) {
      copyRecursiveSync(sourcePath, targetPath, projectPackageName, false);
    } else if (entry.isFile()) {
      if (entry.name === "package.json") {
        const content = fs.readFileSync(sourcePath, "utf-8");
        const packageJson = JSON.parse(content);
        packageJson.name = projectPackageName;
        delete packageJson.packageManager; // Remove template-specific packageManager
        fs.writeFileSync(
          targetPath,
          JSON.stringify(packageJson, null, 2) + "\\n"
        );
      } else {
        // Directly copy other files like .gitignore, .env.local, tsconfig.json, etc.
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }
}

export default copyRecursiveSync;
