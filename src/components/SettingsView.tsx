import { useState } from "react";
import { Shield, Clock, Globe, Bell, User, Palette, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistratingSite {
  id: string;
  name: string;
  url: string;
  category: string;
  blocked: boolean;
  timeLimit?: number;
}

const DISTRACTING_SITES: DistratingSite[] = [
  { id: "1", name: "Facebook", url: "facebook.com", category: "Social Media", blocked: true },
  { id: "2", name: "Instagram", url: "instagram.com", category: "Social Media", blocked: true },
  { id: "3", name: "Twitter/X", url: "twitter.com", category: "Social Media", blocked: false },
  { id: "4", name: "YouTube", url: "youtube.com", category: "Entertainment", blocked: false, timeLimit: 30 },
  { id: "5", name: "TikTok", url: "tiktok.com", category: "Entertainment", blocked: true },
  { id: "6", name: "Reddit", url: "reddit.com", category: "Social Media", blocked: false, timeLimit: 15 },
  { id: "7", name: "Netflix", url: "netflix.com", category: "Entertainment", blocked: true },
  { id: "8", name: "Amazon", url: "amazon.com", category: "Shopping", blocked: false },
  { id: "9", name: "CNN", url: "cnn.com", category: "News", blocked: false, timeLimit: 20 },
  { id: "10", name: "Twitch", url: "twitch.tv", category: "Entertainment", blocked: false },
];

const PROTECTION_LEVELS = [
  { value: 0, label: "Off", description: "No blocking or restrictions" },
  { value: 25, label: "Gentle", description: "Soft reminders and suggestions" },
  { value: 50, label: "Balanced", description: "Moderate blocking with breaks" },
  { value: 75, label: "Focused", description: "Strong blocking during work hours" },
  { value: 100, label: "Aggressive", description: "Maximum protection and blocking" },
];

export function SettingsView() {
  const [protectionLevel, setProtectionLevel] = useState([50]);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakReminders, setBreakReminders] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [sites, setSites] = useState<DistratingSite[]>(DISTRACTING_SITES);

  const currentLevel = PROTECTION_LEVELS.find(level => 
    Math.abs(level.value - protectionLevel[0]) <= 12.5
  ) || PROTECTION_LEVELS[2];

  const handleSiteToggle = (siteId: string) => {
    setSites(sites.map(site => 
      site.id === siteId ? { ...site, blocked: !site.blocked } : site
    ));
  };

  const groupedSites = sites.reduce((acc, site) => {
    if (!acc[site.category]) {
      acc[site.category] = [];
    }
    acc[site.category].push(site);
    return acc;
  }, {} as Record<string, DistratingSite[]>);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            Last saved: 2 min ago
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="protection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit">
              <TabsTrigger value="protection" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Protection</span>
              </TabsTrigger>
              <TabsTrigger value="sites" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Sites</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
            </TabsList>

            {/* Protection Tab */}
            <TabsContent value="protection" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Productivity Protection Level</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{currentLevel.label}</h3>
                        <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
                      </div>
                      <Badge 
                        variant={protectionLevel[0] > 50 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {protectionLevel[0]}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Slider
                        value={protectionLevel}
                        onValueChange={setProtectionLevel}
                        max={100}
                        step={25}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Off</span>
                        <span>Gentle</span>
                        <span>Balanced</span>
                        <span>Focused</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="focus-mode">Focus Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Block all distractions during active work sessions
                        </p>
                      </div>
                      <Switch
                        id="focus-mode"
                        checked={focusMode}
                        onCheckedChange={setFocusMode}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="break-reminders">Break Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified to take regular breaks
                        </p>
                      </div>
                      <Switch
                        id="break-reminders"
                        checked={breakReminders}
                        onCheckedChange={setBreakReminders}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sites Tab */}
            <TabsContent value="sites" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Distracting Sites</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(groupedSites).map(([category, categorySites]) => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {categorySites.map((site) => (
                            <div
                              key={site.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {site.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{site.name}</p>
                                  <p className="text-xs text-muted-foreground">{site.url}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                {site.timeLimit && (
                                  <Badge variant="outline" className="text-xs">
                                    {site.timeLimit}min/day
                                  </Badge>
                                )}
                                <Switch
                                  checked={site.blocked}
                                  onCheckedChange={() => handleSiteToggle(site.id)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Quiet Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically enable focus mode during set hours
                      </p>
                    </div>
                    <Switch
                      id="quiet-hours"
                      checked={quietHoursEnabled}
                      onCheckedChange={setQuietHoursEnabled}
                    />
                  </div>

                  {quietHoursEnabled && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Start Time</Label>
                          <Select value={startTime} onValueChange={setStartTime}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={`${String(i).padStart(2, '0')}:00`}>
                                  {`${String(i).padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end-time">End Time</Label>
                          <Select value={endTime} onValueChange={setEndTime}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={`${String(i).padStart(2, '0')}:00`}>
                                  {`${String(i).padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Focus mode will be automatically enabled from {startTime} to {endTime}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Break Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Break Frequency</Label>
                      <Select defaultValue="25">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="25">Every 25 minutes (Pomodoro)</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="45">Every 45 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Break Duration</Label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="20">20 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Account & Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Data & Privacy</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Analytics & Usage Data</Label>
                          <p className="text-sm text-muted-foreground">
                            Help improve Drvyn by sharing anonymous usage data
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Crash Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically send crash reports to help fix issues
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span>Support & About</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help Center
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Globe className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Drvyn v2.1.0</p>
                    <p>© 2024 Drvyn AI. All rights reserved.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="sticky bottom-6 flex justify-end">
            <Button className="shadow-lg">
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}