![image](https://github.com/user-attachments/assets/c8e2261f-f718-4abb-b6c0-8ac303f5bd3f)

# Smart Table - React Implementation

A sophisticated table component built with React that supports live calculations, formula evaluation, and real-time updates.

## Features

- **Column Types**: Support for text and number columns
- **Live Calculations**: Automatic recalculation when dependent values change
- **Formula Support**: Basic arithmetic operations (+, -, *, /, parentheses)
- **Circular Reference Detection**: Prevents infinite calculation loops
- **Error Handling**: Clear error states for invalid formulas
- **Pixel-Perfect Design**: Matches provided design specifications
- **Responsive**: Works across different screen sizes
- **Accessible**: Proper keyboard navigation and screen reader support

## Architecture & Design Decisions

### Component Structure
- \`SmartTable\`: Main table component handling data, calculations, and UI
- \`page.js\`: Demo page with sample configuration and data
- Clean separation of concerns with hooks for state management

### State Management
- \`useState\` for table data, editing state, and error tracking
- \`useCallback\` for memoized calculation functions
- \`useEffect\` for initialization and side effects

### Formula Engine
- Custom formula parser that replaces column references with actual values
- Security measures to prevent code injection
- Error boundaries for graceful failure handling
- Circular reference detection using depth-first search

### Styling Approach
- Tailwind CSS for rapid, consistent styling
- Hover states and interactive feedback
- Error states with visual indicators
- Responsive design principles

## How AI Was Used in Development

### Initial Architecture Planning
**Prompt**: "Design a React table component architecture that supports live calculations and formula evaluation without external libraries"

**AI Assistance**: Helped structure the component hierarchy and identify key state management patterns.

### Formula Evaluation Logic
**Prompt**: "Create a safe formula evaluator in JavaScript that can handle basic arithmetic and prevent code injection"

**AI Assistance**: Provided the foundation for the \`evaluateFormula\` function with security considerations.

### Circular Reference Detection
**Prompt**: "Implement circular reference detection for a dependency graph in JavaScript"

**AI Assistance**: Suggested the DFS-based approach for cycle detection in the formula dependencies.

### Styling and Layout
**Prompt**: "Create Tailwind CSS classes to match a clean table design with hover states and error indicators"

**AI Assistance**: Helped refine the visual styling to match the provided design reference.

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
2. Click any cell in the Item, Price, or Tax columns to edit
3. Watch the Total column automatically recalculate
4. Try different formulas by modifying the column configuration

### Configuration
The table accepts a \`columns\` prop with the following structure:
\`\`\`javascript
const columns = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'total', label: 'Total', type: 'number', formula: 'price * 1.1' }
]
\`\`\`

## Time Tracking

**Total Development Time**: ~5.5 hours

- **Planning & Architecture**: 45 minutes
- **Core Table Component**: 2 hours
- **Formula Engine**: 1.5 hours  
- **Error Handling & Validation**: 45 minutes
- **Styling & Polish**: 45 minutes
- **Testing & Refinement**: 30 minutes

## Technical Highlights

### Formula Evaluation
- Safe evaluation using Function constructor with strict mode
- Column reference replacement before evaluation
- Numeric validation and error handling

### Performance Optimizations
- Memoized calculation functions with \`useCallback\`
- Efficient re-rendering with proper dependency arrays
- Minimal DOM updates during editing

### Error Handling
- Graceful degradation for invalid formulas
- Visual error indicators
- Circular reference prevention

## Future Enhancements

- Column sorting functionality
- Row addition/deletion
- More complex formula functions (SUM, AVERAGE, etc.)
- Export functionality (CSV, JSON)
- Undo/redo capabilities
- Column resizing
- Data validation rules

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
