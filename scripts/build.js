import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const out = join(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out);

for (const file of ["index.html", "style.css", "script.js"]) {
  cpSync(join(root, file), join(out, file));
}
cpSync(join(root, "landing", "dist"), join(out, "landing"), { recursive: true });

console.log("Static site assembled in dist/");
