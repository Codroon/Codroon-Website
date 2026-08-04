/**
 * Runs a compiled script from scripts/tsconfig.scripts.json.
 *
 * tsc resolves the "@/*" path alias at type-check time but emits it
 * verbatim, so Node needs the same mapping at require time.
 *
 *   node scripts/run-compiled.cjs <outDir> <entry-relative-to-outDir>
 */
const path = require("node:path");
const Module = require("node:module");

const outDir = path.resolve(process.argv[2]);
const entry = process.argv[3];

const original = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === "string" && request.startsWith("@/")) {
    request = path.join(outDir, "src", request.slice(2));
  }
  return original.call(this, request, ...rest);
};

require(path.join(outDir, entry));
