"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { EditableField } from "@/components/editable-field"
import type { StatusOption } from "@/components/status-select"

interface TimelineItem {
  id: string
  name: string
  status: string
  statusClass: string
  date: Date | string
  progress: number
}

interface EditableTimelineProps {
  initialItems: TimelineItem[]
}

export function EditableTimeline({ initialItems }: EditableTimelineProps) {
  const [items, setItems] = useState<TimelineItem[]>(initialItems)

  // Status options for timeline items
  const statusOptions: StatusOption[] = [
    { value: "Pending", label: "Pending", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "In Review", label: "In Review", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "In Progress", label: "In Progress", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "Scheduled", label: "Scheduled", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "Drafting", label: "Drafting", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "Complete", label: "Complete", className: "text-green-500 border-green-200 bg-green-50" },
  ]

  const updateItemDate = (id: string, date: Date | string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, date }
        }
        return item
      }),
    )
  }

  const updateItemStatus = (id: string, status: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const selectedStatus = statusOptions.find((option) => option.value === status)
          return {
            ...item,
            status,
            statusClass: selectedStatus ? selectedStatus.className : item.statusClass,
          }
        }
        return item
      }),
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div className="space-y-2" key={item.id}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>{item.name}</span>
              <EditableField
                value={item.status}
                onSave={(value) => updateItemStatus(item.id, String(value))}
                type="status"
                statusOptions={statusOptions}
              />
            </div>
            <EditableField
              value={typeof item.date === "string" ? new Date(item.date) : item.date}
              onSave={(value) => updateItemDate(item.id, value)}
              type="date"
            />
          </div>
          <Progress value={item.progress} className="h-2 w-full bg-amber-100" indicatorClassName="bg-amber-500" />
        </div>
      ))}
    </div>
  )
}
