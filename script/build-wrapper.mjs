#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current working directory
let cwd = process.cwd();
console.log(`[wrapper] Current directory: ${cwd}`);

// If we're in src directory and node_modules is not here, go up one level
if (existsSync(resolve(cwd, "src")) && !existsSync(resolve(cwd, "node_modules"))) {
  console.log(`[wrapper] Found src directory without node_modules, changing to parent directory`);
  cwd = resolve(cwd, "..");
  process.chdir(cwd);
}

console.log(`[wrapper] Working directory: ${process.cwd()}`);
console.log(`[wrapper] Node modules exists: ${existsSync(resolve(process.cwd(), "node_modules"))}`);

// Now run the actual build script
console.log(`[wrapper] Running build script...`);
try {
  execSync("node ./script/build.mjs", { stdio: "inherit", cwd: process.cwd() });
} catch (error) {
  console.error(`[wrapper] Build failed:`, error.message);
  process.exit(1);
}
