"use client"

import { useState } from "react"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Info,
  LayoutDashboard,
  ListChecks,
  MapPin,
  PieChart,
  Target,
  Users,
  X,
  Megaphone,
  Radio,
  History,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { EditableField } from "@/components/editable-field"
import { EditableBudgetTable } from "@/components/editable-budget-table"
import { EditableTimeline } from "@/components/editable-timeline"
import { BudgetBreakdown } from "@/components/budget-breakdown"
import { MarketingPRTab } from "@/components/marketing-pr-tab"
import { BroadcastScheduleTab } from "@/components/broadcast-schedule-tab"
import { CollaborationPanel } from "@/components/collaboration-panel"
// Remove the UserMenu import
// import { UserMenu } from "@/components/user-menu"
import { TabViewers } from "@/components/tab-viewers"
import { UpdateNotification } from "@/components/update-notification"
import { useCollaboration } from "@/hooks/use-collaboration"
import { UserProfile } from "@/components/user-profile"
import { useState as useStateForHistory } from "react"
import { EditHistoryLog } from "@/components/edit-history-log"
import { Button } from "@/components/ui/button"
import SafeEditHistory from "@/components/safe-edit-history"

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [issueDate, setIssueDate] = useState("03 May 2025")
  const [totalBudget, setTotalBudget] = useState(193000)
  const [eventDuration, setEventDuration] = useState("100 min")
  const [venueCapacity, setVenueCapacity] = useState(500)
  const [legalStatus, setLegalStatus] = useState("Pending")
  const [psaSanctionDate, setPsaSanctionDate] = useState("May 7")
  const [isHistoryOpen, setIsHistoryOpen] = useStateForHistory(false)
  const [showSafeHistory, setShowSafeHistory] = useState(false)

  // Status options for consistent status selection across components
  const statusOptions = [
    { value: "Pending", label: "Pending", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "In Review", label: "In Review", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "In Progress", label: "In Progress", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "Scheduled", label: "Scheduled", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "Drafting", label: "Drafting", className: "text-amber-500 border-amber-200 bg-amber-50" },
    { value: "Complete", label: "Complete", className: "text-green-500 border-green-200 bg-green-50" },
    { value: "Confirmed", label: "Confirmed", className: "text-green-500 border-green-200 bg-green-50" },
  ]

  const [budgetItems, setBudgetItems] = useState([
    {
      id: "venue-license",
      category: "Venue",
      lineItem: "Rockefeller Rink private licence (4 h)",
      cost: 55000,
    },
    {
      id: "venue-services",
      category: "",
      lineItem: "Mandatory security/cleaning/utilities",
      cost: 8000,
    },
    {
      id: "court-rental",
      category: "Sport infrastructure",
      lineItem: "Portable PSA glass court (rental + install)",
      cost: 25000,
    },
    {
      id: "seating",
      category: "",
      lineItem: "Seating risers (250)",
      cost: 12000,
    },
    {
      id: "pros",
      category: "Athlete talent",
      lineItem: "4 top-ranked pros",
      cost: 20000,
    },
    {
      id: "junior-pros",
      category: "",
      lineItem: "Junior pros (fan rally)",
      cost: 1500,
    },
    {
      id: "lighting",
      category: "Production",
      lineItem: "Lighting & board projection",
      cost: 15000,
    },
    {
      id: "av",
      category: "",
      lineItem: "AV (mics, 2 HD cams, encoder)",
      cost: 13000,
    },
    {
      id: "host-fees",
      category: "Presentation",
      lineItem: "Host + creator fees",
      cost: 6000,
    },
    {
      id: "clip-editing",
      category: "",
      lineItem: "Clip-editing cloud",
      cost: 1000,
    },
    {
      id: "catering",
      category: "Guest services",
      lineItem: "Non-alcoholic bar & canapés (300)",
      cost: 6000,
    },
    {
      id: "signage",
      category: "",
      lineItem: "Wristbands, signage, photo backdrop",
      cost: 3500,
    },
    {
      id: "security",
      category: "Operations",
      lineItem: "Extra security, ushers, insurance",
      cost: 10000,
    },
    {
      id: "crew",
      category: "",
      lineItem: "Crew (show-caller, runners, loaders)",
      cost: 8000,
    },
    {
      id: "contingency",
      category: "Contingency (8%)",
      lineItem: "Reserve",
      cost: 14000,
    },
  ])

  const handleBudgetChange = (updatedBudget) => {
    setBudgetItems(updatedBudget)
    // Update the total budget in the overview tab
    const newTotal = updatedBudget.reduce((sum, item) => sum + item.cost, 0)
    setTotalBudget(newTotal)
  }

  // Calculate budget categories for the breakdown
  const calculateBudgetCategories = () => {
    const categoryMap = new Map()

    budgetItems.forEach((item) => {
      const category = item.category || "Uncategorized"
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          id: category.toLowerCase().replace(/\s+/g, "-"),
          name: category,
          amount: 0,
        })
      }

      const categoryData = categoryMap.get(category)
      categoryData.amount += item.cost
    })

    // Handle empty categories (items with empty category string but belonging to previous category)
    let currentCategory = null
    budgetItems.forEach((item) => {
      if (item.category) {
        currentCategory = item.category
      } else if (currentCategory && !item.category) {
        const categoryData = categoryMap.get(currentCategory)
        if (categoryData) {
          // We've already added the cost above, this is just for verification
        }
      }
    })

    return Array.from(categoryMap.values())
  }

  const timelineItems = [
    {
      id: "psa-sanction",
      name: "PSA Written Sanction",
      status: "Pending",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 7, 2025",
      progress: 70,
    },
    {
      id: "wsf-alignment",
      name: "WSF Alignment",
      status: "In Review",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 5, 2025",
      progress: 50,
    },
    {
      id: "hot-signed",
      name: "Heads-of-terms Signed",
      status: "In Progress",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 9, 2025",
      progress: 40,
    },
    {
      id: "psa-board",
      name: "PSA Board Ratification",
      status: "Scheduled",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 13, 2025",
      progress: 20,
    },
    {
      id: "contract",
      name: "Long-form Contract",
      status: "Drafting",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 20, 2025",
      progress: 15,
    },
  ]

  const { recentUpdates } = useCollaboration()

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={() => setShowSafeHistory(!showSafeHistory)}
          variant="outline"
          size="sm"
        >
          {showSafeHistory ? "Hide Safe History" : "Show Safe History"}
        </Button>
      </div>
      
      {showSafeHistory && <SafeEditHistory />}
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-background">
          <Sidebar className="border-r">
            <SidebarHeader className="flex h-14 items-center border-b px-4">
              <div className="flex items-center gap-2 font-semibold">
                <PieChart className="h-6 w-6 text-rose-600" />
                <span className="text-lg">WPS Dashboard</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "objectives"} onClick={() => setActiveTab("objectives")}>
                    <Target className="h-5 w-5" />
                    <span>Objectives</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "venue"} onClick={() => setActiveTab("venue")}>
                    <MapPin className="h-5 w-5" />
                    <span>Venue</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "schedule"} onClick={() => setActiveTab("schedule")}>
                    <Calendar className="h-5 w-5" />
                    <span>Schedule</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "broadcast"} onClick={() => setActiveTab("broadcast")}>
                    <Radio className="h-5 w-5" />
                    <span>Broadcast</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "budget"} onClick={() => setActiveTab("budget")}>
                    <DollarSign className="h-5 w-5" />
                    <span>Budget</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "legal"} onClick={() => setActiveTab("legal")}>
                    <FileText className="h-5 w-5" />
                    <span>Legal & Rights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "marketing"} onClick={() => setActiveTab("marketing")}>
                    <Megaphone className="h-5 w-5" />
                    <span>Press & Marketing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "risks"} onClick={() => setActiveTab("risks")}>
                    <AlertCircle className="h-5 w-5" />
                    <span>Risks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "next"} onClick={() => setActiveTab("next")}>
                    <ListChecks className="h-5 w-5" />
                    <span>Next Steps</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">WPS Team</p>
                  <p className="text-xs text-muted-foreground">
                    Issue date:{" "}
                    <EditableField value={issueDate} onSave={setIssueDate} className="inline-block" section="General" />
                  </p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">World Premier Squash - Inaugural Launch Showcase</h1>
                  <TabViewers activeTab={activeTab} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <History className="h-4 w-4" />
                  <span>Edit History</span>
                </Button>
                <UserProfile />
              </div>
              <EditHistoryLog open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
            </header>
            <main className="grid gap-4 p-4 md:gap-8 md:p-6">
              {activeTab === "overview" && (
                <OverviewTab
                  totalBudget={totalBudget}
                  setTotalBudget={setTotalBudget}
                  eventDuration={eventDuration}
                  setEventDuration={setEventDuration}
                  venueCapacity={venueCapacity}
                  setVenueCapacity={setVenueCapacity}
                  legalStatus={legalStatus}
                  setLegalStatus={setLegalStatus}
                  psaSanctionDate={psaSanctionDate}
                  setPsaSanctionDate={setPsaSanctionDate}
                  timelineItems={timelineItems}
                  statusOptions={statusOptions}
                />
              )}
              {activeTab === "objectives" && <ObjectivesTab statusOptions={statusOptions} />}
              {activeTab === "venue" && <VenueTab />}
              {activeTab === "schedule" && <ScheduleTab />}
              {activeTab === "broadcast" && <BroadcastScheduleTab />}
              {activeTab === "budget" && (
                <BudgetTab
                  budgetItems={budgetItems}
                  onBudgetChange={handleBudgetChange}
                  totalBudget={totalBudget}
                  budgetCategories={calculateBudgetCategories()}
                />
              )}
              {activeTab === "legal" && <LegalTab statusOptions={statusOptions} />}
              {activeTab === "marketing" && <MarketingPRTab />}
              {activeTab === "risks" && <RisksTab statusOptions={statusOptions} />}
              {activeTab === "next" && <NextStepsTab statusOptions={statusOptions} />}
            </main>
            <UpdateNotification updates={recentUpdates} />
            <CollaborationPanel />
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}

