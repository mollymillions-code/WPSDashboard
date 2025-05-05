"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditableField } from "@/components/editable-field"

interface BudgetItem {
  id: string
  category: string
  lineItem: string
  cost: number
}

interface EditableBudgetTableProps {
  budget: BudgetItem[]
  onBudgetChange: (updatedBudget: BudgetItem[]) => void
}

export function EditableBudgetTable({ budget, onBudgetChange }: EditableBudgetTableProps) {
  const updateBudgetItem = (id: string, cost: number) => {
    const updatedBudget = budget.map((item) => {
      if (item.id === id) {
        return { ...item, cost }
      }
      return item
    })
    onBudgetChange(updatedBudget)
  }

  const calculateTotal = () => {
    return budget.reduce((sum, item) => sum + item.cost, 0)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Line Item</TableHead>
          <TableHead className="text-right">Estimated Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budget.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.category}</TableCell>
            <TableCell>{item.lineItem}</TableCell>
            <TableCell className="text-right">
              <EditableField
                value={item.cost}
                onSave={(value) => updateBudgetItem(item.id, Number(value))}
                type="currency"
              />
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">${calculateTotal().toLocaleString()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
