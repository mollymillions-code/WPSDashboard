"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditableField } from "@/components/editable-field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketingBudgetItem {
  id: string
  category: string
  lineItem: string
  cost: number
  notes?: string
}

interface MarketingBudgetProps {
  initialBudget: MarketingBudgetItem[]
}

export function MarketingBudget({ initialBudget }: MarketingBudgetProps) {
  const [budget, setBudget] = useState<MarketingBudgetItem[]>(initialBudget)

  const updateBudgetItem = (id: string, field: string, value: string | number) => {
    setBudget(
      budget.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const calculateTotal = () => {
    return budget.reduce((sum, item) => sum + item.cost, 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Budget</CardTitle>
        <CardDescription>Estimated marketing expenses for the event</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead>Line Item</TableHead>
              <TableHead className="text-right">Estimated Cost</TableHead>
              <TableHead>Notes</TableHead>
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
                    onSave={(value) => updateBudgetItem(item.id, "cost", Number(value))}
                    type="currency"
                  />
                </TableCell>
                <TableCell>
                  <EditableField
                    value={item.notes || ""}
                    onSave={(value) => updateBudgetItem(item.id, "notes", String(value))}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">${calculateTotal().toLocaleString()}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
