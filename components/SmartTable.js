"use client"
import { useState, useCallback } from "react"

const getColumnLetter = (index) => {
  return String.fromCharCode(65 + index)
}

export default function SmartTable() {
  const [numRows, setNumRows] = useState(3)
  const [numCols, setNumCols] = useState(4)
  const [columnTypes, setColumnTypes] = useState(["text", "text", "number", "number"])
  const [data, setData] = useState(() => {
    const initialData = {}
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const cellId = `${getColumnLetter(col)}${row + 1}`
        initialData[cellId] = { value: "", displayValue: "", isFormula: false }
      }
    }
    return initialData
  })

  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [errors, setErrors] = useState({})

  const evaluateFormula = useCallback((formula, currentCellId, dataToUse) => {
    try {
      let expression = formula.substring(1)

      const cellRefs = expression.match(/[A-Z]\d+/g) || []

      const visited = new Set()
      const checkCircular = (cellId, path = new Set()) => {
        if (path.has(cellId)) return true
        if (visited.has(cellId)) return false

        visited.add(cellId)
        path.add(cellId)

        const cellData = dataToUse[cellId]
        if (cellData && cellData.isFormula) {
          const refs = cellData.value.match(/[A-Z]\d+/g) || []
          for (const ref of refs) {
            if (checkCircular(ref, new Set(path))) return true
          }
        }

        path.delete(cellId)
        return false
      }

      if (checkCircular(currentCellId)) {
        throw new Error("Circular reference detected")
      }

      for (const cellRef of cellRefs) {
        const cellData = dataToUse[cellRef]
        let cellValue = 0

        if (cellData) {
          if (cellData.isFormula) {
            cellValue = evaluateFormula(cellData.value, cellRef, dataToUse)
          } else {
            cellValue = Number.parseFloat(cellData.value) || 0
          }
        }

        expression = expression.replace(new RegExp(`\\b${cellRef}\\b`, "g"), cellValue.toString())
      }

      if (!/^[\d+\-*/().\s]+$/.test(expression)) {
        throw new Error("Invalid formula")
      }

      const result = Function('"use strict"; return (' + expression + ")")()

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation")
      }

      return Number.parseFloat(result.toFixed(2))
    } catch (error) {
      throw new Error(error.message || "Formula error")
    }
  }, [])

  const recalculateFormulas = useCallback(
    (dataToRecalculate) => {
      const newData = { ...dataToRecalculate }
      const newErrors = {}

      Object.keys(newData).forEach((cellId) => {
        const cellData = newData[cellId]
        if (cellData && cellData.isFormula) {
          try {
            const result = evaluateFormula(cellData.value, cellId, newData)
            newData[cellId] = {
              ...cellData,
              displayValue: result.toString(),
              isError:false
            }
            delete newErrors[cellId]
          } catch (error) {
            newData[cellId] = {
              ...cellData,
              displayValue: cellData.value,
              isError:true
            }
            newErrors[cellId] = error.message
          }
        }
      })

      setErrors(newErrors)
      return newData
    },
    [evaluateFormula],
  )

  const handleCellClick = (cellId) => {
    setEditingCell(cellId)
    const cellData = data[cellId] || { value: "", displayValue: "", isFormula: false }
    setEditValue(cellData.value)
  }

  const handleCellChange = (e) => {
    setEditValue(e.target.value)
  }

  const handleCellBlur = () => {
    if (editingCell) {

      const isFormula = editValue.startsWith("=")
      const newData = { ...data }

      newData[editingCell] = {
        value: editValue,
        displayValue: isFormula ? editValue : editValue, 
        isFormula: isFormula,
      }

      const finalData = recalculateFormulas(newData)

      setData(finalData)
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

  const addRow = () => {
    if (numRows < 10) {
      const newRowIndex = numRows
      const newData = { ...data }

      // Add cells for the new row
      for (let col = 0; col < numCols; col++) {
        const cellId = `${getColumnLetter(col)}${newRowIndex + 1}`
        newData[cellId] = { value: "", displayValue: "", isFormula: false }
      }

      setData(newData)
      setNumRows(numRows + 1)
    }
  }

  const removeRow = () => {
    if (numRows > 1) {
      const newData = { ...data }

      // Remove cells from the last row
      for (let col = 0; col < numCols; col++) {
        const cellId = `${getColumnLetter(col)}${numRows}`
        delete newData[cellId]
      }

      setData(newData)
      setNumRows(numRows - 1)
    }
  }

  const addColumn = () => {
    if (numCols < 10) {
      const newColIndex = numCols
      const newData = { ...data }
      const newColumnTypes = [...columnTypes, "number"]

      // Add cells for the new column
      for (let row = 0; row < numRows; row++) {
        const cellId = `${getColumnLetter(newColIndex)}${row + 1}`
        newData[cellId] = { value: "", displayValue: "", isFormula: false }
      }

      setData(newData)
      setColumnTypes(newColumnTypes)
      setNumCols(numCols + 1)
    }
  }

  const removeColumn = () => {
    if (numCols > 1) {
      const newData = { ...data }
      const newColumnTypes = columnTypes.slice(0, -1)

      // Remove cells from the last column
      for (let row = 0; row < numRows; row++) {
        const cellId = `${getColumnLetter(numCols - 1)}${row + 1}`
        delete newData[cellId]
      }

      setData(newData)
      setColumnTypes(newColumnTypes)
      setNumCols(numCols - 1)
    }
  }

  const toggleColumnType = (colIndex) => {
    const newColumnTypes = [...columnTypes]
    newColumnTypes[colIndex] = newColumnTypes[colIndex] === "text" ? "number" : "text"
    setColumnTypes(newColumnTypes)
  }

  const getCellContent = (cellId) => {
    const cellData = data[cellId] || { value: "", displayValue: "", isFormula: false }
    const isEditing = editingCell === cellId
    const hasError = errors[cellId]

    if (isEditing) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={handleCellChange}
          onBlur={handleCellBlur}
          onKeyDown={handleKeyPress}
          className="w-full h-full px-2 py-1 border-2 border-blue-500 outline-none bg-white text-sm"
          autoFocus
          placeholder="Enter value or =formula"
        />
      )
    }

    const displayText = hasError ? cellData.value : cellData.isFormula ? cellData.displayValue : cellData.value || ""

    return (
      <div
        className={`w-full h-full px-2 py-1 cursor-pointer hover:bg-blue-50 text-sm flex items-center ${
          hasError ? "bg-red-50 text-red-600" : ""
        } ${cellData.isFormula ? "bg-green-50" : ""}`}
        onClick={() => handleCellClick(cellId)}
        title={
          hasError
            ? hasError
            : cellData.isFormula
              ? `Formula: ${cellData.value} = ${cellData.displayValue}`
              : "Click to edit"
        }
      >
        {displayText}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows:</span>
          <button
            onClick={removeRow}
            disabled={numRows <= 1}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            -
          </button>
          <span className="text-sm">{numRows}</span>
          <button
            onClick={addRow}
            disabled={numRows >= 10}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Columns:</span>
          <button
            onClick={removeColumn}
            disabled={numCols <= 1}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            -
          </button>
          <span className="text-sm">{numCols}</span>
          <button
            onClick={addColumn}
            disabled={numCols >= 10}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-12 h-10 bg-gray-200 border border-gray-300"></th>
              {Array.from({ length: numCols }, (_, colIndex) => (
                <th
                  key={colIndex}
                  className="min-w-32 h-10 bg-gray-200 border border-gray-300 text-center text-sm font-medium cursor-pointer hover:bg-gray-300"
                  onClick={() => toggleColumnType(colIndex)}
                  title={`Click to toggle type (currently: ${columnTypes[colIndex]})`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{getColumnLetter(colIndex)}</span>
                    <span className="text-xs text-gray-600">({columnTypes[colIndex] === "text" ? "T" : "#"})</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numRows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-12 h-10 bg-gray-200 border border-gray-300 text-center text-sm font-medium">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: numCols }, (_, colIndex) => {
                  const cellId = `${getColumnLetter(colIndex)}${rowIndex + 1}`
                  return (
                    <td key={cellId} className="min-w-32 h-10 border border-gray-300 p-0">
                      {getCellContent(cellId)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>
            • <strong>Click any cell</strong> to edit its value
          </li>
          <li>
            • <strong>Enter formulas</strong> starting with = (e.g., =A1+B1)
          </li>
          <li>
            • <strong>Use cell references</strong> like A1, B2, C3, etc.
          </li>
          <li>
            • <strong>Press Enter</strong> to save, Escape to cancel
          </li>
          <li>
            • <strong>Click column headers</strong> to toggle between Text (T) and Number (#)
          </li>
          <li>
            • <strong>Formula cells</strong> have a green background
          </li>
          <li>
            • <strong>Error cells</strong> show in red with message on hover
          </li>
        </ul>
      </div>
    </div>
  )
}
