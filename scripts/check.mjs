// Static-site sanity checks — no deps. Run: node scripts/check.mjs
// 1) syntax-checks every inline <script> and every local .js file
// 2) verifies every local href/src target exists
// 3) checks js/i18n-zh.js dictionary is present/valid
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

let errors = 0;
const check = (msg) => { console.error('✗ ' + msg); errors++; };

// recursively collect .html files (skip dotdirs and node_modules)
function htmlWalk(dir) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = dir === '.' ? e.name : `${dir}/${e.name}`;
    if (e.isDirectory()) out = out.concat(htmlWalk(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// collect .js files (js/ and scripts/)
function jsFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => `${dir}/${f}`);
}
for (const jf of [...jsFiles('js'), ...jsFiles('scripts')]) {
  try { execSync(`node --check "${jf}"`, { stdio: 'pipe' }); }
  catch (e) { check(`JS syntax error in ${jf}`); }
}

const htmlFiles = htmlWalk('.');
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

  // local link targets — resolved relative to THIS file's directory
  const base = dirname(f);
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((x) => x[1])
    .filter((u) => !/^(https?:|mailto:|tel:|#|data:|\/)/.test(u));
  for (const u of links) {
    let p = u.split(/[?#]/)[0];
    if (!p) continue;
    if (p.endsWith('/')) p += 'index.html';   // folder link → its index.html
    if (!existsSync(resolve(base, p))) check(`missing local target: ${u}  (in ${f})`);
  }
}

// i18n: one set of English pages + js/i18n-zh.js dictionary (no zh-*.html mirrors)
if (existsSync('js/i18n-zh.js')) {
  try {
    const dict = readFileSync('js/i18n-zh.js', 'utf8');
    if (!/window\.I18N_ZH\s*=/.test(dict)) check('js/i18n-zh.js missing window.I18N_ZH assignment');
  } catch (e) { check('js/i18n-zh.js unreadable'); }
}


// content lint — banned terms must never reappear in published pages
const BANNED = [/\bmoney\b/i, /\b300k\b/, /6×/, /\bFPMS\b/, /casino/i, /iGaming/i, /gambling/i, /\bLark\b/, /SN Soft/, /Matrix\/Synapse|Synapse/];
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const re of BANNED) { const m = html.match(re); if (m) check(`banned term "${m[0]}" in ${f}`); }
}

if (errors) { console.error(`\n${errors} problem(s) found.`); process.exit(1); }
console.log('✓ all checks passed');
