#!/bin/bash

# Extract TypeScript interfaces from TypeORM entities
# This script generates clean TypeScript types from your generated entities

ENTITIES_DIR="./src/models/entities"
TYPES_DIR="./src/types"

# Create types directory if it doesn't exist
mkdir -p "$TYPES_DIR"

echo "🔄 Extracting TypeScript types from TypeORM entities..."

# Array to store all entity names for the main types file
entity_names=()

# Create a temporary Node.js script for processing
cat > /tmp/extract-types.js << 'EOF'
const fs = require('fs');

function extractInterface(filePath, entityName) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract class name
        const classMatch = content.match(/export class (\w+)/);
        if (!classMatch) {
            console.error(`No class found in ${entityName}`);
            return '';
        }
        
        const className = classMatch[1];
        const interfaceName = className + 'Type';
        
        let result = `/**\n * ${entityName} Type\n * Auto-generated from TypeORM entity: ${entityName}\n */\n\n`;
        result += `export interface ${interfaceName} {\n`;
        
        // Extract properties (skip decorators)
        const lines = content.split('\n');
        let inClass = false;
        let braceCount = 0;
        
        for (let line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.includes('export class')) {
                inClass = true;
                continue;
            }
            
            if (inClass) {
                // Count braces to know when class ends
                braceCount += (line.match(/{/g) || []).length;
                braceCount -= (line.match(/}/g) || []).length;
                
                if (braceCount < 0) {
                    break; // End of class
                }
                
                // Skip decorators, comments, and empty lines
                if (!trimmed.startsWith('@') && 
                    !trimmed.startsWith('//') && 
                    !trimmed.startsWith('/*') && 
                    !trimmed.startsWith('*') && 
                    !trimmed.startsWith('{') &&
                    !trimmed.startsWith('}') &&
                    !trimmed.includes('constructor') &&
                    !trimmed.includes('function') &&
                    !trimmed.includes('name:') &&
                    !trimmed.includes('default:') &&
                    !trimmed.includes('type:') &&
                    !trimmed.includes('nullable:') &&
                    !trimmed.includes('length:') &&
                    trimmed.includes(':') && 
                    trimmed.match(/^\s*\w+(\?)?:\s*\w+/)) {
                    
                    // Clean up the property line - remove trailing commas and extra characters
                    let cleanLine = trimmed.replace(/[,;]+$/, '').trim();
                    
                    // Only include valid property declarations (word: type format)
                    if (cleanLine && cleanLine.match(/^\w+(\?)?:\s*[\w\[\]|<>]+$/)) {
                        result += `  ${cleanLine};\n`;
                    }
                }
            }
        }
        
        result += '}\n\n';
        
        // Add utility types specific to this entity
        result += `// Utility types for ${className}\n`;
        result += `export type Create${className}Input = Omit<${interfaceName}, 'id' | 'createdAt' | 'updatedAt'>;\n`;
        result += `export type Update${className}Input = Partial<Omit<${interfaceName}, 'id' | 'createdAt' | 'updatedAt'>>;\n`;
        result += `export type ${className}Id = ${interfaceName}['id'];\n`;
        
        return result;
    } catch (error) {
        console.error(`Error processing ${entityName}:`, error.message);
        return '';
    }
}

// Get command line arguments
const filePath = process.argv[2];
const entityName = process.argv[3];
const outputPath = process.argv[4];

const result = extractInterface(filePath, entityName);
if (result) {
    fs.writeFileSync(outputPath, result);
    console.log(`Generated: ${entityName}.types.ts`);
} else {
    console.error(`Failed to generate: ${entityName}.types.ts`);
}
EOF

# Process each entity file
for entity_file in "$ENTITIES_DIR"/*.ts; do
    if [ ! -f "$entity_file" ] || [[ "$(basename "$entity_file")" == "index.ts" ]]; then
        continue
    fi
    
    entity_name=$(basename "$entity_file" .ts)
    type_file="$TYPES_DIR/${entity_name}.types.ts"
    
    echo "Processing: $entity_name"
    
    # Add to entity names array
    entity_names+=("${entity_name}Type")
    
    # Run the Node.js script to extract the interface
    node /tmp/extract-types.js "$entity_file" "$entity_name" "$type_file"
done

# Clean up temporary file
rm /tmp/extract-types.js

# Create main database types file
DATABASE_TYPES_FILE="$TYPES_DIR/database.types.ts"

cat > "$DATABASE_TYPES_FILE" << 'EOF'
/**
 * Database Types
 * Auto-generated TypeScript interfaces from TypeORM entities
 * Run ./extract-types.sh to regenerate
 */

EOF

# Import all entity types
echo "// Import all entity types" >> "$DATABASE_TYPES_FILE"
for entity_file in "$ENTITIES_DIR"/*.ts; do
    if [ ! -f "$entity_file" ] || [[ "$(basename "$entity_file")" == "index.ts" ]]; then
        continue
    fi
    
    entity_name=$(basename "$entity_file" .ts)
    echo "export * from './${entity_name}.types';" >> "$DATABASE_TYPES_FILE"
done

echo "" >> "$DATABASE_TYPES_FILE"

# Generate a union type of all entities
echo "// Union type of all database entities" >> "$DATABASE_TYPES_FILE"
echo -n "export type DatabaseEntity = " >> "$DATABASE_TYPES_FILE"

# Join all entity names with |
first=true
for entity_name in "${entity_names[@]}"; do
    if [ "$first" = true ]; then
        echo -n "$entity_name" >> "$DATABASE_TYPES_FILE"
        first=false
    else
        echo -n " | $entity_name" >> "$DATABASE_TYPES_FILE"
    fi
done
echo ";" >> "$DATABASE_TYPES_FILE"

echo "" >> "$DATABASE_TYPES_FILE"

# Generate utility types
cat >> "$DATABASE_TYPES_FILE" << 'EOF'
// Global utility types for common operations
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
export type EntityId = string | number;

// Generic CRUD operation types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query filter types
export interface FilterParams {
  [key: string]: any;
}

export interface SortParams {
  field: string;
  direction: 'ASC' | 'DESC';
}
EOF

# Create index file for easy imports
INDEX_FILE="$TYPES_DIR/index.ts"
cat > "$INDEX_FILE" << 'EOF'
/**
 * Types Index
 * Re-exports all database types for easy importing
 */

export * from './database.types';
EOF

echo ""
echo "✅ TypeScript types extracted successfully!"
echo "📁 Generated files:"
echo "   - $DATABASE_TYPES_FILE (main types file)"
echo "   - $INDEX_FILE (index file)"

# Count individual type files
type_count=0
for type_file in "$TYPES_DIR"/*.types.ts; do
    if [ -f "$type_file" ]; then
        echo "   - $(basename "$type_file")"
        ((type_count++))
    fi
done

echo ""
echo "📊 Summary: Generated $type_count individual entity type files"
echo ""
echo "Usage examples:"
echo "  // Import specific entity types"
echo "  import { UserType, CreateUserInput, UpdateUserInput } from './src/types/User.types';"
echo ""
echo "  // Import all types"
echo "  import { DatabaseEntity, PaginationParams } from './src/types';"