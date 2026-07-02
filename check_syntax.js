const fs = require('fs');
const html = fs.readFileSync('/Users/djchoi81/Library/CloudStorage/GoogleDrive-djchoi19810402@gmail.com/내 드라이브/보험금 청구 에이전트/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  fs.writeFileSync('extracted_script.js', scriptMatch[1]);
  console.log('Script extracted.');
} else {
  console.log('No script found.');
}