function OverviewTab({
  totalBudget,
  setTotalBudget,
  eventDuration,
  setEventDuration,
  venueCapacity,
  setVenueCapacity,
  legalStatus,
  setLegalStatus,
  psaSanctionDate,
  setPsaSanctionDate,
  timelineItems,
  statusOptions,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Includes 8% contingency</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Event Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <EditableField value={eventDuration} onSave={setEventDuration} section="Overview" />
          </div>
          <p className="text-xs text-muted-foreground">18:00 - 20:30 (incl. networking)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Venue Capacity</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <EditableField value={venueCapacity} onSave={setVenueCapacity} type="number" section="Overview" />
          </div>
          <p className="text-xs text-muted-foreground">The Rink at Rockefeller Center</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Legal Status</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <EditableField
              value={legalStatus}
              onSave={setLegalStatus}
              type="status"
              statusOptions={statusOptions}
              section="Overview"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            PSA sanction expected by{" "}
            <EditableField
              value={psaSanctionDate}
              onSave={setPsaSanctionDate}
              className="inline-block"
              section="Overview"
            />
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Deliver a 100-minute mixed-pair exhibition and brand reveal on the Summer Rink at Rockefeller Center
            (capacity ≈ 500) to demonstrate the league format, capture content and secure sponsor confidence. Target
            out-turn spend ≈ US $190k.
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Event Concept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
            <p>Format: four × five-minute mixed-gender pairs (cumulative scoring) + fan rally.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
            <p>Audience mix: 250 invited guests (brand, media, investors) + 150 public paid + 50 staff/players.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
            <p>Distribution: single HD world feed + licensed creator vertical stream.</p>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EditableTimeline initialItems={timelineItems} />
        </CardContent>
      </Card>
    </div>
  )
}

