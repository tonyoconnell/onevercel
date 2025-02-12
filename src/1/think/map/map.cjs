// Map System for ONE
// =================

const fs = require('fs');
const path = require('path');

const ONE_MAP = {
  core: {
    '1.ts': 'Core ONE system',
    '1.yaml': 'Configuration file',
    '1.html': 'Base HTML template',
    '1.log': 'System logs'
  },
  
  api: {
    '1.ts': 'Main API endpoint',
    '1.test.ts': 'API test endpoint',
    '1.yaml': 'API configuration'
  },
  
  system: {
    'monitor.ts': 'System monitoring',
    'registry.ts': 'Capability registry',
    'test.ts': 'Testing system',
    'map.cjs': 'File mapping'
  }
};

function generateFileMap(dir = '1') {
  const items = fs.readdirSync(dir);
  const map = {};

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      map[item] = generateFileMap(fullPath);
    } else {
      map[item] = {
        size: stat.size,
        modified: stat.mtime,
        description: ONE_MAP.core[item] || 
                    ONE_MAP.api[item] || 
                    ONE_MAP.system[item] || 
                    'Additional file'
      };
    }
  }

  return map;
}

module.exports = {
  ONE_MAP,
  generateFileMap,
  
  // Generate current map
  get current() {
    return generateFileMap();
  },
  
  // Get file description
  getDescription(file) {
    const [category, name] = file.split('/');
    return ONE_MAP[category]?.[name] || 'Additional file';
  }
};