import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entryFiles = [
  "api/baseball-command.ts",
  "api/baseball-room-command.ts",
  "api/bang-leave.ts",
];

function readJson(relativePath: string) {
  return JSON.parse(readFileSync(path.join(projectRoot, relativePath), "utf8"));
}

function relativeSpecifiers(source: string) {
  const specifiers: string[] = [];
  const pattern = /(?:\bfrom\s*|^\s*import\s*)["'](\.\.?\/[^"']+)["']/gm;
  for (const match of source.matchAll(pattern)) specifiers.push(match[1]);
  return specifiers;
}

function sourcePathForSpecifier(importer: string, specifier: string) {
  const resolved = path.resolve(path.dirname(importer), specifier);
  if (existsSync(resolved)) return resolved;
  if (specifier.endsWith(".js")) {
    const typescriptSource = `${resolved.slice(0, -3)}.ts`;
    if (existsSync(typescriptSource)) return typescriptSource;
  }
  return null;
}

test("Vercel 함수 출력은 TypeScript 상대 경로를 실행 가능한 .js 경로로 변환한다", () => {
  const packageJson = readJson("package.json");
  const tsconfig = readJson("tsconfig.json");

  assert.equal(packageJson.devDependencies?.typescript, "5.9.3");
  assert.equal(tsconfig.compilerOptions?.target, "ES2022");
  assert.equal(tsconfig.compilerOptions?.module, "NodeNext");
  assert.equal(tsconfig.compilerOptions?.moduleResolution, "NodeNext");
  assert.equal(tsconfig.compilerOptions?.allowImportingTsExtensions, true);
  assert.equal(tsconfig.compilerOptions?.rewriteRelativeImportExtensions, true);

  const pending = entryFiles.map((file) => path.join(projectRoot, file));
  const visited = new Set<string>();
  while (pending.length > 0) {
    const sourceFile = pending.pop()!;
    if (visited.has(sourceFile)) continue;
    visited.add(sourceFile);

    const source = readFileSync(sourceFile, "utf8");
    for (const specifier of relativeSpecifiers(source)) {
      assert.match(
        specifier,
        /\.(?:[cm]?ts|tsx|[cm]?js|jsx|json)$/,
        `${path.relative(projectRoot, sourceFile)} has an extensionless relative import: ${specifier}`,
      );
      const dependency = sourcePathForSpecifier(sourceFile, specifier);
      assert.ok(dependency, `${specifier} imported by ${sourceFile} must exist`);
      if (/\.[cm]?ts$/.test(dependency)) pending.push(dependency);
    }
  }

  assert.ok(visited.size > entryFiles.length, "the transitive server module graph must be checked");
});
