"use client"

import { useState, useEffect } from "react"
import { Check, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/date-picker"
import { StatusSelect, type StatusOption } from "@/components/status-select"
import { cn } from "@/lib/utils"
import { useCollaboration } from "@/hooks/use-collaboration"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEditHistory } from "@/contexts/edit-history-context"

interface EditableFieldProps {
  value: string | number | Date
  onSave: (value: string | number | Date) => void
  type?: "text" | "number" | "date" | "currency" | "status"
  className?: string
  statusOptions?: StatusOption[]
  fieldId?: string
  section?: string
}

export function EditableField({
  value,
  onSave,
  type = "text",
  className = "",
  statusOptions = [],
  fieldId = `field-${Math.random().toString(36).substring(2, 9)}`,
  section,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const { data: session } = useSession()
  const currentUser = session?.user || { id: "unknown", name: "Unknown User" }
  const { startEditing, stopEditing, updateField, getEditingUser } = useCollaboration()
  const { addToHistory } = useEditHistory()

  const editingUser = getEditingUser(fieldId)
  const isBeingEditedByOther = editingUser && editingUser.id !== currentUser.id

  useEffect(() => {
    // If we're not editing, update our value when the prop changes
    if (!isEditing) {
      setEditValue(value)
    }
  }, [value, isEditing])

  const handleStartEditing = () => {
    if (isBeingEditedByOther) return // Don't allow editing if someone else is editing

    setIsEditing(true)
    startEditing(fieldId)
  }

  const handleSave = () => {
    // Log the edit to history
    const previousValueForHistory = typeof value === "object" ? JSON.stringify(value) : value
    const newValueForHistory = typeof editValue === "object" ? JSON.stringify(editValue) : editValue

    console.log("Saving edit:", {
      fieldId,
      previousValue: previousValueForHistory,
      newValue: newValueForHistory,
      section: section || "General",
    })

    addToHistory({
      fieldId,
      previousValue: previousValueForHistory,
      newValue: newValueForHistory,
      section: section || "General",
    })

    onSave(editValue)
    setIsEditing(false)
    stopEditing(fieldId)
    updateField(fieldId, editValue)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
    stopEditing(fieldId)
  }

  const formatValue = (val: string | number | Date) => {
    if (type === "currency" && typeof val === "number") {
      return `$${val.toLocaleString()}`
    }
    if (type === "date" && val instanceof Date) {
      return val.toLocaleDateString()
    }
    if (type === "status" && typeof val === "string") {
      const option = statusOptions.find((opt) => opt.value === val)
      if (option) {
        return <span className={option.className}>{option.label}</span>
      }
    }
    return val
  }

  if (!isEditing) {
    return (
      <div className={`group flex items-center gap-2 ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "relative rounded px-2 py-1 transition-all",
                  isBeingEditedByOther
                    ? `cursor-not-allowed border border-dashed ${editingUser?.color || "border-gray-300"}`
                    : "cursor-pointer bg-sky-50 border border-sky-100 hover:bg-sky-100 hover:border-sky-200",
                )}
                onClick={handleStartEditing}
              >
                {formatValue(value)}
                {isBeingEditedByOther && (
                  <span className="absolute -top-2 -right-2">
                    <Avatar className="h-5 w-5 border border-white">
                      <AvatarFallback className={editingUser?.color || "bg-gray-300"}>
                        {editingUser?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                )}
              </span>
            </TooltipTrigger>
            {isBeingEditedByOther && (
              <TooltipContent>
                <p>Being edited by {editingUser?.name || "another user"}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {!isBeingEditedByOther && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleStartEditing}
          >
            <Pencil className="h-3 w-3 text-sky-500" />
            <span className="sr-only">Edit</span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {type === "currency" ? (
        <div className="flex items-center">
          <span className="mr-1 text-sky-500 font-medium">$</span>
          <Input
            type="number"
            value={typeof editValue === "number" ? editValue : 0}
            onChange={(e) => setEditValue(Number(e.target.value))}
            className="h-8 w-24 border-sky-200 bg-sky-50 focus-visible:ring-sky-300"
            autoFocus
          />
        </div>
      ) : type === "date" ? (
        <DatePicker
          date={editValue instanceof Date ? editValue : new Date(String(editValue))}
          onSelect={(date) => setEditValue(date || new Date())}
          className="h-8 w-40"
        />
      ) : type === "status" ? (
        <StatusSelect
          value={String(editValue)}
          onValueChange={(value) => setEditValue(value)}
          options={statusOptions}
          className="h-8 w-40"
        />
      ) : (
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(type === "number" ? Number(e.target.value) : e.target.value)}
          className="h-8 border-sky-200 bg-sky-50 focus-visible:ring-sky-300"
          autoFocus
        />
      )}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-green-500 hover:bg-green-50" onClick={handleSave}>
          <Check className="h-3 w-3" />
          <span className="sr-only">Save</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-sky-500 hover:bg-sky-50" onClick={handleCancel}>
          <X className="h-3 w-3" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    </div>
  )
}
