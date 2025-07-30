import { useState, useEffect, useMemo, useCallback } from "react";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, ChevronRight, Edit3, MoreVertical, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  category: string;
  color: string;
}

const CATEGORIES = {
  work: { label: "Work", color: "bg-category-work" },
  meeting: { label: "Meeting", color: "bg-category-meeting" },
  personal: { label: "Personal", color: "bg-category-personal" },
  break: { label: "Break", color: "bg-category-break" },
  focus: { label: "Focus Time", color: "bg-category-focus" },
};

const MOCK_BLOCKS: TimeBlock[] = [
  {
    id: "1",
    title: "Deep Work - Code Review",
    startTime: "09:00",
    endTime: "10:30",
    duration: "1h 30m",
    category: "focus",
    color: CATEGORIES.focus.color,
  },
  {
    id: "2",
    title: "Team Standup",
    startTime: "10:30",
    endTime: "11:00",
    duration: "30m",
    category: "meeting",
    color: CATEGORIES.meeting.color,
  },
  {
    id: "3",
    title: "Project Planning",
    startTime: "11:15",
    endTime: "12:45",
    duration: "1h 30m",
    category: "work",
    color: CATEGORIES.work.color,
  },
  {
    id: "4",
    title: "Lunch Break",
    startTime: "12:45",
    endTime: "13:45",
    duration: "1h",
    category: "break",
    color: CATEGORIES.break.color,
  },
  {
    id: "5",
    title: "Client Presentation",
    startTime: "14:00",
    endTime: "15:30",
    duration: "1h 30m",
    category: "meeting",
    color: CATEGORIES.meeting.color,
  },
  {
    id: "6",
    title: "Email & Admin",
    startTime: "15:45",
    endTime: "16:30",
    duration: "45m",
    category: "work",
    color: CATEGORIES.work.color,
  },
];

