/**
 * 批量替換 Select 組件的腳本
 * 將現有的 Select 組件替換為 SafeSelect 組件
 */

const fs = require('fs');
const path = require('path');

// 需要替換的文件列表
const filesToUpdate = [
  'resources/js/pages/Users/Create.tsx',
  'resources/js/pages/Users/Edit.tsx',
  'resources/js/pages/Users/Index.tsx',
  'resources/js/pages/Forms/Results.tsx',
  'resources/js/pages/Forms/Index.tsx',
  'resources/js/pages/Departments/Index.tsx',
  'resources/js/pages/Departments/Edit.tsx',
  'resources/js/pages/Departments/Create.tsx',
];

// 替換規則
const replacements = [
  {
    from: "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';",
    to: "import { SafeSelect, SafeSelectItem } from '@/components/ui/safe-select';"
  },
  {
    from: '<Select',
    to: '<SafeSelect'
  },
  {
    from: '</Select>',
    to: '</SafeSelect>'
  },
  {
    from: '<SelectItem',
    to: '<SafeSelectItem'
  },
  {
    from: '</SelectItem>',
    to: '</SafeSelectItem>'
  },
  {
    from: '<SelectTrigger>',
    to: '<SelectTrigger>'
  },
  {
    from: '<SelectValue',
    to: '<SelectValue'
  },
  {
    from: '<SelectContent>',
    to: '<SelectContent>'
  }
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    replacements.forEach(replacement => {
      if (content.includes(replacement.from)) {
        content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// 執行替換
console.log('🔄 Starting Select component replacement...');
filesToUpdate.forEach(updateFile);
console.log('✅ Replacement completed!');
