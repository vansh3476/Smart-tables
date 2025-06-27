"use client"

import SmartTable from "../components/SmartTable"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Smart Table - Excel-Style Spreadsheet</h1>
            <p className="text-gray-600 mt-2">
              Dynamic table with Excel-like formulas (A1, B2, etc.) and live calculations
            </p>
          </div>
          <div className="p-6">
            <SmartTable />
          </div>
        </div>
      </div>
    </div>
  )
}