function ObjectivesTab({ statusOptions }) {
  const [objectives, setObjectives] = useState([
    {
      id: "obj1",
      goal: "Showcase new 40-minute match model",
      metric: "TV-ready run-of-show executed ≤ 105 min",
      threshold: "< 5 min deviation",
      status: "Planned",
      progress: 25,
    },
    {
      id: "obj2",
      goal: "Generate sponsor & media assets",
      metric: "15 editable highlight clips within 24 h",
      threshold: "100k aggregate views",
      status: "Planned",
      progress: 15,
    },
    {
      id: "obj3",
      goal: "Cement governing-body support",
      metric: "PSA written sanction on file pre-event",
      threshold: "Received ≥ 7 May 25",
      status: "In Progress",
      progress: 70,
    },
    {
      id: "obj4",
      goal: "Advance franchise sales",
      metric: "2 LOIs from India / New York groups",
      threshold: "Signed within 30 days",
      status: "In Progress",
      progress: 40,
    },
  ])

  const [metrics, setMetrics] = useState({
    runTime: "100 min",
    runTimeTarget: "≤ 105 min",
    highlightClips: "15",
    highlightClipsTarget: "15 clips",
    psaSanction: "Pending",
    psaSanctionDue: "May 7, 2025",
    lois: "0/2",
    loisTarget: "2 signed",
  })

  const updateMetric = (key, value) => {
    setMetrics({
      ...metrics,
      [key]: value,
    })
  }

  const updateObjectiveStatus = (id, status) => {
    setObjectives(
      objectives.map((obj) => {
        if (obj.id === id) {
          return { ...obj, status }
        }
        return obj
      }),
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Objectives</CardTitle>
          <CardDescription>Key goals and success metrics for the event</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Goal</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Success Threshold</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objectives.map((objective) => (
                <TableRow key={objective.id}>
                  <TableCell className="font-medium">{objective.goal}</TableCell>
                  <TableCell>{objective.metric}</TableCell>
                  <TableCell>{objective.threshold}</TableCell>
                  <TableCell className="text-right">
                    <EditableField
                      value={objective.status}
                      onSave={(value) => updateObjectiveStatus(objective.id, value)}
                      type="status"
                      statusOptions={statusOptions}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Objective Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {objectives.map((objective) => (
              <div className="space-y-2" key={objective.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{objective.goal}</span>
                  <EditableField
                    value={objective.progress}
                    onSave={(value) => {
                      setObjectives(
                        objectives.map((obj) => (obj.id === objective.id ? { ...obj, progress: Number(value) } : obj)),
                      )
                    }}
                    type="number"
                  />
                </div>
                <Progress value={objective.progress} className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Run Time</div>
                <div className="text-2xl font-bold">
                  <EditableField
                    value={metrics.runTime}
                    onSave={(value) => updateMetric("runTime", value)}
                    className="inline-block"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Target:{" "}
                  <EditableField
                    value={metrics.runTimeTarget}
                    onSave={(value) => updateMetric("runTimeTarget", value)}
                    className="inline-block"
                  />
                </div>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Highlight Clips</div>
                <div className="text-2xl font-bold">
                  <EditableField
                    value={metrics.highlightClips}
                    onSave={(value) => updateMetric("highlightClips", value)}
                    className="inline-block"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Target:{" "}
                  <EditableField
                    value={metrics.highlightClipsTarget}
                    onSave={(value) => updateMetric("highlightClipsTarget", value)}
                    className="inline-block"
                  />
                </div>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">PSA Sanction</div>
                <div className="text-2xl font-bold">
                  <EditableField
                    value={metrics.psaSanction}
                    onSave={(value) => updateMetric("psaSanction", value)}
                    type="status"
                    statusOptions={statusOptions}
                    className="inline-block"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Due:{" "}
                  <EditableField
                    value={metrics.psaSanctionDue}
                    onSave={(value) => updateMetric("psaSanctionDue", value)}
                    className="inline-block"
                  />
                </div>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">LOIs</div>
                <div className="text-2xl font-bold">
                  <EditableField
                    value={metrics.lois}
                    onSave={(value) => updateMetric("lois", value)}
                    className="inline-block"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Target:{" "}
                  <EditableField
                    value={metrics.loisTarget}
                    onSave={(value) => updateMetric("loisTarget", value)}
                    className="inline-block"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function VenueTab() {
  const [venueDetails, setVenueDetails] = useState([
    {
      id: "location",
      attribute: "Location",
      detail: "Sunken Plaza, Midtown Manhattan",
    },
    {
      id: "capacity",
      attribute: "Capacity",
      detail: "Sunken Plaza: 500 guests (rockefellercenter.com)",
    },
    {
      id: "decking",
      attribute: "Decking load",
      detail: "Proven for roller & ice installs; supports 40 × 20 ft glass court plus risers",
    },
    {
      id: "av",
      attribute: "AV infrastructure",
      detail: "House power & PA; façade projection restricted (board-level permissible)",
    },
    {
      id: "access",
      attribute: "Access window",
      detail: "Overnight build; event 18:00-20:30; breakdown by 02:00",
    },
  ])

  const updateVenueDetailFn = (id, detail) => {
    setVenueDetails(
      venueDetails.map((item) => {
        if (item.id === id) {
          return { ...item, detail }
        }
        return item
      }),
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Venue Analysis - The Rink at Rockefeller Center</CardTitle>
          <CardDescription>Key venue details and specifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Attribute</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venueDetails.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.attribute}</TableCell>
                  <TableCell>
                    <EditableField value={item.detail} onSave={(value) => updateVenueDetailFn(item.id, value)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Venue Advantages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Iconic backdrop for media and broadcast</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Easy broadcast fibre connectivity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Natural footfall for earned media</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Proven infrastructure for similar events</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
              <span>Central location for guests and sponsors</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Venue Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-rose-500" />
              <span>Strict noise curfew at 22:00</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-rose-500" />
              <span>Union labour rules for setup/breakdown</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-rose-500" />
              <span>Premium licence fee ($55,000)</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-rose-500" />
              <span>Façade projection restrictions</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-rose-500" />
              <span>Weather contingency needed (open plaza)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function ScheduleTab() {
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: "arrival",
      time: "18:00",
      segment: "Guest arrival",
      duration: "30 min",
      content: "Music playlist, welcome drinks, photo wall",
    },
    {
      id: "reveal",
      time: "18:30",
      segment: "Court reveal",
      duration: "3 min",
      content: "Curtain drop, lighting hit",
    },
    {
      id: "opening",
      time: "18:33",
      segment: "Opening address (host + creator)",
      duration: "2 min",
      content: "Outline rules, introduce athletes",
    },
    {
      id: "exhibition",
      time: "18:35",
      segment: "Exhibition tie (4 pairs)",
      duration: "40 min",
      content: "Real-time ball-speed overlay",
    },
    {
      id: "mvp",
      time: "19:15",
      segment: "MVP interview",
      duration: "5 min",
      content: "On-court clip for socials",
    },
    {
      id: "brand",
      time: "19:20",
      segment: "Team-brand reveal",
      duration: "5 min",
      content: "Logo projection on boards",
    },
    {
      id: "rally",
      time: "19:25",
      segment: "Fan rally",
      duration: "10 min",
      content: "Raffle winners v. junior pros",
    },
    {
      id: "toast",
      time: "19:35",
      segment: "Closing toast",
      duration: "5 min",
      content: "QR for season-pass pre-sale",
    },
    {
      id: "networking",
      time: "19:40",
      segment: "Networking & merch",
      duration: "50 min",
      content: "Capsule jerseys, sponsor stations",
    },
  ])

  const updateScheduleItem = (id, field, value) => {
    setScheduleItems(
      scheduleItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Programme Schedule</CardTitle>
          <CardDescription>100-minute event timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[200px]">Segment</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead>Key Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <EditableField value={item.time} onSave={(value) => updateScheduleItem(item.id, "time", value)} />
                  </TableCell>
                  <TableCell>{item.segment}</TableCell>
                  <TableCell>
                    <EditableField
                      value={item.duration}
                      onSave={(value) => updateScheduleItem(item.id, "duration", value)}
                    />
                  </TableCell>
                  <TableCell>{item.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Total public programme: 100 min</p>
        </CardFooter>
      </Card>
    </div>
  )
}

function BudgetTab({ budgetItems, onBudgetChange, totalBudget, budgetCategories }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Budget Estimate (USD, excl. tax)</CardTitle>
          <CardDescription>Total estimated budget: ${totalBudget.toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <EditableBudgetTable budget={budgetItems} onBudgetChange={onBudgetChange} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Note: Venue rate based on Rockefeller Center corporate buy-out band; update with official quotation on
            receipt.
          </p>
        </CardFooter>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetBreakdown categories={budgetCategories} total={totalBudget} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">
                  Venue rate based on Rockefeller Center corporate buy-out band; update with official quotation on
                  receipt.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">
                  Athlete fees are estimates based on current PSA rankings; final fees to be negotiated.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">
                  Production costs include basic lighting and projection; enhanced options available at additional cost.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">
                  8% contingency included to account for potential cost increases or unforeseen expenses.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">All figures are exclusive of tax and subject to final vendor quotes.</p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">Potential for in-kind sponsorships to offset beverage and merchandise costs.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LegalTab({ statusOptions }) {
  const [legalItems, setLegalItems] = useState([
    {
      id: "psa-sanction",
      milestone: "PSA written sanction",
      status: 'Verbal "go"; letter pending',
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      nextAction: "Follow-up with PSA CEO",
      targetDate: "7 May 25",
    },
    {
      id: "wsf-alignment",
      milestone: "WSF alignment",
      status: "Proposal under review",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      nextAction: "PSA × WSF call",
      targetDate: "5 May 25",
    },
    {
      id: "psa-board",
      milestone: "PSA board ratification",
      status: "Slot confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
      nextAction: "Present heads-of-terms",
      targetDate: "13 May 25",
    },
    {
      id: "hot-signed",
      milestone: "Heads-of-terms signed",
      status: "Figures agreed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
      nextAction: "Finalise signable HoT",
      targetDate: "9 May 25",
    },
    {
      id: "contract",
      milestone: "Long-form contract",
      status: "Bowling template as base",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      nextAction: "Draft squash schedules",
      targetDate: "20 May 25",
    },
    {
      id: "lois",
      milestone: "Territorial LOIs (India, NY)",
      status: "Verbal interest",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      nextAction: "Issue NDA + teaser deck",
      targetDate: "8 May 25",
    },
  ])

  const updateLegalItem = (id, field, value) => {
    setLegalItems(
      legalItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Update statusClass if status is being updated
          if (field === "status") {
            const selectedStatus = statusOptions.find((option) => option.value === value)
            if (selectedStatus) {
              updatedItem.statusClass = selectedStatus.className
            }
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Rights & Legal Status (Tracker)</CardTitle>
          <CardDescription>Current status of legal agreements and rights</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Milestone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Action</TableHead>
                <TableHead>Target Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {legalItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.milestone}</TableCell>
                  <TableCell>
                    <EditableField
                      value={item.status}
                      onSave={(value) => updateLegalItem(item.id, "status", value)}
                      type="status"
                      statusOptions={statusOptions}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableField
                      value={item.nextAction}
                      onSave={(value) => updateLegalItem(item.id, "nextAction", value)}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableField
                      value={item.targetDate}
                      onSave={(value) => updateLegalItem(item.id, "targetDate", value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function RisksTab({ statusOptions }) {
  const [risks, setRisks] = useState([
    {
      id: "psa-letter",
      risk: "PSA letter delayed",
      impact: "Cannot contract venue/athletes",
      mitigation: "Keep option holds; no deposits until letter received",
      severity: "High",
      severityClass: "bg-rose-500",
      mitigationProgress: 70,
      status: "Monitoring",
    },
    {
      id: "wsf-objections",
      risk: "WSF objections",
      impact: "Sanction language changes",
      mitigation: "Include revision buffer before 13 May board vote",
      severity: "Medium",
      severityClass: "bg-amber-500",
      mitigationProgress: 50,
      status: "Mitigating",
    },
    {
      id: "weather",
      risk: "Weather (open plaza)",
      impact: "Build/tech delay",
      mitigation: "Secure overnight build window; stage-cover canopy",
      severity: "Medium",
      severityClass: "bg-amber-500",
      mitigationProgress: 60,
      status: "Planning",
    },
    {
      id: "cost-creep",
      risk: "Cost creep in venue services",
      impact: "Budget overrun",
      mitigation: "Fixed-price service contracts; 8% contingency",
      severity: "Low",
      severityClass: "bg-green-500",
      mitigationProgress: 80,
      status: "Controlled",
    },
    {
      id: "athlete-availability",
      risk: "Athlete availability",
      impact: "Reduced star power",
      mitigation: "Early booking; backup options for each position",
      severity: "Medium",
      severityClass: "bg-amber-500",
      mitigationProgress: 40,
      status: "Addressing",
    },
  ])

  const updateRiskMitigation = (id, progress) => {
    setRisks(
      risks.map((risk) => {
        if (risk.id === id) {
          return { ...risk, mitigationProgress: progress }
        }
        return risk
      }),
    )
  }

  const updateRiskStatus = (id, status) => {
    setRisks(
      risks.map((risk) => {
        if (risk.id === id) {
          return { ...risk, status }
        }
        return risk
      }),
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Risk Register</CardTitle>
          <CardDescription>Key risks and mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Risk</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Mitigation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium">{risk.risk}</TableCell>
                  <TableCell>{risk.impact}</TableCell>
                  <TableCell>
                    <EditableField
                      value={risk.mitigation}
                      onSave={(value) => {
                        setRisks(risks.map((r) => (r.id === risk.id ? { ...r, mitigation: value } : r)))
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableField
                      value={risk.status}
                      onSave={(value) => updateRiskStatus(risk.id, value)}
                      type="status"
                      statusOptions={statusOptions}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={risk.severityClass}>{risk.severity}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Mitigation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {risks.map((risk) => (
                <div className="space-y-2" key={risk.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{risk.risk}</span>
                    <EditableField
                      value={risk.mitigationProgress}
                      onSave={(value) => updateRiskMitigation(risk.id, Number(value))}
                      type="number"
                    />
                  </div>
                  <Progress value={risk.mitigationProgress} className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NextStepsTab({ statusOptions }) {
  const [nextSteps, setNextSteps] = useState([
    {
      id: "step1",
      step: "Authorise venue formal quotation and option hold (subject to PSA letter)",
      status: "Pending",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: "May 7, 2025",
    },
    {
      id: "step2",
      step: "Approve athlete shortlist and issue appearance offers",
      status: "In Progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: "May 8, 2025",
    },
    {
      id: "step3",
      step: "Confirm beverage and merch partners for in-kind offsets",
      status: "In Progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: "May 10, 2025",
    },
    {
      id: "step4",
      step: 'Finalise press-release wording for "rights acquired" announcement contingent on PSA letter',
      status: "Drafting",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: "May 9, 2025",
    },
  ])

  const updateNextStep = (id, field, value) => {
    setNextSteps(
      nextSteps.map((step) => {
        if (step.id === id) {
          const updatedStep = { ...step, [field]: value }

          // Update statusClass if status is being updated
          if (field === "status") {
            const selectedStatus = statusOptions.find((option) => option.value === value)
            if (selectedStatus) {
              updatedStep.statusClass = selectedStatus.className
            }
          }

          return updatedStep
        }
        return step
      }),
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Next Decisions (week commencing 6 May)</CardTitle>
          <CardDescription>Key actions required in the coming week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div className="flex items-start gap-4 rounded-lg border p-4" key={step.id}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-medium">
                    <EditableField value={step.step} onSave={(value) => updateNextStep(step.id, "step", value)} />
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <EditableField
                      value={step.status}
                      onSave={(value) => updateNextStep(step.id, "status", value)}
                      type="status"
                      statusOptions={statusOptions}
                    />
                    <span className="text-sm text-muted-foreground">
                      Due:{" "}
                      <EditableField
                        value={step.dueDate}
                        onSave={(value) => updateNextStep(step.id, "dueDate", value)}
                        className="inline-block"
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
