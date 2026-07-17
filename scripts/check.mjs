// Static-site sanity checks — no deps. Run: node scripts/check.mjs
// 1) syntax-checks every inline <script> and every local .js file
// 2) verifies every local href/src target exists
// 3) checks EN/zh page parity (every zh-*.html has a non-zh twin and vice-versa)
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

let errors = 0;
const check = (msg) => { console.error('✗ ' + msg); errors++; };

// collect .js files (js/ and scripts/)
function jsFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => `${dir}/${f}`);
}
for (const jf of [...jsFiles('js'), ...jsFiles('scripts')]) {
  try { execSync(`node --check "${jf}"`, { stdio: 'pipe' }); }
  catch (e) { check(`JS syntax error in ${jf}`); }
}

const htmlFiles = readdirSync('.').filter((f) => f.endsWith('.html'));
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');

  // inline scripts (exclude importmap + external-src)
  const re = /<script(?![^>]*\bsrc=)(?![^>]*type="importmap")[^>]*>([\s\S]*?)<\/script>/g;
  let m, i = 0;
  while ((m = re.exec(html))) {
    if (!m[1].trim()) continue;
    const tmp = `/tmp/_chk_${f.replace(/\W/g, '_')}_${i}.mjs`;
    writeFileSync(tmp, m[1]);
    try { execSync(`node --check "${tmp}"`, { stdio: 'pipe' }); }
    catch (e) { check(`JS syntax error in ${f} (inline block ${i})`); }
    i++;
  }

  // local link targets
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((x) => x[1])
    .filter((u) => !/^(https?:|mailto:|tel:|#|data:|\/)/.test(u));
  for (const u of links) {
    const p = u.split(/[?#]/)[0];
    if (p && !existsSync(p)) check(`missing local target: ${p}  (in ${f})`);
  }
}

// EN / zh parity
for (const f of htmlFiles) {
  if (f === '404.html') continue;
  const twin = f.startsWith('zh-') ? f.slice(3) : `zh-${f}`;
  if (!existsSync(twin)) check(`bilingual parity: ${f} has no counterpart ${twin}`);
}

if (errors) { console.error(`\n${errors} problem(s) found.`); process.exit(1); }
console.log('✓ all checks passed');
