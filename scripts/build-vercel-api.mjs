import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

const entryPoint = resolve(repoRoot, 'apps/api/src/vercel.ts');
const outputTargets = [
  resolve(repoRoot, 'api/index.js'),
  resolve(repoRoot, 'apps/web/api/index.js'),
];

const esmNodeBanner = [
  "import { createRequire as __ffCreateRequire } from 'node:module';",
  "import { fileURLToPath as __ffFileURLToPath } from 'node:url';",
  "import { dirname as __ffDirname } from 'node:path';",
  'const require = __ffCreateRequire(import.meta.url);',
  'const __filename = __ffFileURLToPath(import.meta.url);',
  'const __dirname = __ffDirname(__filename);',
].join(' ');

for (const outfile of outputTargets) {
  mkdirSync(dirname(outfile), { recursive: true });
  await build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    banner: { js: esmNodeBanner },
    outfile,
    logLevel: 'info',
  });
}
