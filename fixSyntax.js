const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');

const fixInFiles = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixInFiles(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix single quote wrapped template literals
      // Like: '${import.meta.env.VITE_API_URL || ''}/api/auth/register'
      // It has nested single quotes which break syntax.
      // Easiest is to search for the exact broken pattern and replace it
      
      const pattern = /'\$\{import\.meta\.env\.VITE_API_URL \|\| ''\}([^']+)'/g;
      
      if (pattern.test(content)) {
        content = content.replace(pattern, '`${import.meta.env.VITE_API_URL || ""}$1`');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed syntax in ${fullPath}`);
      } else if (content.includes("${import.meta.env.VITE_API_URL || ''}")) {
        // Just in case it's broken some other way, let's catch it manually
        content = content.replace(/'\$\{import\.meta\.env\.VITE_API_URL \|\| ''\}(.*?)'/g, '`${import.meta.env.VITE_API_URL || ""}$1`');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed fallback syntax in ${fullPath}`);
      }
    }
  });
};

fixInFiles(directoryPath);