type ViewMode = "day" | "week" | "month";

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { backendEvents, loadEvents, deleteEvent, updateEvent } = useSchedule();
  const { user, isAuthenticated } = useAuth();

  // Load events when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadEvents();
    }
  }, [loadEvents, isAuthenticated, user]);

  // Convert backend events to time blocks for the current date using useMemo
  const timeBlocksForDate = useMemo(() => {
    const todayString = selectedDate.toISOString().split('T')[0];
    
    // Convert backend events to time blocks
    return backendEvents
      .filter(event => {
        const eventDate = new Date(event.start).toISOString().split('T')[0];
        return eventDate === todayString;
      })
      .map(event => {
        const startTime = new Date(event.start).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        const endTime = new Date(event.end).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        const start = new Date(event.start);
        const end = new Date(event.end);
        const durationMs = end.getTime() - start.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const duration = `${hours}h ${minutes}m`;
        
        return {
          id: event.id.toString(),
          title: event.title,
          startTime,
          endTime,
          duration,
          category: 'work',
          color: CATEGORIES.work.color,
        };
      });
  }, [selectedDate, backendEvents]);

  // Update timeBlocks state only when the computed value changes
  useEffect(() => {
    setTimeBlocks(timeBlocksForDate);
  }, [timeBlocksForDate]);

  const formatDate = (date: Date) => {
    if (viewMode === "day") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (viewMode === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  };

  const navigateDate = useCallback((direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  }, [selectedDate, viewMode]);

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const getMonthDays = () => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const handleBlockClick = useCallback((block: TimeBlock) => {
    setEditingBlock(block);
    setIsDialogOpen(true);
  }, []);

  const handleSaveBlock = useCallback(async (updatedBlock: TimeBlock) => {
    try {
      setIsSaving(true);
      
      // Extract the numeric ID from the block.id string
      const eventId = parseInt(updatedBlock.id);
      if (isNaN(eventId)) {
        console.error('Invalid event ID:', updatedBlock.id);
        return;
      }

      // Convert time strings to ISO format for the backend
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      const startDateTime = `${selectedDateString}T${updatedBlock.startTime}:00`;
      const endDateTime = `${selectedDateString}T${updatedBlock.endTime}:00`;

      // Call the update function from ScheduleContext
      await updateEvent(eventId, updatedBlock.title, startDateTime, endDateTime);

      // Update local state
      setTimeBlocks(blocks =>
        blocks.map(block =>
          block.id === updatedBlock.id ? updatedBlock : block
        )
      );
      
      setIsDialogOpen(false);
      setEditingBlock(null);
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setIsSaving(false);
    }
  }, [selectedDate]);

  const handleDeleteBlock = useCallback(async (block: TimeBlock) => {
    try {
      // Extract the numeric ID from the block.id string
      const eventId = parseInt(block.id);
      if (isNaN(eventId)) {
        console.error('Invalid event ID:', block.id);
        return;
      }
      
      // Call the delete function from ScheduleContext
      await deleteEvent(eventId);
      
      // Remove from local state
      setTimeBlocks(blocks => blocks.filter(b => b.id !== block.id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, []);

  const getBlockHeight = (startTime: string, endTime: string) => {
    // Calculate actual duration from start and end times
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    // Handle cases where end time is before start time (next day)
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    return Math.max(60, minutes * 1.2); // Base height of 60px, scaled by duration
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate("prev")}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h1 className="text-xl font-semibold text-foreground">
            {formatDate(selectedDate)}
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate("next")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {(["day", "week", "month"] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="h-8 px-3 text-xs capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Calendar Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {viewMode === "day" && (
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Time Labels */}
                  <div className="absolute left-0 top-0 w-20 h-full">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="h-20 flex items-start justify-end pr-2 pt-1 text-xs text-muted-foreground border-b border-border/50"
                      >
                        {String(i).padStart(2, "0")}:00
                      </div>
                    ))}
                  </div>

                  {/* Time Blocks */}
                  <div className="ml-20 relative min-h-[1920px]">
                    {/* Hour Grid Lines */}
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-full border-b border-border/30"
                        style={{ top: `${i * 80}px` }}
                      />
                    ))}

                    {/* Time Blocks */}
                    {timeBlocks.map((block, index) => {
                      const startHour = parseInt(block.startTime.split(":")[0]);
                      const startMinute = parseInt(block.startTime.split(":")[1]);
                      const topPosition = startHour * 80 + (startMinute / 60) * 80;
                      
                      return (
                        <div
                          key={block.id}
                          className={`absolute left-2 right-2 rounded-lg p-3 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${block.color} text-white overflow-hidden group`}
                          style={{
                            top: `${topPosition}px`,
                            height: `${getBlockHeight(block.startTime, block.endTime)}px`,
                          }}
                        >
                          <div className="flex items-start justify-between h-full">
                            <div 
                              className="flex-1 min-w-0 flex flex-col justify-between cursor-pointer"
                              onClick={() => handleBlockClick(block)}
                            >
                              <div>
                                <h3 className="font-medium text-sm leading-tight truncate mb-1">
                                  {block.title}
                                </h3>
                                <p className="text-xs opacity-90">
                                  {block.startTime} - {block.endTime}
                                </p>
                              </div>
                              <p className="text-xs opacity-75 mt-auto">
                                {block.duration} • {CATEGORIES[block.category as keyof typeof CATEGORIES]?.label}
                              </p>
                            </div>
                            <div className="flex items-start space-x-1 ml-2">
                              <Edit3 
                                className="h-3 w-3 opacity-70 flex-shrink-0 mt-0.5 cursor-pointer hover:opacity-100" 
                                onClick={() => handleBlockClick(block)}
                              />
                              <X 
                                className="h-3 w-3 opacity-70 flex-shrink-0 mt-0.5 cursor-pointer hover:opacity-100 hover:text-red-200" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBlock(block);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "week" && (
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="grid grid-cols-8 border-b border-border">
                  <div className="w-20"></div>
                  {getWeekDays().map((day, index) => (
                    <div key={index} className="p-4 text-center border-r border-border/50 last:border-r-0">
                      <div className="text-xs text-muted-foreground uppercase">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className={`text-lg font-medium ${
                        day.toDateString() === new Date().toDateString() 
                          ? "text-primary" 
                          : "text-foreground"
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="relative">
                  {/* Time Labels */}
                  <div className="absolute left-0 top-0 w-20 h-full">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="h-16 flex items-start justify-end pr-2 pt-1 text-xs text-muted-foreground border-b border-border/50"
                      >
                        {String(i).padStart(2, "0")}:00
                      </div>
                    ))}
                  </div>

                  {/* Week Grid */}
                  <div className="ml-20 grid grid-cols-7 min-h-[1536px]">
                    {getWeekDays().map((day, dayIndex) => (
                      <div key={dayIndex} className="relative border-r border-border/50 last:border-r-0">
                        {/* Hour lines for each day */}
                        {Array.from({ length: 24 }, (_, i) => (
                          <div
                            key={i}
                            className="absolute w-full border-b border-border/30"
                            style={{ top: `${i * 64}px` }}
                          />
                        ))}
                        
                        {/* Sample events for today only */}
                        {day.toDateString() === selectedDate.toDateString() && 
                          timeBlocks.slice(0, 2).map((block, blockIndex) => {
                            const startHour = parseInt(block.startTime.split(":")[0]);
                            const startMinute = parseInt(block.startTime.split(":")[1]);
                            const topPosition = startHour * 64 + (startMinute / 60) * 64;
                            
                            return (
                              <div
                                key={block.id}
                                className={`absolute left-1 right-1 rounded p-2 ${block.color} text-white text-xs overflow-hidden group`}
                                style={{
                                  top: `${topPosition}px`,
                                  height: `${Math.max(50, getBlockHeight(block.startTime, block.endTime) * 0.6)}px`,
                                }}
                              >
                                <div className="flex flex-col h-full justify-between">
                                  <div 
                                    className="truncate font-medium leading-tight cursor-pointer"
                                    onClick={() => handleBlockClick(block)}
                                  >
                                    {block.title}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div 
                                      className="opacity-90 text-xs leading-tight cursor-pointer"
                                      onClick={() => handleBlockClick(block)}
                                    >
                                      {block.startTime}
                                    </div>
                                    <X 
                                      className="h-2 w-2 opacity-70 cursor-pointer hover:opacity-100 hover:text-red-200 ml-1" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteBlock(block);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "month" && (
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                {/* Month Header */}
                <div className="grid grid-cols-7 border-b border-border">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-4 text-center font-medium text-muted-foreground border-r border-border/50 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Month Grid */}
                <div className="grid grid-cols-7">
                  {getMonthDays().map((day, index) => {
                    const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border-r border-b border-border/50 last:border-r-0 cursor-pointer hover:bg-muted/50 ${
                          !isCurrentMonth ? "text-muted-foreground bg-muted/20" : ""
                        }`}
                        onClick={() => setSelectedDate(new Date(day))}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center" :
                          isSelected ? "text-primary" : ""
                        }`}>
                          {day.getDate()}
                        </div>
                        
                        {/* Sample events for current date */}
                        {day.toDateString() === selectedDate.toDateString() && (
                          <div className="space-y-1">
                            {timeBlocks.slice(0, 3).map((block, blockIndex) => (
                              <div
                                key={block.id}
                                className={`text-xs p-1 rounded truncate ${block.color} text-white cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBlockClick(block);
                                }}
                              >
                                {block.title}
                              </div>
                            ))}
                            {timeBlocks.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{timeBlocks.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Time Block</DialogTitle>
          </DialogHeader>
          
          {editingBlock && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Name</Label>
                <Input
                  id="title"
                  value={editingBlock.title}
                  onChange={(e) =>
                    setEditingBlock({ ...editingBlock, title: e.target.value })
                  }
                  placeholder="Enter task name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editingBlock.startTime}
                    onChange={(e) =>
                      setEditingBlock({ ...editingBlock, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={editingBlock.endTime}
                    onChange={(e) =>
                      setEditingBlock({ ...editingBlock, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingBlock.category}
                  onValueChange={(value) =>
                    setEditingBlock({
                      ...editingBlock,
                      category: value,
                      color: CATEGORIES[value as keyof typeof CATEGORIES]?.color || CATEGORIES.work.color,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSaveBlock(editingBlock)}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}