/**
 * chseets - sheet validator
 * Validates YAML front matter in Markdown files against sheet.schema.json.
 */
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(
  fs.readFileSync("docs/specs/sheet.schema.json", "utf8")
);
const validate = ajv.compile(schema);

function extractFrontMatter(text) {
  const match = /^---\n([\s\S]+?)\n---/.exec(text);
  return match ? yaml.load(match[1]) : null;
}

const files = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".md")) files.push(full);
  }
}
walk("sheets");

let validCount = 0;
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const meta = extractFrontMatter(content);
  if (!meta) {
    console.error(`❌ Missing front matter: ${file}`);
    continue;
  }
  const ok = validate(meta);
  if (!ok) {
    console.error(`❌ Validation failed: ${file}`);
    console.error(validate.errors);
  } else {
    console.log(`✔ Valid: ${file}`);
    validCount++;
  }
}

console.log(`\nValidated ${validCount}/${files.length} sheets.`);
process.exit(0);
