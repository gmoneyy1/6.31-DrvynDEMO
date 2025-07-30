import { useState, useCallback } from 'react';

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  category: string;
  color: string;
  date: string;
}

const CATEGORIES = {
  work: { label: "Work", color: "bg-category-work" },
  study: { label: "Study", color: "bg-category-focus" },
  meeting: { label: "Meeting", color: "bg-category-meeting" },
  personal: { label: "Personal", color: "bg-category-personal" },
};

export const useTaskScheduler = () => {
  const [scheduledBlocks, setScheduledBlocks] = useState<TimeBlock[]>([]);

  const parseTaskInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Extract task name
    let taskName = input;
    if (lowerInput.includes(' due ')) {
      taskName = input.split(' due ')[0].replace(/^i have (an?|a) /, '');
    }
    
    // Determine task duration and sessions
    let totalHours = 3; // default
    let sessions = 3; // default sessions
    
    if (lowerInput.includes('essay') || lowerInput.includes('report')) {
      totalHours = 4;
      sessions = 4;
    } else if (lowerInput.includes('project')) {
      totalHours = 6;
      sessions = 5;
    } else if (lowerInput.includes('assignment')) {
      totalHours = 2;
      sessions = 2;
    }
    
    const hoursPerSession = Math.ceil(totalHours / sessions);
    
    // Generate schedule for the next week (skip weekends)
    const today = new Date();
    const blocks: TimeBlock[] = [];
    let sessionsScheduled = 0;
    
    for (let day = 1; day <= 7 && sessionsScheduled < sessions; day++) {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + day);
      
      // Skip weekends
      if (scheduleDate.getDay() === 0 || scheduleDate.getDay() === 6) continue;
      
      const startHour = 14 + (sessionsScheduled * 2); // Start at 2 PM, space out sessions
      const endHour = startHour + hoursPerSession;
      
      if (endHour <= 18) { // Don't schedule past 6 PM
        blocks.push({
          id: `scheduled-${Date.now()}-${sessionsScheduled}`,
          title: `${taskName} - Session ${sessionsScheduled + 1}`,
          startTime: `${startHour.toString().padStart(2, '0')}:00`,
          endTime: `${endHour.toString().padStart(2, '0')}:00`,
          duration: `${hoursPerSession}h`,
          category: 'study',
          color: CATEGORIES.study.color,
          date: scheduleDate.toISOString().split('T')[0],
        });
        sessionsScheduled++;
      }
    }
    
    return blocks;
  }, []);

  const scheduleTask = useCallback((input: string) => {
    const newBlocks = parseTaskInput(input);
    setScheduledBlocks(prev => [...prev, ...newBlocks]);
    return newBlocks;
  }, [parseTaskInput]);

  return { scheduledBlocks, scheduleTask, setScheduledBlocks };
};