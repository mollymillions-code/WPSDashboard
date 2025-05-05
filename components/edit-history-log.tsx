"use client"

import React, { useState, useMemo } from "react"
import { format } from "date-fns"
import { History, X, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditHistory } from "@/contexts/edit-history-context"
import { Badge } from "@/components/ui/badge"

// Define the expected shape of an edit history entry
// (Adjust properties based on your actual data structure)
interface EditHistoryEntry {
  id: string;
  userId: string;
  userName?: string;
  userRole: string;
  section: string;
  fieldId: string;
  previousValue: any;
  newValue: any;
  timestamp: string | number | Date;
}

type EditHistoryLogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditHistoryLog({ open, onOpenChange }: EditHistoryLogProps) {
  const { editHistory, clearHistory, isLoading, error } = useEditHistory();
  const [userFilter, setUserFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  // **Explicit check early on**:
  if (isLoading) {
    // Let main loading check handle it
  } else if (error) {
    // Let main error display handle it
  } else if (!Array.isArray(editHistory)) {
    // Prevent hooks running with invalid input
    console.warn("Edit history is not an array, rendering placeholder.");
  }

  // Get unique users and sections for filters (with guards)
  const users = useMemo(() => {
    if (!Array.isArray(editHistory)) return [];
    const uniqueUsers = new Set(editHistory.map((entry) => entry.userId));
    return Array.from(uniqueUsers).map((userId) => {
      const entry = editHistory.find((e) => e.userId === userId);
      return {
        id: userId,
        name: entry?.userName || `User ${userId.substring(0, 6)}...` || "Unknown User",
      };
    });
  }, [editHistory]);

  const sections = useMemo(() => {
    if (!Array.isArray(editHistory)) return [];
    const uniqueSections = new Set(editHistory.map((entry) => entry.section));
    return Array.from(uniqueSections).filter(Boolean);
  }, [editHistory]);

  // Filter history based on selected filters (with guards)
  const filteredHistory = useMemo(() => {
    if (!Array.isArray(editHistory)) return [];
    return editHistory.filter((entry) => {
      const matchesUser = userFilter === "all" || entry.userId === userFilter;
      const matchesSection = sectionFilter === "all" || entry.section === sectionFilter;
      return matchesUser && matchesSection;
    });
  }, [editHistory, userFilter, sectionFilter]);

  // Function to format the value for display
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "—"
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  // Function to get role badge color
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-rose-100 text-rose-700 border-rose-200"
      case "editor":
        return "bg-sky-100 text-sky-700 border-sky-200"
      case "viewer":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  // Check again before rendering
  const historyReady = Array.isArray(editHistory);
  // Ensure displayHistory is always an array for safe access
  const displayHistory = Array.isArray(filteredHistory) ? filteredHistory : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Edit History Log
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex items-center gap-2">
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : !historyReady || displayHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {userFilter !== 'all' || sectionFilter !== 'all' ? 'No entries match filters' : 'No edit history found'}
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {displayHistory.map((entry: EditHistoryEntry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.userName}</span>
                      <Badge variant="outline" className={getRoleBadgeClass(entry.userRole)}>
                        {entry.userRole}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>

                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Field:</span> {entry.fieldId}
                    {entry.section && (
                      <>
                        <span className="text-muted-foreground ml-2">Section:</span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {entry.section}
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Previous Value</div>
                      <div className="bg-muted/50 rounded p-2 text-sm font-mono break-all">
                        {formatValue(entry.previousValue)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">New Value</div>
                      <div className="bg-muted/50 rounded p-2 text-sm font-mono break-all">
                        {formatValue(entry.newValue)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
