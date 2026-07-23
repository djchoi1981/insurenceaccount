const fs = require('fs');
const js = fs.readFileSync('templates_data.js', 'utf8');
const types = new Set();
const regex = /type\s*:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(js)) !== null) {
  types.add(match[1]);
}
console.log(Array.from(types).join(', '));
