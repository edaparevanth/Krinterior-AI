#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");

const expoBin = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(expoBin, ["expo", "export", "-p", "web"], {
  cwd: path.join(__dirname, ".."),
  env: {
    ...process.env,
    EXPO_BASE_URL: "/Krinterior-AI/app",
  },
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

require("./prepare-gh-pages");
