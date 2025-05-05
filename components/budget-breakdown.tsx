"use client"

interface BudgetCategory {
  id: string
  name: string
  amount: number
}

interface BudgetBreakdownProps {
  categories: BudgetCategory[]
  total: number
}

export function BudgetBreakdown({ categories, total }: BudgetBreakdownProps) {
  const calculatePercentage = (amount: number) => {
    return Math.round((amount / total) * 100)
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div className="space-y-2" key={category.id}>
          <div className="flex items-center justify-between text-sm">
            <span>
              {category.name} (${category.amount.toLocaleString()})
            </span>
            <span>{calculatePercentage(category.amount)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-rose-500"
              style={{ width: `${calculatePercentage(category.amount)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
