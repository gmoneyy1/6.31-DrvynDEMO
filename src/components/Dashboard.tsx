import { useState, useEffect } from "react";
import { Search, Calendar, Mic, Bell, Clock, ArrowUpRight, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIChat } from "@/hooks/useAIChat";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { sendMessage, isLoading, messages } = useAIChat();
  const { user, isLoading: authLoading } = useAuth();
  const { backendEvents, isLoading: eventsLoading, loadEvents } = useSchedule();

  // Load events when user is authenticated
  useEffect(() => {
    if (user && !authLoading && user.username !== 'User') {
      console.log('Dashboard: User authenticated, loading events...');
      loadEvents();
    }
  }, [user, authLoading, loadEvents]);

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Drvyn</h2>
          <p className="text-muted-foreground mb-6">
            Your AI-powered productivity assistant. Please log in to start scheduling tasks and managing your calendar.
          </p>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">Try these examples:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Schedule a meeting tomorrow at 2pm"</li>
                <li>• "Add a 1-hour study session this afternoon"</li>
                <li>• "Create a 30-minute workout session later today"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() && !isLoading) {
      await sendMessage(searchQuery);
      setSearchQuery("");
    }
  };

  const handleSendClick = async () => {
    if (searchQuery.trim() && !isLoading) {
      await sendMessage(searchQuery);
      setSearchQuery("");
    }
  };

  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const now = new Date();
    if (!backendEvents || !Array.isArray(backendEvents)) {
      return [];
    }
    return backendEvents
      .filter(event => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 3);
  };

  const upcomingEvents = getUpcomingEvents();

  // Get today's events count
  const getTodayEventsCount = () => {
    if (!backendEvents || !Array.isArray(backendEvents)) {
      return 0;
    }
    const today = new Date();
    return backendEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === today.toDateString();
    }).length;
  };

  const todayEventsCount = getTodayEventsCount();

  return (
    <div className="flex-1 min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">
            {getGreeting()}, {user?.username || 'User'}
          </h2>
        </div>
        <Button variant="outline" size="sm">
          Get Plus
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </header>

      {/* Main Content - ChatGPT Style */}
      <main className="flex flex-col h-[calc(100vh-80px)]">
        {/* Centered Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
          <div className="w-full max-w-3xl space-y-8">
            {/* Greeting */}
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-foreground">
                {getGreeting()}, {user?.username || 'User'}
              </h1>
              <p className="text-muted-foreground mt-2">
                Ask me to schedule tasks, meetings, or anything else you need help with.
              </p>
            </div>
            
            {/* Chat Messages */}
            {messages.length > 0 && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Main Input Area */}
            <div className="relative">
              <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <Input
                  placeholder="Ask anything about your schedule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSendMessage}
                  disabled={isLoading}
                  className="h-16 text-lg border-0 bg-transparent px-6 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                />
                <div className="flex items-center space-x-2 pr-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full"
                    onClick={handleSendClick}
                    disabled={isLoading || !searchQuery.trim()}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full">
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Example buttons */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchQuery("Schedule a meeting tomorrow at 2pm")}
                  className="text-xs"
                >
                  Meeting tomorrow
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchQuery("Add a 1-hour study session this afternoon")}
                  className="text-xs"
                >
                  Study session
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchQuery("Create a 30-minute workout session later today")}
                  className="text-xs"
                >
                  Workout today
                </Button>
              </div>
            </div>

            {/* Feature Cards - More compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Today's Tasks */}
              <Card className="bg-card/50 border-border hover:bg-card/70 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Today's Events</h3>
                      <p className="text-xs text-muted-foreground">
                        {todayEventsCount} events today
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="bg-card/50 border-border hover:bg-card/70 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Next Event</h3>
                      <p className="text-xs text-muted-foreground">
                        {upcomingEvents.length > 0 
                          ? upcomingEvents[0].title 
                          : 'No upcoming events'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer with examples */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => setSearchQuery("I have a presentation next Monday")}
              >
                "I have a presentation next Monday"
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => setSearchQuery("Schedule 2 hours for project work")}
              >
                "Schedule 2 hours for project work"
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => setSearchQuery("Block time for studying this week")}
              >
                "Block time for studying this week"
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}