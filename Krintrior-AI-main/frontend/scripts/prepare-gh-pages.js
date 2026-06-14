#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const basePath = "/Krinterior-AI/app";
const distDir = path.join(__dirname, "..", "dist");
const targetExts = new Set([".html", ".js", ".css"]);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!targetExts.has(path.extname(entry.name))) continue;
    const original = fs.readFileSync(fullPath, "utf8");
    let updated = original.replace(/(["'(=])\/(assets|_expo|favicon\.ico)/g, `$1${basePath}/$2`);
    updated = updated.replace(
      /getUrlWithReactNavigationConcessions=function\(t,n=""\)/g,
      `getUrlWithReactNavigationConcessions=function(t,n="${basePath}")`,
    );
    updated = updated.replace(
      /function ([A-Za-z_$][\w$]*)\(t,a=""\)\{return a\?t\.replace\(/g,
      `function $1(t,a="${basePath}"){return a?t.replace(`,
    );
    if (updated !== original) fs.writeFileSync(fullPath, updated);
  }
}

if (!fs.existsSync(distDir)) {
  console.error("dist folder not found. Run expo export before prepare-gh-pages.");
  process.exit(1);
}

walk(distDir);
fs.copyFileSync(path.join(distDir, "index.html"), path.join(distDir, "404.html"));
console.log(`Prepared Expo web export for ${basePath}`);
