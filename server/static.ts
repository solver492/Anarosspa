import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Resolve the dist directory relative to the project root
  // In production, dist is at the root level (not in src/)
  const projectRoot = path.resolve(process.cwd());
  const distPath = path.join(projectRoot, "dist", "public");
  
  console.log(`[serveStatic] Looking for dist at: ${distPath}`);
  console.log(`[serveStatic] Current working directory: ${process.cwd()}`);
  console.log(`[serveStatic] Directory exists: ${fs.existsSync(distPath)}`);
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
