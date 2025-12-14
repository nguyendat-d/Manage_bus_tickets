#!/usr/bin/env node

/**
 * Script để tự động migrate các file còn lại sang hệ thống thông báo mới
 * Chạy: node migrate-notifications.js
 */

const fs = require('fs');
const path = require('path');

// Danh sách các patterns cần thay thế
const replacements = [
  {
    pattern: /console\.error\(['"]Error[^'"]*['"],\s*error\);?\s*\n/g,
    replacement: ''
  },
  {
    pattern: /console\.log\(['"].*?response.*?['"],\s*[^)]+\);?\s*\n/g,
    replacement: ''
  },
  {
    pattern: /error\.response\?\.\data\?\.\message\s*\|\|\s*['"]([^'"]+)['"]/g,
    replacement: 'error.friendlyMessage || handleError(error)'
  },
  {
    pattern: /catch\s*\(error\)\s*{\s*\n\s*showError\(error\.response\?\.\data\?\.\message/g,
    replacement: 'catch (error) {\n    const errorMsg = error.friendlyMessage || handleError(error);\n    showError(errorMsg'
  }
];

// Danh sách các file cần kiểm tra
const filesToCheck = [
  'frontend/src/pages/Passenger/PassengerDashboard.jsx',
  'frontend/src/pages/Passenger/Payment.jsx',
  'frontend/src/pages/Passenger/Profile.jsx',
  'frontend/src/pages/Admin/Dashboard.jsx',
  'frontend/src/pages/Admin/UserManagement.jsx',
  'frontend/src/pages/Admin/BusCompanyManagement.jsx',
  'frontend/src/pages/Admin/PaymentManagement.jsx',
  'frontend/src/pages/Admin/RouteManagement.jsx',
  'frontend/src/pages/BusCompany/BusCompanyDashboard.jsx',
  'frontend/src/pages/BusCompany/BusCompanyProfile.jsx'
];

function checkAndUpdateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File không tồn tại: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;

  // Kiểm tra xem file đã import handleError chưa
  const hasHandleErrorImport = content.includes("import { handleError") || 
                                content.includes("from '../utils/messageHandler'") ||
                                content.includes("from '../../utils/messageHandler'");

  if (!hasHandleErrorImport && content.includes('catch (error)')) {
    // Thêm import handleError
    const importLine = filePath.includes('pages/Admin/') 
      ? "import { handleError } from '../../utils/messageHandler';\n"
      : "import { handleError } from '../../utils/messageHandler';\n";
    
    // Tìm vị trí sau import cuối cùng
    const lastImportIndex = content.lastIndexOf("import ");
    const nextLineIndex = content.indexOf('\n', lastImportIndex);
    
    content = content.slice(0, nextLineIndex + 1) + importLine + content.slice(nextLineIndex + 1);
    updated = true;
  }

  // Áp dụng các replacements
  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  });

  // Xóa các console.error còn lại liên quan đến error handling
  const errorConsolePattern = /\s*console\.error\(['"]Error[^}]+?\);?\s*\n/g;
  if (errorConsolePattern.test(content)) {
    content = content.replace(errorConsolePattern, '');
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Đã cập nhật: ${filePath}`);
  } else {
    console.log(`ℹ️  Không cần cập nhật: ${filePath}`);
  }
}

console.log('🚀 Bắt đầu migrate hệ thống thông báo...\n');

filesToCheck.forEach(checkAndUpdateFile);

console.log('\n✨ Hoàn thành migration!');
console.log('\n📝 Hãy kiểm tra các file đã cập nhật và test lại ứng dụng.');
console.log('📖 Xem hướng dẫn chi tiết tại: frontend/NOTIFICATION_SYSTEM.md');
