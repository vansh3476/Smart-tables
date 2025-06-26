"use client"

import SmartTable from "../components/SmartTable"

// Demo with various arithmetic operations
const arithmeticConfig = [
  { key: "item", label: "Item", type: "text" },
  { key: "price", label: "Base Price", type: "number" },
  { key: "discount", label: "Discount %", type: "number" },
  { key: "quantity", label: "Qty", type: "number" },
  { key: "subtotal", label: "Subtotal", type: "number", formula: "price * quantity" },
  { key: "discountAmount", label: "Discount $", type: "number", formula: "(price * quantity) * (discount / 100)" },
  { key: "afterDiscount", label: "After Discount", type: "number", formula: "subtotal - discountAmount" },
  { key: "tax", label: "Tax (8.5%)", type: "number", formula: "afterDiscount * 0.085" },
  { key: "total", label: "Final Total", type: "number", formula: "afterDiscount + tax" },
]

const arithmeticData = [
  {
    id: 1,
    item: "Gaming Laptop",
    price: 1200,
    discount: 10,
    quantity: 2,
    subtotal: 0,
    discountAmount: 0,
    afterDiscount: 0,
    tax: 0,
    total: 0,
  },
  {
    id: 2,
    item: "Wireless Mouse",
    price: 50,
    discount: 15,
    quantity: 3,
    subtotal: 0,
    discountAmount: 0,
    afterDiscount: 0,
    tax: 0,
    total: 0,
  },
  {
    id: 3,
    item: "Mechanical Keyboard",
    price: 120,
    discount: 5,
    quantity: 1,
    subtotal: 0,
    discountAmount: 0,
    afterDiscount: 0,
    tax: 0,
    total: 0,
  },
]

// Simple demo showing basic operations
const basicConfig = [
  { key: "item", label: "Item", type: "text" },
  { key: "a", label: "Value A", type: "number" },
  { key: "b", label: "Value B", type: "number" },
  { key: "addition", label: "A + B", type: "number", formula: "a + b" },
  { key: "subtraction", label: "A - B", type: "number", formula: "a - b" },
  { key: "multiplication", label: "A × B", type: "number", formula: "a * b" },
  { key: "division", label: "A ÷ B", type: "number", formula: "a / b" },
  { key: "complex", label: "Complex", type: "number", formula: "(a + b) * 2 - (a / b)" },
]

const basicData = [
  { id: 1, item: "Example 1", a: 100, b: 20, addition: 0, subtraction: 0, multiplication: 0, division: 0, complex: 0 },
  { id: 2, item: "Example 2", a: 75, b: 15, addition: 0, subtraction: 0, multiplication: 0, division: 0, complex: 0 },
  { id: 3, item: "Example 3", a: 200, b: 8, addition: 0, subtraction: 0, multiplication: 0, division: 0, complex: 0 },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Complex Arithmetic Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Sample Table</h1>
            <p className="text-gray-600 mt-2">Complex formulas with multiplication, division, and parentheses</p>
          </div>
          <div className="p-6 overflow-x-auto">
            <SmartTable columns={arithmeticConfig} initialData={arithmeticData} />
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <h3 className="font-semibold text-gray-900 mb-2">Formulas Used:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                • <strong>Subtotal:</strong> price × quantity
              </div>
              <div>
                • <strong>Discount $:</strong> (price × quantity) × (discount ÷ 100)
              </div>
              <div>
                • <strong>After Discount:</strong> subtotal - discountAmount
              </div>
              <div>
                • <strong>Tax:</strong> afterDiscount × 0.085
              </div>
              <div>
                • <strong>Final Total:</strong> afterDiscount + tax
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
