#!/bin/bash

# Script to concatenate all source files and environment config into one text file
# Usage: ./concat-sources.sh [output-file]

OUTPUT_FILE=${1:-"tmp/all-code.txt"}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Concatenating codebase to: $OUTPUT_FILE"
echo "Project root: $PROJECT_ROOT"

# Clear the output file
> "$OUTPUT_FILE"

# Add header
cat << 'EOF' >> "$OUTPUT_FILE"
# Rizful OAuth Client - Complete Codebase Export
# Generated on: $(date)
# 
# This file contains all source code and configuration files for the
# Rizful OAuth client application.
#
# ========================================================================

EOF

echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to add file content with header
add_file() {
    local filepath="$1"
    local relative_path="${filepath#$PROJECT_ROOT/}"
    
    if [[ -f "$filepath" ]]; then
        echo "Adding: $relative_path"
        
        # Add file header
        echo "# ========================================================================" >> "$OUTPUT_FILE"
        echo "# File: $relative_path" >> "$OUTPUT_FILE"
        echo "# ========================================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Add file content
        cat "$filepath" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    else
        echo "Warning: File not found - $relative_path"
    fi
}

# Add environment configuration
echo "Adding environment configuration..."
add_file "$PROJECT_ROOT/.env"

# Add package.json and other config files
echo "Adding configuration files..."
add_file "$PROJECT_ROOT/package.json"
add_file "$PROJECT_ROOT/tsconfig.json"
add_file "$PROJECT_ROOT/tsconfig.app.json"
add_file "$PROJECT_ROOT/vite.config.ts"
add_file "$PROJECT_ROOT/index.html"

# Add all TypeScript/JavaScript source files recursively
echo "Adding source files..."
find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | sort | while read -r file; do
    add_file "$file"
done

# Add CSS files
echo "Adding CSS files..."
find "$PROJECT_ROOT/src" -type f -name "*.css" | sort | while read -r file; do
    add_file "$file"
done

# Add public files
echo "Adding public files..."
find "$PROJECT_ROOT/public" -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" \) | sort | while read -r file; do
    add_file "$file"
done

# Add README
echo "Adding documentation..."
add_file "$PROJECT_ROOT/README.md"

# Add final separator
echo "# ========================================================================" >> "$OUTPUT_FILE"
echo "# End of codebase export" >> "$OUTPUT_FILE"
echo "# ========================================================================" >> "$OUTPUT_FILE"

echo ""
echo "✅ Codebase export complete!"
echo "📄 Output file: $OUTPUT_FILE"
echo "📊 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "📝 Line count: $(wc -l < "$OUTPUT_FILE") lines"
echo ""
echo "You can now share this file with an LLM for code review or analysis."
