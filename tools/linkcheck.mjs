/**
 * chseets - simple link checker
 * Checks all Markdown files for valid HTTP/HTTPS links.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const files = [];

// Directories to exclude from link checking
const excludeDirs = ["node_modules", ".git", ".github", "build", "dist"];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    // Skip excluded directories
    if (excludeDirs.includes(entry)) continue;
    
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".md")) files.push(full);
  }
}

walk(root);

let errors = 0;
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g) || [];
  for (const match of matches) {
    const url = match.match(/\((https?:\/\/[^\)]+)\)/)[1];
    try {
      execSync(`curl -I --silent --max-time 10 "${url}"`);
      console.log(`✅ ${url}`);
    } catch {
      console.warn(`⚠️ Broken link in ${file}: ${url}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} broken links found.`);
  process.exit(1);
} else {
  console.log("\nAll links OK.");
}
