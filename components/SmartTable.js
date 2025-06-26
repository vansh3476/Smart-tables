"use client"

import { useState, useEffect, useCallback } from "react"

// Simple chevron icons as SVG components
const ChevronUp = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const ChevronDown = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function SmartTable({ columns, initialData }) {
  const [data, setData] = useState(initialData)
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [errors, setErrors] = useState({})
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

  const evaluateFormula = useCallback(
    (formula, rowData) => {
      try {
        let expression = formula

        columns.forEach((col) => {
          if (col.type === "number") {
            const value = rowData[col.key] || 0
            const regex = new RegExp(`\\b${col.key}\\b`, "g")
            expression = expression.replace(regex, value.toString())
          }
        })

        if (!/^[\d+\-*/().\s]+$/.test(expression)) {
          throw new Error("Invalid formula")
        }

        const result = Function('"use strict"; return (' + expression + ")")()

        if (isNaN(result) || !isFinite(result)) {
          throw new Error("Invalid calculation")
        }

        return Number.parseFloat(result.toFixed(2))
      } catch (error) {
        console.error("Formula evaluation error:", error)
        throw new Error("Formula error: " + error.message)
      }
    },
    [columns],
  )

  const recalculateFormulas = useCallback(
    (newData) => {

      const updatedData = newData.map((row, index) => {
        const updatedRow = { ...row }

        const formulaColumns = columns.filter((col) => col.formula)

        for (let pass = 0; pass < 5; pass++) {
          let hasChanges = false

          formulaColumns.forEach((col) => {
            try {
              const oldValue = updatedRow[col.key]
              const newValue = evaluateFormula(col.formula, updatedRow)

              if (oldValue !== newValue) {
                updatedRow[col.key] = newValue
                hasChanges = true
              }

              const errorKey = `${index}-${col.key}`
              setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[errorKey]
                return newErrors
              })
            } catch (error) {
              console.error(`Error calculating ${col.key}:`, error)
              const errorKey = `${index}-${col.key}`
              setErrors((prev) => ({ ...prev, [errorKey]: error.message }))
              updatedRow[col.key] = 0
            }
          })

          if (!hasChanges) break
        }

        return updatedRow
      })

      return updatedData
    },
    [columns, evaluateFormula],
  )

  useEffect(() => {
    setData((prevData) => recalculateFormulas(prevData))
  }, [recalculateFormulas])

  const handleCellClick = (rowIndex, columnKey, currentValue) => {
    const column = columns.find((col) => col.key === columnKey)
    if (column && !column.formula) {
      setEditingCell(`${rowIndex}-${columnKey}`)
      setEditValue(currentValue?.toString() || "")
    }
  }

  const handleCellChange = (e) => {
    setEditValue(e.target.value)
  }

  const handleCellBlur = () => {
    if (editingCell) {
      const [rowIndex, columnKey] = editingCell.split("-")
      const column = columns.find((col) => col.key === columnKey)

      let newValue = editValue
      if (column.type === "number") {
        newValue = Number.parseFloat(editValue) || 0
      }

      const newData = [...data]
      newData[Number.parseInt(rowIndex)][columnKey] = newValue

      const recalculatedData = recalculateFormulas(newData)
      setData(recalculatedData)

      setEditingCell(null)
      setEditValue("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCellBlur()
    }
    if (e.key === "Escape") {
      setEditingCell(null)
      setEditValue("")
    }
  }

   const sortData = useCallback(
    (data, key, direction) => {
      const column = columns.find((col) => col.key === key)

      return [...data].sort((a, b) => {
        let aVal = a[key]
        let bVal = b[key]

        if (column.type === "number") {
          aVal = Number(aVal) || 0
          bVal = Number(bVal) || 0
        } else {
          aVal = String(aVal).toLowerCase()
          bVal = String(bVal).toLowerCase()
        }

        if (aVal < bVal) {
          return direction === "asc" ? -1 : 1
        }
        if (aVal > bVal) {
          return direction === "asc" ? 1 : -1
        }
        return 0
      })
    },
    [columns],
  )

  const handleSort = (columnKey) => {
    let direction = "asc"

    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null // Remove sorting
      } else {
        direction = "asc"
      }
    }

    setSortConfig({ key: columnKey, direction })

    if (direction) {
      const sortedData = sortData(data, columnKey, direction)
      setData(sortedData)
    } else {
      const recalculatedData = recalculateFormulas(initialData)
      setData(recalculatedData)
    }
  }

  const getCellContent = (row, column, rowIndex) => {
    const cellKey = `${rowIndex}-${column.key}`
    const isEditing = editingCell === cellKey
    const hasError = errors[cellKey]
    const value = row[column.key]

    if (isEditing) {
      return (
        <input
          type={column.type === "number" ? "number" : "text"}
          step="any"
          value={editValue}
          onChange={handleCellChange}
          onBlur={handleCellBlur}
          onKeyDown={handleKeyPress}
          className="w-full px-3 py-2 border-0 outline-none bg-blue-50 focus:bg-blue-100 rounded"
          autoFocus
        />
      )
    }

    return (
      <div
        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 rounded transition-colors ${
          hasError ? "bg-red-50 text-red-600" : ""
        } ${column.formula ? "bg-gray-50 cursor-default" : ""}`}
        onClick={() => handleCellClick(rowIndex, column.key, value)}
        title={hasError ? hasError : column.formula ? `Formula: ${column.formula}` : ""}
      >
        {hasError ? "Error" : column.type === "number" && typeof value === "number" ? value.toFixed(2) : value}
      </div>
    )
  }

  return (
    <div className="w-full">
      {errors.circular && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{errors.circular}</div>
      )}

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200 whitespace-nowrap"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    <div className="flex flex-col ml-2 text-gray-400">
                      <ChevronUp />
                      <ChevronDown />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="text-sm text-gray-900 border-b border-gray-100 whitespace-nowrap">
                    {getCellContent(row, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
