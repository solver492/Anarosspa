import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // The dist directory is at the project root
  // Try multiple possible paths since the working directory varies
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "..", "dist", "public"),
    "/opt/render/project/dist/public",
  ];
  
  let distPath = "";
  for (const p of possiblePaths) {
    console.log(`[serveStatic] Checking: ${p} - exists: ${fs.existsSync(p)}`);
    if (fs.existsSync(p)) {
      distPath = p;
      break;
    }
  }
  
  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Tried: ${possiblePaths.join(", ")}`,
    );
  }

  console.log(`[serveStatic] Using dist path: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
