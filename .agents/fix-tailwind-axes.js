const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Asif Computer\\Lendly\\frontend\\src';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(srcDir);
let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Regex patterns:
  // Case A: (optionalPrefix:)w-VALUE (optionalPrefix:)h-VALUE
  // e.g. w-16 h-16 -> size-16, md:w-4 md:h-4 -> md:size-4
  // We use \b at boundaries.
  const regexW_H = /\b(([a-zA-Z0-9\-:]+:)?w-([a-zA-Z0-9\.\-\[\]]+))\s+\2h-\3\b/g;
  content = content.replace(regexW_H, (match, p1, prefix, val) => {
    const replacement = `${prefix || ''}size-${val}`;
    console.log(`[${path.basename(file)}] Replaced "${match}" with "${replacement}"`);
    totalReplaced++;
    return replacement;
  });

  // Case B: (optionalPrefix:)h-VALUE (optionalPrefix:)w-VALUE
  // e.g. h-16 w-16 -> size-16, md:h-4 md:w-4 -> md:size-4
  const regexH_W = /\b(([a-zA-Z0-9\-:]+:)?h-([a-zA-Z0-9\.\-\[\]]+))\s+\2w-\3\b/g;
  content = content.replace(regexH_W, (match, p1, prefix, val) => {
    const replacement = `${prefix || ''}size-${val}`;
    console.log(`[${path.basename(file)}] Replaced "${match}" with "${replacement}"`);
    totalReplaced++;
    return replacement;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`\nTailwind sizing replacement complete. Total replacements: ${totalReplaced}`);
