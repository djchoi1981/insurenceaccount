const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf-8');
const scriptMatches = content.match(/<script>([\s\S]*?)<\/script>/gi);
if (scriptMatches) {
  let combined = '';
  scriptMatches.forEach(match => {
    combined += match.replace(/<\/?script>/gi, '') + '\n';
  });
  fs.writeFileSync('extracted_script2.js', combined);
  console.log('Extracted script to extracted_script2.js');
}
