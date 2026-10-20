// Stamps each local stylesheet and script in index.html with a hash of its
// contents (style.css?v=1a2b3c4d), so browsers fetch a fresh copy after every
// change instead of mixing new and cached files. Run before committing; the
// pre-commit hook installed by tools/install-hooks.sh does this automatically.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const page = join(root, 'index.html');
const html = readFileSync(page, 'utf8');

const stamped = html.replace(/(href|src)="([\w-]+\.(?:css|js))(?:\?v=\w+)?"/g, (_, attr, file) => {
  const hash = createHash('sha256').update(readFileSync(join(root, file))).digest('hex').slice(0, 8);
  return `${attr}="${file}?v=${hash}"`;
});

if (stamped !== html) {
  writeFileSync(page, stamped);
  console.log('index.html: asset versions updated');
}
