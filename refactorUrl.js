const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');

const replaceInFiles = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        content = content.replace(/http:\/\/localhost:5000/g, "${import.meta.env.VITE_API_URL || ''}");
        // Note: this assumes it's within backticks! If it's in single quotes like 'http://localhost:5000/api...', it will become '${import.meta.env.VITE_API_URL || ''}/api...'. 
        // We need to convert single quotes to backticks for fetch calls!
        
        // Convert 'http://localhost:5000...' to `${import.meta.env.VITE_API_URL || ''}...`
        content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL || ""}$1`');
        // Convert "http://localhost:5000..." to `${import.meta.env.VITE_API_URL || ''}...`
        content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${import.meta.env.VITE_API_URL || ""}$1`');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in ${fullPath}`);
      }
    }
  });
};

replaceInFiles(directoryPath);
