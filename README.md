# Smart Table - Excel-Style Spreadsheet

A dynamic, interactive spreadsheet component built with React that supports Excel-like formulas, cell references, and live calculations.

## Features

- **Excel-Style Cell References**: Use A1, B2, C3 notation for cell targeting
- **Dynamic Table Structure**: Start with 3 rows × 4 columns, expand up to 10×10
- **Live Formula Calculations**: Automatic recalculation when referenced cells change
- **Column Type Management**: Toggle between text and number columns
- **Formula Support**: Basic arithmetic operations (+, -, *, /, parentheses)
- **Circular Reference Detection**: Prevents infinite calculation loops
- **Error Handling**: Clear error states for invalid formulas
- **Interactive UI**: Click-to-edit cells with visual feedback

## Architecture & Design Decisions

### Component Structure
- \`SmartTable\`: Main spreadsheet component handling all functionality
- \`page.js\`: Demo page with usage instructions
- Clean separation of data management, formula evaluation, and UI rendering

### State Management
- \`useState\` for table data, dimensions, column types, and editing state
- Cell data structure: \`{ value, displayValue, isFormula }\`
- Separate error state management for formula validation
- No external state management libraries - pure React state

### Formula Engine
- **Cell Reference Parser**: Converts A1, B2 notation to grid coordinates
- **Formula Evaluator**: Safe evaluation using Function constructor with strict mode
- **Dependency Resolution**: Recursive formula evaluation with circular reference detection
- **Security**: Input validation to prevent code injection attacks

### Data Structure
\`\`\`javascript
// Cell data format
{
  value: "=A1+B1",           // Raw input (formula or value)
  displayValue: "150",       // Calculated result for display
  isFormula: true            // Whether cell contains a formula
}

// Grid structure
data = {
  "A1": { value: "100", displayValue: "100", isFormula: false },
  "B1": { value: "50", displayValue: "50", isFormula: false },
  "C1": { value: "=A1+B1", displayValue: "150", isFormula: true }
}
\`\`\`

### Styling Approach
- **Tailwind CSS**: Utility-first styling for rapid development
- **Grid Layout**: HTML table with proper cell sizing and borders
- **Visual States**: Different backgrounds for formulas, errors, and editing
- **Responsive Design**: Works across different screen sizes
- **Accessibility**: Proper keyboard navigation and screen reader support

## How AI Was Used in Development

### Initial Architecture Planning
**Prompt**: "Design a React spreadsheet component with Excel-like cell references (A1, B2) and dynamic row/column management"

**AI Assistance**: Helped structure the component architecture, data flow, and state management patterns for a dynamic grid system.

### Cell Reference System
**Prompt**: "Create functions to convert between Excel column letters (A, B, C) and array indices (0, 1, 2) and parse cell references like A1, B2"

**AI Assistance**: Provided the core helper functions for column letter conversion and cell reference parsing:
- \`getColumnLetter(index)\`: Converts 0→A, 1→B, etc.
- \`getColumnIndex(letter)\`: Converts A→0, B→1, etc.
- \`parseCellRef(cellRef)\`: Parses "A1" to {col: 0, row: 0}

### Formula Evaluation Engine
**Prompt**: "Build a safe formula evaluator that can handle Excel-like formulas with cell references and prevent circular dependencies"

**AI Assistance**: Developed the recursive formula evaluation system with:
- Cell reference replacement in expressions
- Safe expression evaluation with security validation

### Dynamic Table Management
**Prompt**: "Implement add/remove row and column functionality while maintaining cell references and data integrity"

**AI Assistance**: Created the dynamic table expansion logic that properly manages cell creation/deletion and maintains data consistency.

### Error Handling & Validation
**Prompt**: "Add comprehensive error handling for invalid formulas, circular references, and edge cases in spreadsheet calculations"

**AI Assistance**: Implemented robust error states, validation, and user feedback systems.

## Setup & Run Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
\`\`\`bash
# Clone the repository
git clone [repository-url]
cd smart-table

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Usage
1. Open http://localhost:3000 in your browser
2. Click any cell to edit its value
3. Enter formulas starting with = (e.g., =A1+B1)
4. Use Excel-style cell references (A1, B2, C3, etc.)
5. Add/remove rows and columns using the control buttons
6. Toggle column types by clicking column headers

## Formula Examples

### Basic Operations
\`\`\`
=A1+B1          # Addition
=A1-B1          # Subtraction  
=A1*B1          # Multiplication
=A1/B1          # Division
=(A1+B1)*C1     # Parentheses for order of operations
\`\`\`

### Cross-Cell References
\`\`\`
=A1*B2          # Reference different rows
=A1+A2+A3       # Sum multiple cells
=(A1+B1)/(C1+D1) # Complex expressions
\`\`\`



## Time Tracking

**Total Development Time**: ~5 hours

- **Requirements Analysis & Planning**: 30 minutes
- **Core Spreadsheet Architecture**: 1 hour
- **Excel-Style Cell Reference System**: 1 hour
- **Formula Evaluation Engine**: 1 hours
- **Dynamic Table Management**: 40 minutes
- **Error Handling & Validation**: 30 minutes
- **UI/UX Polish & Styling**: 45 minutes
- **Testing & Bug Fixes**: 30 minutes

## Technical Highlights

### Excel-Style Cell References
- Automatic conversion between column letters (A, B, C) and indices
- Support for any valid Excel cell reference (A1 through J10)
- Proper parsing and validation of cell references in formulas

### Dynamic Table Structure
- Runtime addition/removal of rows and columns
- Automatic cell creation and cleanup
- Maintains data integrity during table restructuring

### Formula Evaluation
- Recursive evaluation supporting nested formula references
- Circular reference detection prevents infinite loops
- Safe expression evaluation with input sanitization

### Performance Optimizations
- Memoized calculation functions with \`useCallback\`
- Efficient re-rendering with proper dependency management
- Minimal DOM updates during editing operations


## Testing

### Manual Test Cases
1. **Basic Value Entry**: Enter numbers and text in cells
2. **Simple Formulas**: Test =A1+B1 type calculations
3. **Complex Formulas**: Test nested parentheses and multiple operations
4. **Cell References**: Test cross-row and cross-column references
5. **Dynamic Table**: Add/remove rows and columns
6. **Error Handling**: Test invalid formulas and circular references

### Edge Cases Handled
- Division by zero
- Invalid cell references (e.g., Z99)
- Circular reference detection
- Empty cell references (treated as 0)
- Non-numeric values in calculations
- Formula syntax errors






