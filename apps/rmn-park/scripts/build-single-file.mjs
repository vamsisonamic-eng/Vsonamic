/**
 * Bundles the park into ONE self-contained index.html (inline JS + CSS,
 * no external requests) for preview hosting under strict CSP.
 *   node scripts/build-single-file.mjs [outfile]
 */
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || resolve(root, 'dist-preview/index.html');

// 1. JS bundle (React + R3F + three + GSAP, minified)
const js = await build({
  entryPoints: [resolve(root, 'preview/entry.jsx')],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  jsx: 'automatic',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  alias: { '@': root },
  define: { 'process.env.NODE_ENV': '"production"' },
  absWorkingDir: root,
});

// 2. Tailwind CSS for the overlay classes
execSync(
  `npx tailwindcss -i app/globals.css -o dist-preview/preview.css --minify`,
  { cwd: root, stdio: 'inherit' },
);
const css = readFileSync(resolve(root, 'dist-preview/preview.css'), 'utf8');

// 3. Compose the single file
const html = `<title>The Ad-Tech Amusement Park — how ads find you</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}</style>
<div id="root"></div>
<script>${js.outputFiles[0].text}</script>`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
