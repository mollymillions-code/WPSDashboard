"use client"

import { useState } from "react"
import { Calendar, CheckCircle2, Clock, ExternalLink, FileText, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { EditableField } from "@/components/editable-field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketingBudget } from "@/components/marketing-budget"
import type { StatusOption } from "@/components/status-select"

export function MarketingPRTab() {
  // Status options that will be used across the component
  const statusOptions: StatusOption[] = [
    { value: "scheduled", label: "Scheduled", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "in-progress", label: "In Progress", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "planning", label: "Planning", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "complete", label: "Complete", className: "bg-green-50 text-green-500 border-green-200" },
    { value: "confirmed", label: "Confirmed", className: "bg-green-50 text-green-500 border-green-200" },
    { value: "in-discussion", label: "In Discussion", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "pitched", label: "Pitched", className: "bg-amber-50 text-amber-500 border-amber-200" },
  ]

  const [marketingActivities, setMarketingActivities] = useState([
    {
      id: "press-release",
      activity: "Press Release Distribution",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      owner: "Sarah Chen",
      dueDate: new Date("2025-05-12"),
      progress: 60,
    },
    {
      id: "social-campaign",
      activity: "Social Media Campaign",
      status: "in-progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      owner: "Marcus Johnson",
      dueDate: new Date("2025-05-08"),
      progress: 40,
    },
    {
      id: "media-outreach",
      activity: "Media Outlet Outreach",
      status: "in-progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      owner: "Sarah Chen",
      dueDate: new Date("2025-05-10"),
      progress: 35,
    },
    {
      id: "influencer",
      activity: "Influencer Partnerships",
      status: "planning",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      owner: "Marcus Johnson",
      dueDate: new Date("2025-05-15"),
      progress: 20,
    },
    {
      id: "email-blast",
      activity: "Email Blast to Database",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      owner: "Priya Sharma",
      dueDate: new Date("2025-05-14"),
      progress: 50,
    },
  ])

  const [mediaOutlets, setMediaOutlets] = useState([
    {
      id: "squash-tv",
      outlet: "SquashTV",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
      contactPerson: "James Wilson",
      coverage: "Live stream + highlights",
    },
    {
      id: "sports-illustrated",
      outlet: "Sports Illustrated",
      status: "in-discussion",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      contactPerson: "Maria Rodriguez",
      coverage: "Feature article + social",
    },
    {
      id: "espn",
      outlet: "ESPN Digital",
      status: "pitched",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      contactPerson: "David Thompson",
      coverage: "News coverage",
    },
    {
      id: "squash-mag",
      outlet: "Squash Magazine",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
      contactPerson: "Aisha Patel",
      coverage: "Pre/post event coverage",
    },
    {
      id: "nbc-ny",
      outlet: "NBC New York",
      status: "pitched",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      contactPerson: "Michael Chang",
      coverage: "Local news segment",
    },
  ])

  const [marketingAssets, setMarketingAssets] = useState([
    {
      id: "press-kit",
      asset: "Press Kit",
      status: "in-progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: new Date("2025-05-06"),
      assignedTo: "Sarah Chen",
    },
    {
      id: "social-graphics",
      asset: "Social Media Graphics",
      status: "in-progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: new Date("2025-05-05"),
      assignedTo: "Marcus Johnson",
    },
    {
      id: "promo-video",
      asset: "Promotional Video",
      status: "planning",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: new Date("2025-05-10"),
      assignedTo: "Video Team",
    },
    {
      id: "email-template",
      asset: "Email Template",
      status: "complete",
      statusClass: "bg-green-50 text-green-500 border-green-200",
      dueDate: new Date("2025-05-03"),
      assignedTo: "Priya Sharma",
    },
    {
      id: "media-alert",
      asset: "Media Alert",
      status: "in-progress",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      dueDate: new Date("2025-05-08"),
      assignedTo: "Sarah Chen",
    },
  ])

  // Marketing budget data
  const marketingBudgetItems = [
    {
      id: "pr-distribution",
      category: "PR",
      lineItem: "Press Release Distribution",
      cost: 2500,
      notes: "PR Newswire premium package",
    },
    {
      id: "social-ads",
      category: "Digital Marketing",
      lineItem: "Social Media Advertising",
      cost: 7500,
      notes: "Instagram, Facebook, Twitter campaigns",
    },
    {
      id: "influencer-fees",
      category: "Influencer Marketing",
      lineItem: "Influencer Partnership Fees",
      cost: 5000,
      notes: "3 sports influencers",
    },
    {
      id: "content-creation",
      category: "Content",
      lineItem: "Video Production",
      cost: 8500,
      notes: "Promo video and highlight clips",
    },
    {
      id: "photography",
      category: "Content",
      lineItem: "Event Photography",
      cost: 3000,
      notes: "Professional photographer + editing",
    },
    {
      id: "print-materials",
      category: "Print",
      lineItem: "Brochures & Programs",
      cost: 2200,
      notes: "500 premium programs",
    },
    {
      id: "media-kits",
      category: "PR",
      lineItem: "Media Kits",
      cost: 1800,
      notes: "50 premium press kits",
    },
    {
      id: "email-marketing",
      category: "Digital Marketing",
      lineItem: "Email Campaign",
      cost: 1000,
      notes: "Design and distribution",
    },
  ]

  const updateMarketingActivity = (id, field, value) => {
    setMarketingActivities(
      marketingActivities.map((activity) => {
        if (activity.id === id) {
          const updatedActivity = { ...activity, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = statusOptions.find((option) => option.value === value)
            if (selectedStatus) {
              updatedActivity.statusClass = selectedStatus.className
            }
          }

          return updatedActivity
        }
        return activity
      }),
    )
  }

  const updateMediaOutlet = (id, field, value) => {
    setMediaOutlets(
      mediaOutlets.map((outlet) => {
        if (outlet.id === id) {
          const updatedOutlet = { ...outlet, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = statusOptions.find((option) => option.value === value)
            if (selectedStatus) {
              updatedOutlet.statusClass = selectedStatus.className
            }
          }

          return updatedOutlet
        }
        return outlet
      }),
    )
  }

  const updateMarketingAsset = (id, field, value) => {
    setMarketingAssets(
      marketingAssets.map((asset) => {
        if (asset.id === id) {
          const updatedAsset = { ...asset, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = statusOptions.find((option) => option.value === value)
            if (selectedStatus) {
              updatedAsset.statusClass = selectedStatus.className
            }
          }

          return updatedAsset
        }
        return asset
      }),
    )
  }

  return (
    <div className="grid gap-4">
      <Tabs defaultValue="activities">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activities">Marketing Activities</TabsTrigger>
          <TabsTrigger value="media">Media Coverage</TabsTrigger>
          <TabsTrigger value="assets">Marketing Assets</TabsTrigger>
          <TabsTrigger value="budget">Marketing Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Marketing & PR Activities</CardTitle>
              <CardDescription>Track status of all marketing and PR initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.activity}</TableCell>
                      <TableCell>
                        <EditableField
                          value={activity.status}
                          onSave={(value) => updateMarketingActivity(activity.id, "status", value)}
                          type="status"
                          statusOptions={statusOptions}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={activity.owner}
                          onSave={(value) => updateMarketingActivity(activity.id, "owner", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={activity.dueDate}
                          onSave={(value) => updateMarketingActivity(activity.id, "dueDate", value)}
                          type="date"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm">{activity.progress}%</span>
                          <EditableField
                            value={activity.progress}
                            onSave={(value) => updateMarketingActivity(activity.id, "progress", Number(value))}
                            type="number"
                            className="w-16"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingActivities.map((activity) => (
                    <div className="space-y-2" key={activity.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{activity.activity}</span>
                        <span>{activity.progress}%</span>
                      </div>
                      <Progress value={activity.progress} className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Marketing Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingActivities.map((activity) => (
                    <div className="flex items-start gap-2" key={activity.id}>
                      <Calendar className="mt-0.5 h-4 w-4 text-rose-500" />
                      <div>
                        <p className="font-medium">{activity.activity}</p>
                        <p className="text-sm text-muted-foreground">Due: {activity.dueDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Coverage Tracker</CardTitle>
              <CardDescription>Track media outlets and coverage commitments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Media Outlet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Coverage Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaOutlets.map((outlet) => (
                    <TableRow key={outlet.id}>
                      <TableCell className="font-medium">{outlet.outlet}</TableCell>
                      <TableCell>
                        <EditableField
                          value={outlet.status}
                          onSave={(value) => updateMediaOutlet(outlet.id, "status", value)}
                          type="status"
                          statusOptions={statusOptions}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={outlet.contactPerson}
                          onSave={(value) => updateMediaOutlet(outlet.id, "contactPerson", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={outlet.coverage}
                          onSave={(value) => updateMediaOutlet(outlet.id, "coverage", value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Media Coverage Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mediaOutlets.map((outlet) => (
                    <div className="flex items-start gap-2" key={outlet.id}>
                      {outlet.status === "confirmed" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="mt-0.5 h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <p className="font-medium">{outlet.outlet}</p>
                        <p className="text-sm text-muted-foreground">
                          {outlet.contactPerson} • {outlet.coverage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Talking Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>First-ever mixed-gender pairs format with cumulative scoring system</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Iconic Rockefeller Center venue with glass court installation</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Top-ranked PSA pros participating in exhibition matches</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Innovative 40-minute match format designed for broadcast</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Fan engagement opportunities including on-court rally with pros</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Assets Tracker</CardTitle>
              <CardDescription>Track development of marketing materials and assets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Asset</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.asset}</TableCell>
                      <TableCell>
                        <EditableField
                          value={asset.status}
                          onSave={(value) => updateMarketingAsset(asset.id, "status", value)}
                          type="status"
                          statusOptions={statusOptions}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={asset.dueDate}
                          onSave={(value) => updateMarketingAsset(asset.id, "dueDate", value)}
                          type="date"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={asset.assignedTo}
                          onSave={(value) => updateMarketingAsset(asset.id, "assignedTo", value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Brand Positioning</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      "World Premier Squash reimagines the sport with a fast-paced, TV-friendly format that showcases
                      the world's best talent in iconic venues."
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Event Tagline</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      "The Future of Squash Arrives at Rockefeller Center"
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Social Media Hashtags</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      #WPSLaunch #SquashReimagined #RockefellerSquash
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Share2 className="mt-0.5 h-4 w-4 text-rose-500" />
                    <div>
                      <p className="font-medium">Social Media</p>
                      <p className="text-sm text-muted-foreground">Instagram, Twitter, Facebook, TikTok</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 text-rose-500" />
                    <div>
                      <p className="font-medium">Press Release</p>
                      <p className="text-sm text-muted-foreground">PR Newswire, Sports Business Wire</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ExternalLink className="mt-0.5 h-4 w-4 text-rose-500" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-sm text-muted-foreground">WPS landing page, PSA website</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 text-rose-500" />
                    <div>
                      <p className="font-medium">Email Marketing</p>
                      <p className="text-sm text-muted-foreground">PSA database, venue subscriber list</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <MarketingBudget initialBudget={marketingBudgetItems} />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Digital Marketing", amount: 8500 },
                    { name: "PR", amount: 4300 },
                    { name: "Content", amount: 11500 },
                    { name: "Influencer Marketing", amount: 5000 },
                    { name: "Print", amount: 2200 },
                  ].map((category) => {
                    const percentage = Math.round((category.amount / 31500) * 100)
                    return (
                      <div className="space-y-2" key={category.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {category.name} (${category.amount.toLocaleString()})
                          </span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full rounded-full bg-rose-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Total marketing budget represents approximately 16% of the overall event budget</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Content creation is the largest expense category due to high-quality video production needs</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>
                      Influencer partnerships are focused on sports and lifestyle influencers with relevant audiences
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>Digital marketing spend is prioritized for targeted social media campaigns</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></div>
                    <p>PR distribution costs include premium wire services to reach sports and business media</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
