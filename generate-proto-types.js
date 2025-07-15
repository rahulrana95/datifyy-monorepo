#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const PROTO_DIR = './proto';
const NODEJS_OUTPUT_DIR = './services/nodejs-service/src/proto-types';
const FRONTEND_OUTPUT_DIR = './apps/frontend/src/proto-types';

// Ensure output directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Clean output directory
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Cleaned directory: ${dirPath}`);
  }
  ensureDirectoryExists(dirPath);
}

// Generate TypeScript types using ts-proto
function generateTypes(outputDir, options = {}) {
  console.log(`\n📦 Generating types for ${outputDir}...`);
  
  // Clean and create output directory
  cleanDirectory(outputDir);
  
  // Find all .proto files
  const protoFiles = glob.sync(`${PROTO_DIR}/**/*.proto`);
  
  if (protoFiles.length === 0) {
    console.error('❌ No .proto files found in', PROTO_DIR);
    process.exit(1);
  }
  
  console.log(`Found ${protoFiles.length} proto files`);
  
  // ts-proto options
  const tsProtoOptions = [
    '--ts_proto_opt=esModuleInterop=true',
    '--ts_proto_opt=outputEncodeMethods=false',
    '--ts_proto_opt=outputJsonMethods=false',
    '--ts_proto_opt=outputClientImpl=false',
    '--ts_proto_opt=stringEnums=true', // Use string enums instead of numeric
    '--ts_proto_opt=constEnums=false',
    '--ts_proto_opt=enumsAsLiterals=false',
    '--ts_proto_opt=outputTypeRegistry=false',
    '--ts_proto_opt=addGrpcMetadata=false',
    '--ts_proto_opt=nestJs=false',
    '--ts_proto_opt=env=browser', // For frontend compatibility
    '--ts_proto_opt=useOptionals=messages',
    '--ts_proto_opt=exportCommonSymbols=false',
    '--ts_proto_opt=snakeToCamel=true', // Convert snake_case to camelCase
    '--ts_proto_opt=lowerCaseServiceMethods=true',
    '--ts_proto_opt=unrecognizedEnum=false',
    ...Object.entries(options).map(([key, value]) => `--ts_proto_opt=${key}=${value}`)
  ].join(' ');
  
  // Generate command
  const protoFilesList = protoFiles.map(f => path.relative(process.cwd(), f)).join(' ');
  const command = `protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=${outputDir} ${tsProtoOptions} --proto_path=${PROTO_DIR} ${protoFilesList}`;
  
  console.log('Executing protoc with ts-proto...');
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Successfully generated TypeScript types');
  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    // Try again with more verbose error output
    try {
      execSync(command, { stdio: 'pipe' });
    } catch (detailedError) {
      console.error('Detailed error:', detailedError.stdout?.toString());
      console.error('Stderr:', detailedError.stderr?.toString());
    }
    process.exit(1);
  }
  
  // Create index files for better imports
  createIndexFiles(outputDir);
}

// Create index.ts files for easier imports
function createIndexFiles(outputDir) {
  const directories = ['common', 'admin', 'user', 'dating'];
  
  directories.forEach(dir => {
    const dirPath = path.join(outputDir, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts')
        .map(f => f.replace('.ts', ''));
      
      if (files.length > 0) {
        const indexContent = files
          .map(f => `export * from './${f}';`)
          .join('\n') + '\n';
        
        fs.writeFileSync(path.join(dirPath, 'index.ts'), indexContent);
        console.log(`Created index.ts for ${dir}`);
      }
    }
  });
  
  // Create main index file
  const mainIndexContent = `// Auto-generated index file for proto types
// Generated at: ${new Date().toISOString()}

// Common types
export * from './common';

// Admin types
export * from './admin';

// User types
export * from './user';

// Dating types
export * from './dating';
`;
  
  fs.writeFileSync(path.join(outputDir, 'index.ts'), mainIndexContent);
  console.log('Created main index.ts');
}

// Main execution
async function main() {
  console.log('🚀 Generating TypeScript types from Protocol Buffers using ts-proto...');
  
  // Check if protoc is installed
  try {
    execSync('protoc --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ protoc is not installed. Please install it first:');
    console.error('   brew install protobuf  # macOS');
    console.error('   apt install protobuf-compiler  # Ubuntu/Debian');
    process.exit(1);
  }
  
  // Generate for nodejs service
  console.log('\n📦 Generating types for nodejs service...');
  generateTypes(NODEJS_OUTPUT_DIR);
  
  // Generate for frontend (with browser-specific options)
  console.log('\n📦 Generating types for frontend...');
  generateTypes(FRONTEND_OUTPUT_DIR, {
    env: 'browser',
    useDate: 'string' // Use string dates for JSON compatibility
  });
  
  console.log('\n🎉 Proto types generation complete!');
  console.log(`📁 Backend types: ${NODEJS_OUTPUT_DIR}`);
  console.log(`📁 Frontend types: ${FRONTEND_OUTPUT_DIR}`);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateTypes };