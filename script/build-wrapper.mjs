#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current working directory
let cwd = process.cwd();
console.log(`[wrapper] Initial directory: ${cwd}`);

// Check if node_modules exists in current directory
const hasNodeModulesHere = existsSync(resolve(cwd, "node_modules"));
const hasNodeModulesParent = existsSync(resolve(cwd, "..", "node_modules"));

console.log(`[wrapper] node_modules in current dir: ${hasNodeModulesHere}`);
console.log(`[wrapper] node_modules in parent dir: ${hasNodeModulesParent}`);

// If node_modules is in parent but not here, go up one level
if (!hasNodeModulesHere && hasNodeModulesParent) {
  console.log(`[wrapper] Changing to parent directory where node_modules exists`);
  cwd = resolve(cwd, "..");
  process.chdir(cwd);
}

console.log(`[wrapper] Final working directory: ${process.cwd()}`);
console.log(`[wrapper] Node modules exists: ${existsSync(resolve(process.cwd(), "node_modules"))}`);

// Now run the actual build script
console.log(`[wrapper] Running build script...`);
try {
  execSync("node ./script/build.mjs", { stdio: "inherit", cwd: process.cwd() });
} catch (error) {
  console.error(`[wrapper] Build failed:`, error.message);
  process.exit(1);
}
