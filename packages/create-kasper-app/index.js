#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, copyFileSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const projectName = process.argv[2] || "kasper-app";

if (existsSync(projectName)) {
  console.error(`Error: directory "${projectName}" already exists.`);
  process.exit(1);
}

const templateDir = join(__dirname, "template");
const targetDir = join(process.cwd(), projectName);

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(templateDir, targetDir);

// Replace project name placeholder in package.json
const pkgPath = join(targetDir, "package.json");
const pkg = readFileSync(pkgPath, "utf-8").replace(/\{\{project-name\}\}/g, projectName);
writeFileSync(pkgPath, pkg);

console.log(`\nScaffolded project in ${projectName}/\n`);
console.log("  cd " + projectName);
console.log("  npm install");
console.log("  npm run dev\n");
