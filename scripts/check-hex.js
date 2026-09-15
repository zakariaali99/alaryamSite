import fs from 'fs';
import path from 'path';

function findHexInDir(dir) {
  let errors = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      errors = errors.concat(findHexInDir(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Match raw hex like #0D07AD or #fff but ignore comments or CSS if any
        const match = line.match(/#[0-9a-fA-F]{3,8}\b/);
        if (match) {
          errors.push({
            file: fullPath,
            line: idx + 1,
            hex: match[0],
            content: line.trim(),
          });
        }
      });
    }
  }
  return errors;
}

const errors = findHexInDir(path.resolve('src'));

if (errors.length > 0) {
  console.error('❌ Found raw hex colors in src/ files:');
  errors.forEach(e => {
    console.error(`  ${path.relative(process.cwd(), e.file)}:${e.line} -> ${e.hex} in "${e.content}"`);
  });
  process.exit(1);
} else {
  console.log('✅ check:hex passed: zero raw hex colors in src/ components or scripts.');
  process.exit(0);
}
