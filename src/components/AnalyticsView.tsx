import { useState } from "react";
import { TrendingUp, Target, Flame, Clock, Eye, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock data for analytics
const focusData = {
  daily: [
    { day: "Mon", focused: 6.5, distracted: 1.5 },
    { day: "Tue", focused: 7.2, distracted: 0.8 },
    { day: "Wed", focused: 5.8, distracted: 2.2 },
    { day: "Thu", focused: 8.1, distracted: 0.9 },
    { day: "Fri", focused: 6.9, distracted: 1.1 },
    { day: "Sat", focused: 4.2, distracted: 0.8 },
    { day: "Sun", focused: 3.5, distracted: 0.5 },
  ],
  weekly: [
    { week: "Week 1", focused: 42.5, distracted: 7.5 },
    { week: "Week 2", focused: 45.2, distracted: 6.8 },
    { week: "Week 3", focused: 38.9, distracted: 9.1 },
    { week: "Week 4", focused: 47.3, distracted: 5.7 },
  ],
};

const pieData = [
  { name: "Focused Time", value: 78, color: "hsl(var(--primary))" },
  { name: "Distracted Time", value: 22, color: "hsl(var(--muted))" },
];

const distractionSites = [
  { site: "Social Media", minutes: 145, visits: 23, color: "hsl(var(--destructive))" },
  { site: "News Websites", minutes: 89, visits: 12, color: "hsl(var(--category-break))" },
  { site: "YouTube", minutes: 76, visits: 8, color: "hsl(var(--category-personal))" },
  { site: "Shopping", minutes: 54, visits: 6, color: "hsl(var(--category-meeting))" },
  { site: "Entertainment", minutes: 43, visits: 5, color: "hsl(var(--primary-glow))" },
];

const streakData = {
  current: 12,
  longest: 28,
  thisWeek: 5,
  thisMonth: 23,
};

export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly">("daily");

  const currentData = focusData[timeRange];
  const avgFocused = currentData.reduce((acc, item) => acc + item.focused, 0) / currentData.length;
  const avgDistracted = currentData.reduce((acc, item) => acc + item.distracted, 0) / currentData.length;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Productivity Analytics
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-card to-primary/5 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold text-primary">{streakData.current}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                  <Flame className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-category-focus/10 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Focus Time Today</p>
                    <p className="text-2xl font-bold text-category-focus">6.8h</p>
                    <p className="text-xs text-muted-foreground">+12% vs yesterday</p>
                  </div>
                  <Target className="h-8 w-8 text-category-focus" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-category-work/10 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Productivity Score</p>
                    <p className="text-2xl font-bold text-category-work">92%</p>
                    <p className="text-xs text-muted-foreground">Excellent</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-category-work" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-destructive/10 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Distractions</p>
                    <p className="text-2xl font-bold text-destructive">8</p>
                    <p className="text-xs text-muted-foreground">-3 vs yesterday</p>
                  </div>
                  <Eye className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Focus vs Distraction Pie Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="text-sm font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Focus Trends */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    Focus Trends
                  </CardTitle>
                  <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as "daily" | "weekly")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey={timeRange === "daily" ? "day" : "week"} 
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="focused"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        name="Focused Hours"
                      />
                      <Line
                        type="monotone"
                        dataKey="distracted"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 3 }}
                        name="Distracted Hours"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distraction Leaderboard */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-destructive" />
                  Top Distractions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distractionSites.map((site, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card border">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{site.site}</p>
                          <p className="text-xs text-muted-foreground">{site.visits} visits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{site.minutes}m</p>
                        <div className="w-20 h-2 bg-muted rounded-full mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: site.color,
                              width: `${(site.minutes / Math.max(...distractionSites.map(s => s.minutes))) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Streak Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Flame className="mr-2 h-5 w-5 text-primary" />
                  Streak Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{streakData.current}</div>
                    <p className="text-muted-foreground">Current Streak</p>
                    <Badge variant="secondary" className="mt-2">
                      🔥 On Fire!
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-semibold text-foreground">{streakData.longest}</div>
                      <p className="text-xs text-muted-foreground">Longest Streak</p>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-foreground">{streakData.thisWeek}</div>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-foreground">{streakData.thisMonth}</div>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Weekly Goal</span>
                      <span className="text-sm font-medium">5/7 days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(5/7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}