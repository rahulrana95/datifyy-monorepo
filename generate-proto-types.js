#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROTO_DIR = './proto';
const OUTPUT_DIR = './services/nodejs-service/src/proto-types';
const PROTOBUF_TS_OUT = path.join(OUTPUT_DIR, 'generated');

// Ensure output directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Get all proto files recursively
function getAllProtoFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllProtoFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.proto')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Generate TypeScript types from proto files
function generateTypes() {
  console.log('🚀 Generating TypeScript types from Protocol Buffers...');
  
  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);
  ensureDirectoryExists(PROTOBUF_TS_OUT);
  
  // Get all proto files
  const protoFiles = getAllProtoFiles(PROTO_DIR);
  console.log(`Found ${protoFiles.length} proto files:`);
  protoFiles.forEach(file => console.log(`  - ${file}`));
  
  // Generate TypeScript files using ts-proto
  const protoPathArg = protoFiles.join(' ');
  const command = `npx protoc \\
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \\
    --proto_path=${PROTO_DIR} \\
    --ts_proto_out=${PROTOBUF_TS_OUT} \\
    --ts_proto_opt=esModuleInterop=true \\
    --ts_proto_opt=forceLong=string \\
    --ts_proto_opt=useOptionals=messages \\
    ${protoPathArg}`;
  
  try {
    console.log('\\n🔧 Running protoc compiler...');
    execSync(command, { stdio: 'inherit' });
    console.log('✅ TypeScript types generated successfully!');
  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    process.exit(1);
  }
  
  // Generate index files for easier imports
  generateIndexFiles();
  
  console.log('\\n🎉 Proto types generation complete!');
  console.log(`📁 Types are available in: ${OUTPUT_DIR}`);
  console.log('\\n💡 Usage example:');
  console.log("import { NotificationResponse } from '../proto-types/admin/notifications';");
}

// Generate index files for easier imports
function generateIndexFiles() {
  console.log('\\n📝 Generating index files...');
  
  // Create main index file
  const mainIndexContent = `// Auto-generated index file for proto types
// Generated at: ${new Date().toISOString()}

// Common types
export * from './generated/common/base';
export * from './generated/common/enums';

// Admin types
export * from './generated/admin/notifications';
export * from './generated/admin/dashboard';
export * from './generated/admin/user_management';

// User types
export * from './generated/user/profile';

// Dating types
export * from './generated/dating/curated_dates';
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), mainIndexContent);
  console.log('✅ Created main index file');
  
  // Create category-specific index files
  const categories = ['admin', 'user', 'dating', 'common'];
  
  categories.forEach(category => {
    const categoryDir = path.join(PROTOBUF_TS_OUT, category);
    if (fs.existsSync(categoryDir)) {
      const categoryFiles = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.ts'))
        .map(file => file.replace('.ts', ''));
      
      const categoryIndexContent = `// Auto-generated index file for ${category} types
// Generated at: ${new Date().toISOString()}

${categoryFiles.map(file => `export * from './${file}';`).join('\\n')}
`;
      
      fs.writeFileSync(path.join(categoryDir, 'index.ts'), categoryIndexContent);
      console.log(`✅ Created ${category} index file`);
    }
  });
}

// Check dependencies
function checkDependencies() {
  try {
    execSync('protoc --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Protocol Buffers compiler (protoc) is not installed.');
    console.error('Please install it:');
    console.error('  macOS: brew install protobuf');
    console.error('  Ubuntu/Debian: sudo apt-get install protobuf-compiler');
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  try {
    checkDependencies();
    generateTypes();
  } catch (error) {
    console.error('❌ Failed to generate proto types:', error.message);
    process.exit(1);
  }
}

module.exports = { generateTypes };