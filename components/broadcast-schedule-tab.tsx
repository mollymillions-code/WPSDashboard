"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditableField } from "@/components/editable-field"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, Radio, Tv, Video, Film, Monitor, Globe, Youtube, Instagram, Twitch } from "lucide-react"

export function BroadcastScheduleTab() {
  // Status options for content status
  const contentStatusOptions = [
    { value: "confirmed", label: "Confirmed", className: "bg-green-50 text-green-500 border-green-200" },
    { value: "tentative", label: "Tentative", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "in-production", label: "In Production", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "completed", label: "Completed", className: "bg-green-50 text-green-500 border-green-200" },
    { value: "live", label: "Live", className: "bg-sky-50 text-sky-500 border-sky-200" },
    { value: "scheduled", label: "Scheduled", className: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "published", label: "Published", className: "bg-green-50 text-green-500 border-green-200" },
    { value: "editing", label: "Editing", className: "bg-amber-50 text-amber-500 border-amber-200" },
  ]

  // Combined schedule data
  const [combinedSchedule, setCombinedSchedule] = useState([
    {
      id: "1",
      timeSlot: "18:00–18:05",
      wpsStream: "**Live** Pre-Show Countdown: sponsor bumpers, league logo sting",
      influencerStream: "—",
      adSlot: "—",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "2",
      timeSlot: "18:05–18:15",
      wpsStream: "**Live** Opening Montage: global squash highlights set to music (YouTube/Twitch main feed)",
      influencerStream: "**Live** Behind the Court: court install timelapse, host walkthrough (IG Live)",
      adSlot: "—",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "3",
      timeSlot: "18:15–18:35",
      wpsStream: "**Live** Exhibition Tie Part 1: mixed-gender pairs, real-time AR stats",
      influencerStream: "**Live** Pro Commentary: expert play-by-play, fan chat Q&A (TikTok Live)",
      adSlot: "**Slot 1 (18:33–18:35)** 2 min: 30s advertiser spot + overlay",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "4",
      timeSlot: "18:35–19:00",
      wpsStream: "**Live** Exhibition Tie Part 2: key rally focus, shot-speed overlay",
      influencerStream: "**Live** Tech Clinic: slow-mo breakdown & chat poll (YouTube Live)",
      adSlot: "—",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "5",
      timeSlot: "19:00–19:02",
      wpsStream: "—",
      influencerStream: "**Live Break** Influencer Ad Pad: 15s shoutout, 45s demo, 60s fan CTA",
      adSlot: "—",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "6",
      timeSlot: "19:02–19:40",
      wpsStream: "**Live** Exhibition Tie Part 3: final frames, cumulative score wrap-up",
      influencerStream: "**Live** Locker Room Live: athlete interviews, candid moments (IG Live)",
      adSlot: '**Slot 2 (19:18–19:20)** 2 min: 60s partner message + 60s "subscribe" CTA',
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "7",
      timeSlot: "19:40–19:45",
      wpsStream: "**Live** MVP Interview & Team Reveal: projection mapped logos, trophy close-up",
      influencerStream: "—",
      adSlot: "—",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "8",
      timeSlot: "19:45–19:55",
      wpsStream: "**Live** Fan Rally: two winners vs. junior pros, crowd mic",
      influencerStream: "**Live** Fan POV: user-generated clips, polls (TikTok)",
      adSlot: "**Slot 3 (19:53–19:55)** 2 min: 30s sponsor reel + 90s overlay",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "9",
      timeSlot: "19:55–20:00",
      wpsStream: "**Live** Closing Toast & Teaser: next-event trailer, season-pass QR",
      influencerStream: "—",
      adSlot: "—",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "10",
      timeSlot: "+1h Post-event",
      wpsStream: "**VOD** Full Match Recording: complete tie on-demand (YouTube/VOD library)",
      influencerStream: "**VOD** Top 5 Rally Highlights: 60s (TikTok, Reels)",
      adSlot: "—",
      status: "tentative",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "11",
      timeSlot: "+2h Post-event",
      wpsStream: "**VOD** Recap Show: 10 min edited highlights & analysis",
      influencerStream: "**VOD** Behind-the-Scenes Vlog: 10 min (YouTube)",
      adSlot: "—",
      status: "tentative",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "12",
      timeSlot: "Daily 18:00 ET",
      wpsStream: "**VOD** Daily Highlights: 15 min top moments (YouTube)",
      influencerStream: "**VOD** Quick Strike Recap: 1 min (Shorts)",
      adSlot: "—",
      status: "tentative",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "13",
      timeSlot: "Weekly Monday",
      wpsStream: "**VOD** Weekly Roundup: 15 min compilation & preview",
      influencerStream: "**VOD** Deep Dive Breakdown: 15 min",
      adSlot: "—",
      status: "tentative",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "14",
      timeSlot: "Weekly Wednesday",
      wpsStream: "**VOD** Next Event Teaser: 30 s (Social)",
      influencerStream: "**VOD** Athlete Spotlight Snippet: 60 s",
      adSlot: "—",
      status: "tentative",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
  ])

  // Ad inventory in influencer streams
  const [influencerAdInventory, setInfluencerAdInventory] = useState([
    {
      id: "inf-1",
      adType: "Pre-roll",
      placement: "Before livestream",
      format: "Video ad",
      duration: "15–30 s",
      notes: "Sponsor intro",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "inf-2",
      adType: "Mid-roll",
      placement: "Natural breaks",
      format: "Video + overlay",
      duration: "60–120 s",
      notes: "Demo, discount code, affiliate link",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "inf-3",
      adType: "Display Overlay",
      placement: "Throughout stream",
      format: "Static/banner",
      duration: "N/A",
      notes: "Sponsor logos, social CTA",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "inf-4",
      adType: "Chat Call-out",
      placement: "Chat breaks",
      format: "Text + graphic",
      duration: "N/A",
      notes: "Promo codes, links",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "inf-5",
      adType: "Verbal CTA",
      placement: "Segment transitions",
      format: "Verbal mention",
      duration: "15–30 s",
      notes: "Follow, subscribe, merch drop",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
  ])

  // Ad inventory in main WPS official stream
  const [wpsAdInventory, setWpsAdInventory] = useState([
    {
      id: "wps-1",
      adType: "Pre-roll",
      placement: "Before Pre-Show Countdown",
      format: "Video ad",
      duration: "30–60 s",
      notes: "Branding animation",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "wps-2",
      adType: "Mid-roll",
      placement: "Between tie segments",
      format: "Video + overlay",
      duration: "60–120 s",
      notes: "Split partner spots",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "wps-3",
      adType: "Display Overlay",
      placement: "During live segments",
      format: "Static/banner",
      duration: "N/A",
      notes: "Sponsor badges",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "wps-4",
      adType: "Sponsored Break",
      placement: "MVP & Team Reveal segments",
      format: "Branded segment",
      duration: "1–2 min",
      notes: "In-depth sponsor feature",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "wps-5",
      adType: "Flash CTA",
      placement: "End of match segments",
      format: "Verbal mention",
      duration: "10–20 s",
      notes: "Call-to-action",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
    {
      id: "wps-6",
      adType: "Title Slide Ads",
      placement: "Opening Montage",
      format: "Full-screen",
      duration: "5–10 s",
      notes: "Sponsor logo with league tagline",
      status: "confirmed",
      statusClass: "bg-green-50 text-green-500 border-green-200",
    },
  ])

  // Summary metrics
  const [summaryMetrics, setSummaryMetrics] = useState([
    {
      id: "metric-1",
      metric: "Official live content",
      perEvent: "100 min (~1.67 h)",
      season: "600 min (~10 h)",
    },
    {
      id: "metric-2",
      metric: "Influencer live content",
      perEvent: "70 min (~1.17 h)",
      season: "420 min (~7 h)",
    },
    {
      id: "metric-3",
      metric: "Total live content",
      perEvent: "170 min (~2.83 h)",
      season: "1,020 min (~17 h)",
    },
    {
      id: "metric-4",
      metric: "Official ad slots",
      perEvent: "6 min",
      season: "36 min",
    },
    {
      id: "metric-5",
      metric: "Influencer ad slots",
      perEvent: "6 min",
      season: "36 min",
    },
    {
      id: "metric-6",
      metric: "Total ad inventory",
      perEvent: "12 min",
      season: "72 min",
    },
  ])

  // New VOD Content data
  const [vodContent, setVodContent] = useState([
    {
      id: "vod-1",
      title: "Full Match Recording",
      description: "Complete exhibition tie with all segments",
      duration: "100 min",
      releaseDate: "May 20, 2025 (Event day)",
      platform: "YouTube, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-2",
      title: "Top 5 Rally Highlights",
      description: "Best moments from the exhibition match",
      duration: "3 min",
      releaseDate: "May 20, 2025 (Event day +1h)",
      platform: "Instagram, TikTok, YouTube Shorts",
      status: "in-production",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-3",
      title: "Recap Show",
      description: "Edited highlights with expert analysis",
      duration: "15 min",
      releaseDate: "May 20, 2025 (Event day +2h)",
      platform: "YouTube, WPS Website",
      status: "in-production",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-4",
      title: "Behind-the-Scenes Vlog",
      description: "Exclusive backstage footage and player interviews",
      duration: "10 min",
      releaseDate: "May 21, 2025 (Event day +1)",
      platform: "YouTube",
      status: "in-production",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-5",
      title: "Technical Breakdown",
      description: "Shot analysis and tactical insights",
      duration: "8 min",
      releaseDate: "May 22, 2025 (Event day +2)",
      platform: "YouTube, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-6",
      title: "Player Profiles",
      description: "Individual spotlight on featured athletes",
      duration: "5 min each (20 min total)",
      releaseDate: "Weekly after event",
      platform: "YouTube, Instagram",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-7",
      title: "Season Teaser",
      description: "Promotional video for upcoming season",
      duration: "2 min",
      releaseDate: "May 27, 2025 (Event day +7)",
      platform: "All platforms",
      status: "editing",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "vod-8",
      title: "Fan Reactions Compilation",
      description: "Crowd moments and social media reactions",
      duration: "4 min",
      releaseDate: "May 23, 2025 (Event day +3)",
      platform: "Instagram, TikTok",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
  ])

  // New Live Stream Content data
  const [liveStreamContent, setLiveStreamContent] = useState([
    {
      id: "live-1",
      title: "Pre-Show Countdown",
      description: "Event build-up with sponsor bumpers and league intro",
      scheduledTime: "May 20, 2025 18:00-18:05 ET",
      duration: "5 min",
      platform: "YouTube, Twitch, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-2",
      title: "Opening Montage",
      description: "Global squash highlights set to music",
      scheduledTime: "May 20, 2025 18:05-18:15 ET",
      duration: "10 min",
      platform: "YouTube, Twitch, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-3",
      title: "Exhibition Tie Part 1",
      description: "Mixed-gender pairs with real-time AR stats",
      scheduledTime: "May 20, 2025 18:15-18:35 ET",
      duration: "20 min",
      platform: "YouTube, Twitch, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-4",
      title: "Behind the Court",
      description: "Court installation timelapse and host walkthrough",
      scheduledTime: "May 20, 2025 18:05-18:15 ET",
      duration: "10 min",
      platform: "Instagram Live",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-5",
      title: "Pro Commentary",
      description: "Expert play-by-play with fan chat Q&A",
      scheduledTime: "May 20, 2025 18:15-18:35 ET",
      duration: "20 min",
      platform: "TikTok Live",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-6",
      title: "Exhibition Tie Part 2",
      description: "Key rally focus with shot-speed overlay",
      scheduledTime: "May 20, 2025 18:35-19:00 ET",
      duration: "25 min",
      platform: "YouTube, Twitch, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-7",
      title: "Tech Clinic",
      description: "Slow-motion breakdown and chat poll",
      scheduledTime: "May 20, 2025 18:35-19:00 ET",
      duration: "25 min",
      platform: "YouTube Live",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
    {
      id: "live-8",
      title: "Exhibition Tie Part 3",
      description: "Final frames and cumulative score wrap-up",
      scheduledTime: "May 20, 2025 19:02-19:40 ET",
      duration: "38 min",
      platform: "YouTube, Twitch, WPS Website",
      status: "scheduled",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
    },
  ])

  const updateCombinedScheduleItem = (id, field, value) => {
    setCombinedSchedule(
      combinedSchedule.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = contentStatusOptions.find((option) => option.value === value)
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

  const updateInfluencerAdItem = (id, field, value) => {
    setInfluencerAdInventory(
      influencerAdInventory.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = contentStatusOptions.find((option) => option.value === value)
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

  const updateWpsAdItem = (id, field, value) => {
    setWpsAdInventory(
      wpsAdInventory.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = contentStatusOptions.find((option) => option.value === value)
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

  const updateSummaryMetric = (id, field, value) => {
    setSummaryMetrics(
      summaryMetrics.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const updateVodContent = (id, field, value) => {
    setVodContent(
      vodContent.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = contentStatusOptions.find((option) => option.value === value)
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

  const updateLiveStreamContent = (id, field, value) => {
    setLiveStreamContent(
      liveStreamContent.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Update statusClass based on status if status is being updated
          if (field === "status") {
            const selectedStatus = contentStatusOptions.find((option) => option.value === value)
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
      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="schedule">Broadcast Schedule</TabsTrigger>
          <TabsTrigger value="live-stream">Live Stream Content</TabsTrigger>
          <TabsTrigger value="vod">VOD Content</TabsTrigger>
          <TabsTrigger value="wps-ads">WPS Ad Inventory</TabsTrigger>
          <TabsTrigger value="influencer-ads">Influencer Ad Inventory</TabsTrigger>
          <TabsTrigger value="metrics">Summary Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Combined Content Plan by Time with Ad Slots</CardTitle>
              <CardDescription>Detailed broadcast schedule for the event (all times ET)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Time (ET)</TableHead>
                    <TableHead>WPS Official Stream (Live/VOD)</TableHead>
                    <TableHead>Influencer Stream (Live/VOD)</TableHead>
                    <TableHead>Ad Slot</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedSchedule.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <EditableField
                          value={item.timeSlot}
                          onSave={(value) => updateCombinedScheduleItem(item.id, "timeSlot", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.wpsStream}
                          onSave={(value) => updateCombinedScheduleItem(item.id, "wpsStream", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.influencerStream}
                          onSave={(value) => updateCombinedScheduleItem(item.id, "influencerStream", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.adSlot}
                          onSave={(value) => updateCombinedScheduleItem(item.id, "adSlot", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.status}
                          onSave={(value) => updateCombinedScheduleItem(item.id, "status", value)}
                          type="status"
                          statusOptions={contentStatusOptions}
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
                <CardTitle>Live Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>WPS Official Stream</span>
                      <span>100 min</span>
                    </div>
                    <Progress value={59} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Influencer Stream</span>
                      <span>70 min</span>
                    </div>
                    <Progress value={41} className="h-2 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Broadcast Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Pre-Show Countdown</p>
                      <p className="text-sm text-muted-foreground">18:00–18:05 ET</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Play className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Exhibition Tie</p>
                      <p className="text-sm text-muted-foreground">18:15–19:40 ET (with breaks)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tv className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Team Reveal</p>
                      <p className="text-sm text-muted-foreground">19:40–19:45 ET</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Radio className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Closing & Teaser</p>
                      <p className="text-sm text-muted-foreground">19:55–20:00 ET</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="live-stream">
          <Card>
            <CardHeader>
              <CardTitle>Live Stream Content</CardTitle>
              <CardDescription>Detailed information about planned live streams</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveStreamContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <EditableField
                          value={item.title}
                          onSave={(value) => updateLiveStreamContent(item.id, "title", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.description}
                          onSave={(value) => updateLiveStreamContent(item.id, "description", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.scheduledTime}
                          onSave={(value) => updateLiveStreamContent(item.id, "scheduledTime", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.duration}
                          onSave={(value) => updateLiveStreamContent(item.id, "duration", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.platform}
                          onSave={(value) => updateLiveStreamContent(item.id, "platform", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.status}
                          onSave={(value) => updateLiveStreamContent(item.id, "status", value)}
                          type="status"
                          statusOptions={contentStatusOptions}
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
                <CardTitle>Live Stream Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Youtube className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">YouTube</p>
                      <p className="text-sm text-muted-foreground">Primary platform for main event stream</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Twitch className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Twitch</p>
                      <p className="text-sm text-muted-foreground">Secondary platform with interactive chat</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Instagram className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Instagram Live</p>
                      <p className="text-sm text-muted-foreground">Behind-the-scenes and influencer content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">WPS Website</p>
                      <p className="text-sm text-muted-foreground">Embedded stream with additional features</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Stream Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Live Duration</div>
                    <div className="text-2xl font-bold">170 min</div>
                    <div className="text-xs text-muted-foreground">Across all platforms</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Concurrent Streams</div>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-xs text-muted-foreground">Maximum at peak time</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Main Stream Duration</div>
                    <div className="text-2xl font-bold">100 min</div>
                    <div className="text-xs text-muted-foreground">WPS official stream</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Influencer Stream Duration</div>
                    <div className="text-2xl font-bold">70 min</div>
                    <div className="text-xs text-muted-foreground">Combined across platforms</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vod">
          <Card>
            <CardHeader>
              <CardTitle>VOD Content</CardTitle>
              <CardDescription>Detailed information about planned video-on-demand content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vodContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <EditableField
                          value={item.title}
                          onSave={(value) => updateVodContent(item.id, "title", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.description}
                          onSave={(value) => updateVodContent(item.id, "description", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.duration}
                          onSave={(value) => updateVodContent(item.id, "duration", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.releaseDate}
                          onSave={(value) => updateVodContent(item.id, "releaseDate", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.platform}
                          onSave={(value) => updateVodContent(item.id, "platform", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.status}
                          onSave={(value) => updateVodContent(item.id, "status", value)}
                          type="status"
                          statusOptions={contentStatusOptions}
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
                <CardTitle>VOD Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Film className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Full-Length Content</p>
                      <p className="text-sm text-muted-foreground">Complete match recordings and extended features</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Video className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Highlight Packages</p>
                      <p className="text-sm text-muted-foreground">Condensed best moments and key plays</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Monitor className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Technical Analysis</p>
                      <p className="text-sm text-muted-foreground">Detailed breakdowns and expert commentary</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Play className="mt-0.5 h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-medium">Short-Form Content</p>
                      <p className="text-sm text-muted-foreground">Quick clips optimized for social platforms</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VOD Release Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Event Day (May 20)</span>
                      <span>2 releases</span>
                    </div>
                    <Progress value={25} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Event Day +1 (May 21)</span>
                      <span>1 release</span>
                    </div>
                    <Progress value={12.5} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Event Day +2 (May 22)</span>
                      <span>1 release</span>
                    </div>
                    <Progress value={12.5} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Event Day +3 (May 23)</span>
                      <span>1 release</span>
                    </div>
                    <Progress value={12.5} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Event Day +7 (May 27)</span>
                      <span>1 release</span>
                    </div>
                    <Progress value={12.5} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Weekly after event</span>
                      <span>2 releases</span>
                    </div>
                    <Progress value={25} className="h-2 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wps-ads">
          <Card>
            <CardHeader>
              <CardTitle>Ad Inventory in Main WPS Official Stream</CardTitle>
              <CardDescription>Available advertising opportunities in the official broadcast</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Ad Type</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wpsAdInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.adType}</TableCell>
                      <TableCell>
                        <EditableField
                          value={item.placement}
                          onSave={(value) => updateWpsAdItem(item.id, "placement", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.format}
                          onSave={(value) => updateWpsAdItem(item.id, "format", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.duration}
                          onSave={(value) => updateWpsAdItem(item.id, "duration", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.notes}
                          onSave={(value) => updateWpsAdItem(item.id, "notes", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.status}
                          onSave={(value) => updateWpsAdItem(item.id, "status", value)}
                          type="status"
                          statusOptions={contentStatusOptions}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influencer-ads">
          <Card>
            <CardHeader>
              <CardTitle>Ad Inventory in Influencer Streams</CardTitle>
              <CardDescription>Available advertising opportunities in influencer content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Ad Type</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencerAdInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.adType}</TableCell>
                      <TableCell>
                        <EditableField
                          value={item.placement}
                          onSave={(value) => updateInfluencerAdItem(item.id, "placement", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.format}
                          onSave={(value) => updateInfluencerAdItem(item.id, "format", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.duration}
                          onSave={(value) => updateInfluencerAdItem(item.id, "duration", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.notes}
                          onSave={(value) => updateInfluencerAdItem(item.id, "notes", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.status}
                          onSave={(value) => updateInfluencerAdItem(item.id, "status", value)}
                          type="status"
                          statusOptions={contentStatusOptions}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Content & Ad Slot Totals</CardTitle>
              <CardDescription>Summary metrics for content and advertising</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Metric</TableHead>
                    <TableHead>Per Event</TableHead>
                    <TableHead>Season (6 events)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryMetrics.map((item) => (
                    <TableRow
                      key={item.id}
                      className={item.id === "metric-3" || item.id === "metric-6" ? "font-bold" : ""}
                    >
                      <TableCell>{item.metric}</TableCell>
                      <TableCell>
                        <EditableField
                          value={item.perEvent}
                          onSave={(value) => updateSummaryMetric(item.id, "perEvent", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableField
                          value={item.season}
                          onSave={(value) => updateSummaryMetric(item.id, "season", value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-4 text-sm text-muted-foreground">
                Each event delivers ~2.8 hours of combined live coverage and ~12 minutes of ad inventory, totaling ~17
                hours of live content and ~72 minutes of ad space across the season.
              </p>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Official Live Content (per event)</span>
                      <span>100 min</span>
                    </div>
                    <Progress value={59} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Influencer Live Content (per event)</span>
                      <span>70 min</span>
                    </div>
                    <Progress value={41} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Official Ad Slots (per event)</span>
                      <span>6 min</span>
                    </div>
                    <Progress value={50} className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Influencer Ad Slots (per event)</span>
                      <span>6 min</span>
                    </div>
                    <Progress value={50} className="h-2 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Broadcast Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Live Content</div>
                    <div className="text-2xl font-bold">170 min</div>
                    <div className="text-xs text-muted-foreground">Per event (~2.83 hours)</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Ad Inventory</div>
                    <div className="text-2xl font-bold">12 min</div>
                    <div className="text-xs text-muted-foreground">Per event</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Season Content</div>
                    <div className="text-2xl font-bold">1,020 min</div>
                    <div className="text-xs text-muted-foreground">Across 6 events (~17 hours)</div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Season Ad Inventory</div>
                    <div className="text-2xl font-bold">72 min</div>
                    <div className="text-xs text-muted-foreground">Across 6 events</div>
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
