const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Asif Computer\\ShareHood\\frontend\\src';

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

  // Match '<button' not followed by 'type=' before the closing '>'
  // Using negative lookahead to check for type=
  const buttonRegex = /<button\b(?![^>]*\btype=)([^>]*)/g;
  
  content = content.replace(buttonRegex, (match, p1) => {
    const replacement = `<button type="button"${p1}`;
    console.log(`[${path.basename(file)}] Added type="button" to button element`);
    totalReplaced++;
    return replacement;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`\nExplicit button types complete. Total replacements: ${totalReplaced}`);
